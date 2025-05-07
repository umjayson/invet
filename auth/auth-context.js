"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { useRouter } from "next/router"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const auth = getAuth()
  const db = getFirestore()

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user)

        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole(userData.role)
          } else {
            console.error("No user data found")
            setUserRole(null)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        // User is signed out
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign in function
  const login = async (email, password) => {
    setError(null)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user role
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserRole(userData.role)

        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/admin/dashboard")
        } else if (userData.role === "team") {
          router.push("/team/dashboard")
        } else if (userData.role === "employee") {
          router.push("/chat")
        }
      }

      return user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign up function for admin
  const createAdminAccount = async (email, password, name, adminPin) => {
    setError(null)
    try {
      // Verify admin PIN
      const configDoc = await getDoc(doc(db, "appConfig", "adminConfig"))
      if (!configDoc.exists() || configDoc.data().adminPin !== adminPin) {
        throw new Error("Invalid admin PIN")
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        role: "admin",
        createdAt: new Date(),
      })

      // Store in admins collection as well
      await setDoc(doc(db, "admins", user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        createdAt: new Date(),
      })

      setUserRole("admin")
      router.push("/admin/dashboard")

      return user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign up function for team
  const createTeamAccount = async (email, password, teamName, teamDetails) => {
    setError(null)
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Generate unique team PIN
      const teamPin = Math.floor(100000 + Math.random() * 900000).toString()

      // Store team data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        name: teamName,
        role: "team",
        teamPin: teamPin,
        teamDetails: teamDetails,
        createdAt: new Date(),
      })

      // Create team document
      const teamRef = doc(db, "teams", user.uid)
      await setDoc(teamRef, {
        teamId: user.uid,
        teamName: teamName,
        ownerEmail: email,
        teamPin: teamPin,
        members: [],
        ...teamDetails,
        createdAt: new Date(),
      })

      // Create team chat group
      const chatRef = doc(collection(db, "chats"))
      await setDoc(chatRef, {
        id: chatRef.id,
        type: "teamChat",
        teamId: user.uid,
        teamName: teamName,
        participants: [user.uid],
        title: `${teamName} Team Chat`,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      })

      // Update team with chat reference
      await setDoc(teamRef, { teamChatId: chatRef.id }, { merge: true })

      setUserRole("team")
      router.push("/team/dashboard")

      return { user, teamPin }
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign up function for employee
  const createEmployeeAccount = async (email, password, name, teamPin) => {
    setError(null)
    try {
      // Verify team PIN
      const teamsQuery = query(collection(db, "teams"), where("teamPin", "==", teamPin))
      const teamSnapshot = await getDocs(teamsQuery)

      if (teamSnapshot.empty) {
        throw new Error("Invalid team PIN")
      }

      const teamDoc = teamSnapshot.docs[0]
      const teamData = teamDoc.data()

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Store employee data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        role: "employee",
        teamId: teamDoc.id,
        teamName: teamData.teamName,
        createdAt: new Date(),
      })

      // Add employee to team members
      const teamRef = doc(db, "teams", teamDoc.id)
      const memberData = {
        uid: user.uid,
        name: name,
        email: email,
        joinedAt: new Date(),
      }

      await setDoc(
        teamRef,
        {
          members: [...teamData.members, memberData],
        },
        { merge: true },
      )

      // Add employee to team chat
      if (teamData.teamChatId) {
        const chatRef = doc(db, "chats", teamData.teamChatId)
        const chatDoc = await getDoc(chatRef)

        if (chatDoc.exists()) {
          const chatData = chatDoc.data()
          await setDoc(
            chatRef,
            {
              participants: [...chatData.participants, user.uid],
            },
            { merge: true },
          )
        }
      }

      setUserRole("employee")
      router.push("/chat")

      return user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign out function
  const logout = async () => {
    setError(null)
    try {
      await signOut(auth)
      router.push("/auth/login")
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Check if user is authenticated and redirect if needed
  const checkAuth = () => {
    if (!loading && !currentUser) {
      router.push("/auth/login")
      return false
    }
    return true
  }

  // Check if user has specific role
  const checkRole = (requiredRole) => {
    if (!loading && currentUser) {
      if (userRole !== requiredRole) {
        // Redirect based on actual role
        if (userRole === "admin") {
          router.push("/admin/dashboard")
        } else if (userRole === "team") {
          router.push("/team/dashboard")
        } else if (userRole === "employee") {
          router.push("/chat")
        } else {
          router.push("/auth/login")
        }
        return false
      }
      return true
    }
    return false
  }

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    createAdminAccount,
    createTeamAccount,
    createEmployeeAccount,
    logout,
    checkAuth,
    checkRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
