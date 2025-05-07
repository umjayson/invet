// Import the Firebase SDK
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC05QNY81qgL-UiZqILPJtpGyviEKXk4uw",
  authDomain: "deliverydriverapp-41411.firebaseapp.com",
  projectId: "deliverydriverapp-41411",
  storageBucket: "deliverydriverapp-41411.firebasestorage.app",
  messagingSenderId: "435784752182",
  appId: "1:435784752182:web:e728531ea2bf05c7ec0c97",
  measurementId: "G-BM62BLBPL8",
}

// Initialize Firebase if it hasn't been initialized yet
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// For demo purposes, we'll add some mock authentication functions
const mockAuth = {
  // Mock user data
  users: [
    { uid: "admin123", email: "admin@invetchat.com", name: "Admin User", role: "admin" },
    { uid: "team123", email: "team@invetchat.com", name: "Team Lead", role: "team" },
    { uid: "emp123", email: "employee@invetchat.com", name: "John Employee", role: "employee" },
  ],

  // Mock login function
  login: function (email, password) {
    return new Promise((resolve, reject) => {
      const user = this.users.find((u) => u.email === email)
      if (user && password === "password") {
        localStorage.setItem("user", JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error("Invalid email or password"))
      }
    })
  },

  // Mock logout function
  logout: () =>
    new Promise((resolve) => {
      localStorage.removeItem("user")
      resolve()
    }),

  // Mock current user function
  currentUser: () => {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },
}

// Add mock auth to window for global access
window.mockAuth = mockAuth
