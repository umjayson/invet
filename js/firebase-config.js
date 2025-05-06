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
  const isConfigPlaceholder = firebaseConfig.apiKey === "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXshdWFKBWA5GK\nfB8BnZhBYTAi2cguztRkVxknfOOVXuwizL8yeEn5ODACZNK57RS52x73igwxn07v\ntKcSLt3Cmj1QL1GA+aByH8HhQlaytmF41dGGgNGNKjWwnVk7RCN8giXdGzf+Jpix\nxGC5vNOqPwoQeFIUEUdFDVYKkztE3mRJHRHV9c2qrimFGx7tYrwaNObf7PXpV7Yx\na19wxXKyvINsgciQC36phHYmYakfLM1nS7AuqiRb+CiMd5ZcB5E32FkcFtTqNVub\naSvYhKjmQE0YVAtZ1MuLg6t+kilcjylxgYfgdFNZr50Df9X0aJB3HYmpV/1TWLzd\nAGlspyQtAgMBAAECggEAJgrkHlLa6OdJMx0wm3Od0NuiOkM6mD6Hdkh/hu8jlfyx\npIKLeok/J/CG3brSPA1wUrHYoMSujS1CGwxHj+BP/fM3aCoNuxYfPi+nrCm6W2Qw\nqqCYxK3+n3PT9iBn1dyfN6TeAQbH8oVUatRwW3Q28u2PRRUfpGe242LWTp2g0gK+\n5n32PLfNhtRJVy+fluSfJaYsQfvRaPy+gsplbxLxG2eUMOhaJRqaISUZMvG26hES\nh/SDyqZ67zyQ30JeqsGcqPrUhAUmItlqSh7oXjnLk+DrJnLw4f2lU6gPjts9rUEk\nPamFQ2ZCdtPlXaoOpwWkGyXq3zAk4iIcL+DS5+cNswKBgQDL6ixE3kvXR9VLuY3U\nAjYy+wFO3vZUe65Ae6tpvnilNaPAEfKTY4V/NlCnki0kj3Cr4vm5TtoBrazYlU1/\n2zoUOt4GZ6hY39RUU91cQoVjaz9hO5bANon9zra920ws8ezyyOpAuv7IKaD3/KhB\n3YeGFfVNJF9tWUj143+L29pBBwKBgQC+cVqI96nNiTDCY7b+QssvTGXx3AgL1tA6\nhT1d4pRzHG/M7uepyN00V6cQdQX0mHUqOzKfG8bL20sZs4eLmBOk3oTfO/LG9hkk\nkdU+ii4gkAQHPzusHYdTw73K9YKdfwiGWUATnT8Pky1xeBbB+6HKwzFBLsvXrUGb\nmHTqC9oIKwKBgBw5Ul1J43dtsuEjUrUohTXzNhAjnja9U7YLKAOf4HUFgp/AHDI4\nUS71Zp57BhKMZAz2gpgaiOQ4lLb5m1t6DYTlTPvX9x4uBOaTIQ13C51iJ8iehdQe\n+GSP6w1GQDnsVl6YXowNFdzAnk4Uw3kyX2K4wVYnFao99HJMRcgm6wObAoGAP5kf\nQOpkXG1aSTB/pf2sWQlMai6uyTVdqI1iZv4J0T9H3spRtxOLO7Wh5w8NhBd92TKX\nvybJhr6fH+Aife21cbOV7+7XLrZ0ww+ohRAkQ1+U2M63IM1jqgeOVD8U9X+82xDn\nIyW6L3tZC7Gs9+8OouX4huoXzNjhNhL9yENY9q0CgYEAlrS9+Awawrr+9M/tUkOE\ndEHFL8cLiHavxUcZXlKCm3XRXu8NI2EQUc6KeyC1oeyZos2RLZpQw8HaydYwRcGS\nqzZhos8BpszpxDD2sCqQZypvX+qhziz4rr6lPy9y0egXxBsfmv12Uu5Swgc5LN72\nU/UkSp8mhF3yintG4gJoYLI=\n-----END PRIVATE KEY-----\n"

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
