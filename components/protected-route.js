"use client"

import { useEffect } from "react"
import { useAuth } from "../auth/auth-context"
import { useRouter } from "next/router"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser, userRole, loading, checkAuth, checkRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // First check if user is authenticated
      if (!checkAuth()) {
        return
      }

      // Then check if user has required role (if specified)
      if (requiredRole && !checkRole(requiredRole)) {
        return
      }
    }
  }, [loading, currentUser, userRole, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-xl font-medium text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // If not loading and we've passed the auth checks, render children
  return children
}
