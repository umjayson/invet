"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../auth/auth-context"

export default function Home() {
  const router = useRouter()
  const { currentUser, userRole, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (currentUser) {
      // Redirect based on user role
      if (userRole === "admin") {
        router.push("/admin/dashboard")
      } else if (userRole === "team") {
        router.push("/team/dashboard")
      } else {
        router.push("/chat")
      }
    } else {
      // Not logged in, redirect to login page
      router.push("/auth/login")
    }
  }, [currentUser, userRole, loading, router])

  // Show loading state while checking authentication
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
