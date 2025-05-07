"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setLoading(true)
      if (user) {
        try {
          const userDoc = await firebase.firestore().collection("users").doc(user.uid).get()
          if (userDoc.exists) {
            const userData = userDoc.data()
            setCurrentUser(user)
            setUserRole(userData.role)
          } else {
            setCurrentUser(user)
            setUserRole(null)
            console.log("No user data found in Firestore")
          }
        } catch (err) {
          setError(err.message)
          console.error("Error fetching user data:", err)
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const register = async (email, password, name, role) => {
    try {
      setError(null)
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await firebase.firestore().collection("users").doc(userCredential.user.uid).set({
        email: email,
        name: name,
        role: role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await firebase.auth().signOut()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
