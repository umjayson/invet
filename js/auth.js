// Import AuthContext (assuming it's in a separate file)
import { AuthContext } from "./auth-context.js"

// This file handles authentication UI interactions
document.addEventListener("DOMContentLoaded", () => {
  // Get form elements if they exist
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const forgotPasswordForm = document.getElementById("forgot-password-form")
  const resetPasswordForm = document.getElementById("reset-password-form")
  const logoutButtons = document.querySelectorAll(".logout-button")

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const errorElement = document.getElementById("login-error")
      const loadingElement = document.getElementById("login-loading")

      if (errorElement) errorElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")

      try {
        await AuthContext.login(email, password)

        // Redirect based on role
        if (AuthContext.userRole === "admin") {
          window.location.href = "/admin/dashboard.html"
        } else if (AuthContext.userRole === "team") {
          window.location.href = "/team/dashboard.html"
        } else if (AuthContext.userRole === "employee") {
          window.location.href = "/employee/dashboard.html"
        } else {
          window.location.href = "/index.html"
        }
      } catch (error) {
        if (errorElement) errorElement.textContent = error.message
        console.error("Login error:", error)
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
      }
    })
  }

  // Handle register form submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const name = document.getElementById("name").value
      const role =
        document.querySelector('input[name="role"]:checked')?.value ||
        document.getElementById("role")?.value ||
        "employee"
      const errorElement = document.getElementById("register-error")
      const loadingElement = document.getElementById("register-loading")

      if (errorElement) errorElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")

      try {
        await AuthContext.register(email, password, name, role)

        // Redirect based on role
        if (AuthContext.userRole === "admin") {
          window.location.href = "/admin/dashboard.html"
        } else if (AuthContext.userRole === "team") {
          window.location.href = "/team/dashboard.html"
        } else if (AuthContext.userRole === "employee") {
          window.location.href = "/employee/dashboard.html"
        } else {
          window.location.href = "/index.html"
        }
      } catch (error) {
        if (errorElement) errorElement.textContent = error.message
        console.error("Registration error:", error)
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
      }
    })
  }

  // Handle logout
  if (logoutButtons.length > 0) {
    logoutButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault()

        try {
          await AuthContext.logout()
          window.location.href = "/auth/login.html"
        } catch (error) {
          console.error("Logout error:", error)
        }
      })
    })
  }

  // Handle forgot password form
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const errorElement = document.getElementById("forgot-password-error")
      const successElement = document.getElementById("forgot-password-success")
      const loadingElement = document.getElementById("forgot-password-loading")

      if (errorElement) errorElement.textContent = ""
      if (successElement) successElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")

      try {
        // Simulate password reset email
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (successElement) {
          successElement.textContent = "Password reset email sent. Check your inbox."
        }
      } catch (error) {
        if (errorElement) errorElement.textContent = error.message
        console.error("Forgot password error:", error)
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
      }
    })
  }

  // Handle reset password form
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const errorElement = document.getElementById("reset-password-error")
      const successElement = document.getElementById("reset-password-success")
      const loadingElement = document.getElementById("reset-password-loading")

      if (errorElement) errorElement.textContent = ""
      if (successElement) successElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")

      try {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        // Simulate password reset
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (successElement) {
          successElement.textContent = "Password has been reset successfully."
        }

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/auth/login.html"
        }, 2000)
      } catch (error) {
        if (errorElement) errorElement.textContent = error.message
        console.error("Reset password error:", error)
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
      }
    })
  }

  // Check authentication status for protected pages
  const isProtectedPage = document.body.classList.contains("protected-page")
  if (isProtectedPage) {
    const requiredRole = document.body.dataset.requiredRole

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
})
