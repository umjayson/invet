// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC05QNY81qgL-UiZqILPJtpGyviEKXk4uw",
  authDomain: "deliverydriverapp-41411.firebaseapp.com",
  projectId: "deliverydriverapp-41411",
  storageBucket: "deliverydriverapp-41411.firebasestorage.app",
  messagingSenderId: "435784752182",
  appId: "1:435784752182:web:e728531ea2bf05c7ec0c97",
  measurementId: "G-BM62BLBPL8"
}

// Initialize Firebase if it hasn't been initialized yet
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
