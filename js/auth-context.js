// Import Firebase (if using modules)
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

// Or, if using CDN, ensure firebase is declared globally
// For example: <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
//              <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"></script>
//              <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"></script>
// Then, initialize Firebase:
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
// firebase.initializeApp(firebaseConfig);

// Auth Context for Firebase integration
const AuthContext = {
  currentUser: null,
  userRole: null,
  loading: true,
  error: null,

  // Initialize auth state
  init() {
    this.loading = true

    // Check if Firebase is available
    if (typeof firebase === "undefined") {
      console.error("Firebase is not available")
      this.loading = false
      return
    }

    // Set up auth state listener
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await firebase
            .firestore()
            .collection("InvetChat")
            .doc("users")
            .collection("users")
            .doc(user.uid)
            .get()

          if (userDoc.exists) {
            const userData = userDoc.data()
            this.currentUser = {
              uid: user.uid,
              email: user.email,
              ...userData,
            }
            this.userRole = userData.role

            // Store minimal user data in localStorage for quick access
            localStorage.setItem(
              "user",
              JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: userData.name,
                role: userData.role,
              }),
            )
          } else {
            console.warn("User document not found in Firestore")
            this.currentUser = {
              uid: user.uid,
              email: user.email,
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          this.error = "Failed to load user data"
          this.currentUser = {
            uid: user.uid,
            email: user.email,
          }
        }
      } else {
        // No user is signed in
        this.currentUser = null
        this.userRole = null
        localStorage.removeItem("user")
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
    })
  },

  // Login function
  async login(email, password) {
    try {
      this.error = null
      this.loading = true

      // Sign in with Firebase
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)

      // Get user data from Firestore
      const userDoc = await firebase
        .firestore()
        .collection("InvetChat")
        .doc("users")
        .collection("users")
        .doc(userCredential.user.uid)
        .get()

      if (userDoc.exists) {
        const userData = userDoc.data()
        this.currentUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ...userData,
        }
        this.userRole = userData.role

        // Store minimal user data in localStorage for quick access
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: userData.name,
            role: userData.role,
          }),
        )
      } else {
        throw new Error("User data not found in database")
      }

      this.loading = false
      return this.currentUser
    } catch (err) {
      this.error = err.message
      this.loading = false
      throw err
    }
  },

  // Register function with pin validation
  async register(email, password, name, role, pin) {
    try {
      this.error = null
      this.loading = true

      // Validate pin based on role
      const configDoc = await firebase.firestore().collection("config").doc("default").get()

      if (!configDoc.exists) {
        throw new Error("Configuration not found")
      }

      const config = configDoc.data()

      // Check if pin is valid for the role
      if (role === "admin" && pin !== config.adminPins) {
        throw new Error("Invalid admin PIN")
      } else if (role === "team" && pin !== config.teamCreationPins) {
        throw new Error("Invalid team PIN")
      }

      // Create user in Firebase Auth
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)

      // Create user document in Firestore
      const userData = {
        name,
        email,
        role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      await firebase
        .firestore()
        .collection("InvetChat")
        .doc("users")
        .collection("users")
        .doc(userCredential.user.uid)
        .set(userData)

      this.currentUser = {
        uid: userCredential.user.uid,
        email,
        ...userData,
      }
      this.userRole = role

      // Store minimal user data in localStorage for quick access
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCredential.user.uid,
          email,
          name,
          role,
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

  // Logout function
  async logout() {
    try {
      this.error = null

      // Sign out from Firebase
      await firebase.auth().signOut()

      // Clear user data
      this.currentUser = null
      this.userRole = null
      localStorage.removeItem("user")

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

  // Get current user from localStorage (for quick access)
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser
    }

    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        this.currentUser = parsedUser
        this.userRole = parsedUser.role
        return parsedUser
      } catch (err) {
        console.error("Error parsing user data:", err)
        localStorage.removeItem("user")
      }
    }

    return null
  },
}

// Initialize auth context when the script loads
document.addEventListener("DOMContentLoaded", () => {
  AuthContext.init()
})

// Export the auth context
window.AuthContext = AuthContext
