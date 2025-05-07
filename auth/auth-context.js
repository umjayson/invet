"use client"

// auth/auth-context.js
import { createContext, useContext, useState, useEffect } from "react"
import { firebaseConfig } from "../js/firebase-config" // Assuming this is where firebaseConfig is defined

// Initialize Firebase (if not already initialized)
let firebaseApp
if (typeof firebase !== "undefined" && firebase.apps.length === 0) {
  firebaseApp = firebase.initializeApp(firebaseConfig)
} else {
  firebaseApp = firebase.app()
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user)
        try {
          const userDoc = await firebase.firestore().collection("users").doc(user.uid).get()
          if (userDoc.exists) {
            const userData = userDoc.data()
            setUserRole(userData.role)
          } else {
            setUserRole(null)
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    currentUser,
    userRole,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
