document.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase
  try {
    // Assuming firebase and firebaseConfig are available globally or imported elsewhere.
    // If not, you'll need to import them here.
    // For example:
    // import firebase from 'firebase/app';
    // import 'firebase/auth';
    // import firebaseConfig from './firebaseConfig'; // Assuming firebaseConfig is in a separate file
    if (typeof firebase !== "undefined" && typeof firebaseConfig !== "undefined") {
      firebase.initializeApp(firebaseConfig)
    } else {
      console.error("Firebase or firebaseConfig is not defined. Ensure Firebase SDK is properly included.")
      return // Stop execution if Firebase is not initialized
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }

  // Check authentication state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      loadUserData()
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
      if (userData.role !== "employee") {
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
        window.location.href = "../admin/dashboard.html"
        break
      case "team":
        window.location.href = "../team/dashboard.html"
        break
      case "employee":
        // Already on employee dashboard
        break
      default:
        window.location.href = "../auth.html"
    }
  }

  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const appContainer = document.querySelector(".app-container")

  sidebarToggle.addEventListener("click", () => {
    appContainer.classList.toggle("sidebar-collapsed")
  })

  // Logout functionality
  const logoutButton = document.getElementById("logout-button")

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

  // Mark all notifications as read
  const markAllReadButton = document.querySelector(".mark-all-read")

  markAllReadButton.addEventListener("click", () => {
    const unreadNotifications = document.querySelectorAll(".notification-item.unread")
    unreadNotifications.forEach((notification) => {
      notification.classList.remove("unread")
    })
  })
})
