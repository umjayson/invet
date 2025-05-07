// This file handles authentication UI interactions
document.addEventListener("DOMContentLoaded", () => {
  // Get form elements if they exist
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const forgotPasswordForm = document.getElementById("forgot-password-form")
  const logoutButtons = document.querySelectorAll(".logout-button")

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const rememberMe = document.getElementById("remember")?.checked || false
      const errorElement = document.getElementById("login-error")
      const loadingElement = document.getElementById("login-loading")
      const loginButton = document.querySelector(".auth-button")

      if (errorElement) errorElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")
      if (loginButton) {
        loginButton.disabled = true
        loginButton.querySelector("span").style.opacity = "0.5"
      }

      try {
        // Set persistence based on remember me checkbox
        const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION

        await firebase.auth().setPersistence(persistence)

        // Login with Firebase
        await window.AuthContext.login(email, password)

        // Redirect based on role
        const user = window.AuthContext.getCurrentUser()
        if (user) {
          switch (user.role) {
            case "admin":
              window.location.href = "/admin/dashboard.html"
              break
            case "team":
              window.location.href = "/team/dashboard.html"
              break
            case "employee":
              window.location.href = "/employee/dashboard.html"
              break
            default:
              window.location.href = "/index.html"
          }
        }
      } catch (error) {
        console.error("Login error:", error)
        if (errorElement) {
          if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            errorElement.textContent = "Invalid email or password"
          } else if (error.code === "auth/too-many-requests") {
            errorElement.textContent = "Too many failed login attempts. Please try again later"
          } else {
            errorElement.textContent = error.message || "An error occurred during login"
          }
        }
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
        if (loginButton) {
          loginButton.disabled = false
          loginButton.querySelector("span").style.opacity = "1"
        }
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
      const pin = document.getElementById("pin").value
      const role = document.querySelector('input[name="role"]:checked')?.value || "employee"
      const errorElement = document.getElementById("register-error")
      const loadingElement = document.getElementById("register-loading")
      const registerButton = document.querySelector(".auth-button")

      if (errorElement) errorElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")
      if (registerButton) {
        registerButton.disabled = true
        registerButton.querySelector("span").style.opacity = "0.5"
      }

      try {
        // Register with Firebase
        await window.AuthContext.register(email, password, name, role, pin)

        // Redirect based on role
        const user = window.AuthContext.getCurrentUser()
        if (user) {
          switch (user.role) {
            case "admin":
              window.location.href = "/admin/dashboard.html"
              break
            case "team":
              window.location.href = "/team/dashboard.html"
              break
            case "employee":
              window.location.href = "/employee/dashboard.html"
              break
            default:
              window.location.href = "/index.html"
          }
        }
      } catch (error) {
        console.error("Registration error:", error)
        if (errorElement) {
          errorElement.textContent = error.message || "An error occurred during registration"
        }
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
        if (registerButton) {
          registerButton.disabled = false
          registerButton.querySelector("span").style.opacity = "1"
        }
      }
    })
  }

  // Handle logout
  if (logoutButtons.length > 0) {
    logoutButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault()

        try {
          await window.AuthContext.logout()
          window.location.href = "/auth/login.html"
        } catch (error) {
          console.error("Logout error:", error)
          alert("Failed to log out. Please try again.")
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
      const resetButton = document.querySelector(".auth-button")

      if (errorElement) errorElement.textContent = ""
      if (successElement) successElement.textContent = ""
      if (loadingElement) loadingElement.classList.remove("hidden")
      if (resetButton) {
        resetButton.disabled = true
        resetButton.querySelector("span").style.opacity = "0.5"
      }

      try {
        // Send password reset email with Firebase
        await firebase.auth().sendPasswordResetEmail(email)

        if (successElement) {
          successElement.textContent = "Password reset email sent. Check your inbox."
        }
      } catch (error) {
        console.error("Forgot password error:", error)
        if (errorElement) {
          if (error.code === "auth/user-not-found") {
            errorElement.textContent = "No account found with this email address"
          } else {
            errorElement.textContent = error.message || "Failed to send reset email"
          }
        }
      } finally {
        if (loadingElement) loadingElement.classList.add("hidden")
        if (resetButton) {
          resetButton.disabled = false
          resetButton.querySelector("span").style.opacity = "1"
        }
      }
    })
  }

  // Check authentication status for protected pages
  const isProtectedPage = document.body.classList.contains("protected-page")
  if (isProtectedPage) {
    const requiredRole = document.body.dataset.requiredRole

    // Function to check auth and redirect if needed
    const checkAuth = () => {
      if (window.AuthContext.loading) {
        // If still loading, check again in 100ms
        setTimeout(checkAuth, 100)
        return
      }

      if (!window.AuthContext.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.href = "/auth/login.html?redirect=" + encodeURIComponent(window.location.pathname)
      } else if (requiredRole && !window.AuthContext.hasRole(requiredRole)) {
        // Redirect to appropriate dashboard if role doesn't match
        const user = window.AuthContext.getCurrentUser()
        if (user) {
          switch (user.role) {
            case "admin":
              window.location.href = "/admin/dashboard.html"
              break
            case "team":
              window.location.href = "/team/dashboard.html"
              break
            case "employee":
              window.location.href = "/employee/dashboard.html"
              break
            default:
              window.location.href = "/index.html"
          }
        }
      }
    }

    // Start auth check
    checkAuth()
  }
})
