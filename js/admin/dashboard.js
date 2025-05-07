document.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase
  try {
    // Assuming firebase and firebaseConfig are available globally
    if (typeof firebase !== "undefined" && typeof firebaseConfig !== "undefined") {
      firebase.initializeApp(firebaseConfig)
    } else {
      console.error("Firebase or firebaseConfig is not defined")
      return
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }

  // Check authentication state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      loadUserData()
      loadDashboardData()
    } else {
      // User is signed out, redirect to auth page
      window.location.href = "../auth.html"
    }
  })

  // Load user data from localStorage
  function loadUserData() {
    const userData = JSON.parse(localStorage.getItem("user"))

    if (userData) {
      // Update UI with user data
      document.getElementById("user-name").textContent = userData.name
      document.getElementById("welcome-name").textContent = userData.name.split(" ")[0]

      // Check if user has the correct role for this page
      if (userData.role !== "admin") {
        // Redirect to the appropriate dashboard
        redirectBasedOnRole(userData.role)
      }
    } else {
      // No user data found, redirect to auth page
      window.location.href = "../auth.html"
    }
  }

  // Redirect based on user role
  function redirectBasedOnRole(role) {
    switch (role) {
      case "admin":
        // Already on admin dashboard
        break
      case "team":
        window.location.href = "../team/dashboard.html"
        break
      case "employee":
        window.location.href = "../employee/dashboard.html"
        break
      default:
        window.location.href = "../auth.html"
    }
  }

  // Load dashboard data
  function loadDashboardData() {
    // This would typically fetch data from Firebase
    // For now, we'll use placeholder data
    updateUserStats()
    updateActivityChart()
    updateRecentUsers()
  }

  // Update user statistics
  function updateUserStats() {
    // In a real app, this would fetch data from Firebase
    const totalUsers = 125
    const activeUsers = 87
    const newUsers = 12

    document.getElementById("total-users").textContent = totalUsers
    document.getElementById("active-users").textContent = activeUsers
    document.getElementById("new-users").textContent = newUsers
  }

  // Update activity chart
  function updateActivityChart() {
    // This would be replaced with a real chart library like Chart.js
    const chartContainer = document.querySelector(".chart-container")

    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="chart-placeholder">
          <p>Activity chart would be displayed here using Chart.js or similar library</p>
          <div class="chart-bars">
            <div class="chart-bar" style="height: 60%;"></div>
            <div class="chart-bar" style="height: 80%;"></div>
            <div class="chart-bar" style="height: 40%;"></div>
            <div class="chart-bar" style="height: 70%;"></div>
            <div class="chart-bar" style="height: 50%;"></div>
            <div class="chart-bar" style="height: 90%;"></div>
            <div class="chart-bar" style="height: 75%;"></div>
          </div>
        </div>
      `
    }
  }

  // Update recent users list
  function updateRecentUsers() {
    // In a real app, this would fetch data from Firebase
    const recentUsersList = document.querySelector(".user-list")

    if (recentUsersList) {
      // We already have placeholder data in the HTML
      // In a real app, you would dynamically generate this list
    }
  }

  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const appContainer = document.querySelector(".app-container")

  if (sidebarToggle && appContainer) {
    sidebarToggle.addEventListener("click", () => {
      appContainer.classList.toggle("sidebar-collapsed")
    })
  }

  // Logout functionality
  const logoutButton = document.getElementById("logout-button")

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Clear user data from localStorage
          localStorage.removeItem("user")

          // Redirect to auth page
          window.location.href = "../auth.html"
        })
        .catch((error) => {
          console.error("Logout error:", error)
        })
    })
  }
})
