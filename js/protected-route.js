// Import the AuthContext (assuming it's in a separate file)
import { AuthContext } from "./auth-context.js"

// This script checks if the current page is protected and redirects if necessary
document.addEventListener("DOMContentLoaded", () => {
  // Check if this is a protected page
  const isProtectedPage = document.body.classList.contains("protected-page")

  if (isProtectedPage) {
    const requiredRole = document.body.dataset.requiredRole

    // Wait for auth to initialize
    const checkAuth = () => {
      if (AuthContext.loading) {
        // If still loading, check again in 100ms
        setTimeout(checkAuth, 100)
        return
      }

      if (!AuthContext.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.href = "/auth/login.html?redirect=" + encodeURIComponent(window.location.pathname)
      } else if (requiredRole && !AuthContext.hasRole(requiredRole)) {
        // Redirect to appropriate dashboard if role doesn't match
        if (AuthContext.userRole === "admin") {
          window.location.href = "/admin/dashboard.html"
        } else if (AuthContext.userRole === "team") {
          window.location.href = "/team/dashboard.html"
        } else if (AuthContext.userRole === "employee") {
          window.location.href = "/employee/dashboard.html"
        } else {
          window.location.href = "/index.html"
        }
      }
    }

    checkAuth()
  }
})
