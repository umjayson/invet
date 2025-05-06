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

  const firebaseConfig = {
  apiKey: "AIzaSyC05QNY81qgL-UiZqILPJtpGyviEKXk4uw",
  authDomain: "deliverydriverapp-41411.firebaseapp.com",
  projectId: "deliverydriverapp-41411",
  storageBucket: "deliverydriverapp-41411.firebasestorage.app",
  messagingSenderId: "435784752182",
  appId: "1:435784752182:web:e728531ea2bf05c7ec0c97",
  measurementId: "G-BM62BLBPL8"
};

  // Check if config has been updated
  const isConfigPlaceholder = firebaseConfig.apiKey === "AIzaSyC05QNY81qgL-UiZqILPJtpGyviEKXk4uw"

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
