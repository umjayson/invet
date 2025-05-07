// Auth Context for vanilla JavaScript
const AuthContext = {
  currentUser: null,
  userRole: null,
  loading: true,
  error: null,

  // Initialize auth state
  init() {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        this.currentUser = parsedUser
        this.userRole = parsedUser.role
      } catch (err) {
        console.error("Error parsing user data:", err)
        localStorage.removeItem("currentUser")
      }
    }
    this.loading = false

    // Dispatch event to notify listeners
    document.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: {
          user: this.currentUser,
          role: this.userRole,
        },
      }),
    )
  },

  // Login function
  async login(email, password) {
    try {
      this.error = null
      this.loading = true

      // For demo purposes, simulate authentication
      // In a real app, this would call Firebase
      if (email === "admin@invetchat.com" && password === "password") {
        const user = { uid: "admin123", email, role: "admin", name: "Admin User" }
        localStorage.setItem("currentUser", JSON.stringify(user))
        this.currentUser = user
        this.userRole = "admin"
      } else if (email === "team@invetchat.com" && password === "password") {
        const user = { uid: "team123", email, role: "team", name: "Team User" }
        localStorage.setItem("currentUser", JSON.stringify(user))
        this.currentUser = user
        this.userRole = "team"
      } else if (email === "employee@invetchat.com" && password === "password") {
        const user = { uid: "emp123", email, role: "employee", name: "Employee User" }
        localStorage.setItem("currentUser", JSON.stringify(user))
        this.currentUser = user
        this.userRole = "employee"
      } else {
        throw new Error("Invalid email or password")
      }

      // Dispatch event to notify listeners
      document.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: {
            user: this.currentUser,
            role: this.userRole,
          },
        }),
      )

      this.loading = false
      return this.currentUser
    } catch (err) {
      this.error = err.message
      this.loading = false
      throw err
    }
  },

  // Register function
  async register(email, password, name, role) {
    try {
      this.error = null
      this.loading = true

      // For demo purposes, simulate registration
      // In a real app, this would call Firebase
      const uid = "user_" + Math.random().toString(36).substr(2, 9)
      const user = { uid, email, name, role }

      localStorage.setItem("currentUser", JSON.stringify(user))
      this.currentUser = user
      this.userRole = role

      // Dispatch event to notify listeners
      document.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: {
            user: this.currentUser,
            role: this.userRole,
          },
        }),
      )

      this.loading = false
      return user
    } catch (err) {
      this.error = err.message
      this.loading = false
      throw err
    }
  },

  // Logout function
  async logout() {
    try {
      this.error = null

      // Clear user data
      localStorage.removeItem("currentUser")
      this.currentUser = null
      this.userRole = null

      // Dispatch event to notify listeners
      document.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: {
            user: null,
            role: null,
          },
        }),
      )

      return true
    } catch (err) {
      this.error = err.message
      throw err
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser
  },

  // Check if user has specific role
  hasRole(role) {
    return this.currentUser && this.userRole === role
  },
}

// Initialize auth context when the script loads
document.addEventListener("DOMContentLoaded", () => {
  AuthContext.init()
})

// Export the auth context
window.AuthContext = AuthContext
