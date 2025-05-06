// Import the Firebase SDK (modify the path if necessary)
import { initializeApp } from "firebase/app"

// Firebase configuration
document.addEventListener("DOMContentLoaded", () => {
  // Check if Firebase is loaded
  if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded")
    document.getElementById("firebase-warning").classList.remove("hidden")
    return
  }

  // Initialize Firebase with your config
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  }

  // Check if config has been updated
  const isConfigPlaceholder = firebaseConfig.apiKey === "YOUR_API_KEY"

  if (isConfigPlaceholder) {
    console.warn("Firebase configuration is using placeholder values")
    document.getElementById("firebase-warning").classList.remove("hidden")
  } else {
    try {
      // Initialize Firebase
      initializeApp(firebaseConfig)
      console.log("Firebase initialized successfully")
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      document.getElementById("firebase-warning").classList.remove("hidden")
    }
  }
})
