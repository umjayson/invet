// Initialize Firebase (ensure firebase and firebaseConfig are globally available)
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase
  try {
    if (typeof firebase !== "undefined" && typeof firebaseConfig !== "undefined") {
      firebase.initializeApp(firebaseConfig)
    } else {
      showToast("Error", "Firebase initialization failed. Please try again later.", "error")
      console.error("Firebase or firebaseConfig is not defined")
    }
  } catch (error) {
    showToast("Error", "Firebase initialization failed. Please try again later.", "error")
    console.error("Firebase initialization error:", error)
  }

  // DOM Elements
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const forgotPasswordForm = document.getElementById("forgot-password-form")
  const successMessage = document.getElementById("success-message")
  const successTitle = document.getElementById("success-title")
  const successText = document.getElementById("success-text")
  const successButton = document.getElementById("success-button")

  // Tab switching
  const tabs = document.querySelectorAll(".auth-tab")
  const tabIndicator = document.querySelector(".auth-tab-indicator")
  const forms = document.querySelectorAll(".auth-form")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-tab")

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Move tab indicator
      const tabIndex = Array.from(tabs).indexOf(tab)
      tabIndicator.style.left = `${tabIndex * 50}%`

      // Show active form
      forms.forEach((form) => form.classList.remove("active"))
      document.getElementById(`${tabName}-form`).classList.add("active")
    })
  })

  // Password visibility toggle
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input")
      const icon = button.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Password strength meter
  const registerPassword = document.getElementById("register-password")
  const strengthSegments = document.querySelectorAll(".strength-segment")
  const strengthText = document.querySelector(".strength-text")

  registerPassword.addEventListener("input", () => {
    const password = registerPassword.value
    const strength = checkPasswordStrength(password)

    // Update strength meter
    strengthSegments.forEach((segment, index) => {
      segment.className = "strength-segment"
      if (index < strength.score) {
        segment.classList.add(strength.class)
      }
    })

    strengthText.textContent = strength.text
  })

  // Forgot password link
  const forgotPasswordLink = document.getElementById("forgot-password-link")
  const backToLoginButton = document.getElementById("back-to-login")

  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault()
    forms.forEach((form) => form.classList.remove("active"))
    forgotPasswordForm.classList.add("active")
  })

  backToLoginButton.addEventListener("click", () => {
    forms.forEach((form) => form.classList.remove("active"))
    loginForm.classList.add("active")
  })

  // Form submissions
  loginForm.addEventListener("submit", handleLogin)
  registerForm.addEventListener("submit", handleRegister)
  forgotPasswordForm.addEventListener("submit", handleForgotPassword)

  // Initialize the auth state
  firebase.auth().onAuthStateChanged(handleAuthStateChanged)
})

// Password strength checker
function checkPasswordStrength(password) {
  if (!password) {
    return { score: 0, text: "Password strength", class: "" }
  }

  let score = 0

  // Length check
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Complexity checks
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Cap at 4
  score = Math.min(score, 4)

  const strengthMap = {
    0: { text: "Too weak", class: "weak" },
    1: { text: "Weak", class: "weak" },
    2: { text: "Medium", class: "medium" },
    3: { text: "Strong", class: "strong" },
    4: { text: "Very strong", class: "strong" },
  }

  return {
    score,
    text: strengthMap[score].text,
    class: strengthMap[score].class,
  }
}

// Form validation
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function validatePassword(password) {
  return password.length >= 8
}

function validateName(name) {
  return name.trim().length >= 2
}

// Form handlers
function handleLogin(e) {
  e.preventDefault()

  // Get form values
  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const rememberMe = document.getElementById("remember-me").checked

  // Reset error messages
  document.getElementById("login-email-error").textContent = ""
  document.getElementById("login-password-error").textContent = ""

  // Validate form
  let isValid = true

  if (!validateEmail(email)) {
    document.getElementById("login-email-error").textContent = "Please enter a valid email address"
    isValid = false
  }

  if (!password) {
    document.getElementById("login-password-error").textContent = "Please enter your password"
    isValid = false
  }

  if (!isValid) return

  // Show loading state
  const loginButton = document.getElementById("login-button")
  loginButton.classList.add("loading")
  loginButton.disabled = true

  // Set persistence
  const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION

  firebase
    .auth()
    .setPersistence(persistence)
    .then(() => {
      // Sign in with email and password
      return firebase.auth().signInWithEmailAndPassword(email, password)
    })
    .then((userCredential) => {
      // Get user data from Firestore
      return firebase.firestore().collection("users").doc(userCredential.user.uid).get()
    })
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data()
        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: doc.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
          }),
        )

        // Redirect based on role
        redirectBasedOnRole(userData.role)
      } else {
        throw new Error("User data not found")
      }
    })
    .catch((error) => {
      loginButton.classList.remove("loading")
      loginButton.disabled = false

      console.error("Login error:", error)

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        document.getElementById("login-password-error").textContent = "Invalid email or password"
      } else if (error.code === "auth/too-many-requests") {
        document.getElementById("login-password-error").textContent =
          "Too many failed login attempts. Please try again later"
      } else {
        showToast("Error", error.message, "error")
      }
    })
}

function handleRegister(e) {
  e.preventDefault()

  // Get form values
  const name = document.getElementById("register-name").value
  const email = document.getElementById("register-email").value
  const password = document.getElementById("register-password").value
  const role = document.querySelector('input[name="role"]:checked').value
  const termsAccepted = document.getElementById("terms-checkbox").checked

  // Reset error messages
  document.getElementById("register-name-error").textContent = ""
  document.getElementById("register-email-error").textContent = ""
  document.getElementById("register-password-error").textContent = ""
  document.getElementById("terms-error").textContent = ""

  // Validate form
  let isValid = true

  if (!validateName(name)) {
    document.getElementById("register-name-error").textContent = "Please enter your full name"
    isValid = false
  }

  if (!validateEmail(email)) {
    document.getElementById("register-email-error").textContent = "Please enter a valid email address"
    isValid = false
  }

  if (!validatePassword(password)) {
    document.getElementById("register-password-error").textContent = "Password must be at least 8 characters long"
    isValid = false
  }

  if (!termsAccepted) {
    document.getElementById("terms-error").textContent = "You must accept the Terms of Service and Privacy Policy"
    isValid = false
  }

  if (!isValid) return

  // Show loading state
  const registerButton = document.getElementById("register-button")
  registerButton.classList.add("loading")
  registerButton.disabled = true

  // Create user with email and password
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add user data to Firestore
      return firebase.firestore().collection("users").doc(userCredential.user.uid).set({
        name: name,
        email: email,
        role: role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    })
    .then(() => {
      // Show success message
      showSuccessMessage(
        "Account Created!",
        "Your account has been created successfully. You can now log in.",
        "Go to Login",
      )

      // Reset form
      registerForm.reset()

      // Switch to login tab after success
      successButton.addEventListener(
        "click",
        () => {
          document.querySelector('[data-tab="login"]').click()
          hideSuccessMessage()
        },
        { once: true },
      )
    })
    .catch((error) => {
      registerButton.classList.remove("loading")
      registerButton.disabled = false

      console.error("Registration error:", error)

      if (error.code === "auth/email-already-in-use") {
        document.getElementById("register-email-error").textContent = "This email is already in use"
      } else {
        showToast("Error", error.message, "error")
      }
    })
}

function handleForgotPassword(e) {
  e.preventDefault()

  // Get form values
  const email = document.getElementById("forgot-email").value

  // Reset error messages
  document.getElementById("forgot-email-error").textContent = ""

  // Validate form
  if (!validateEmail(email)) {
    document.getElementById("forgot-email-error").textContent = "Please enter a valid email address"
    return
  }

  // Show loading state
  const resetButton = document.getElementById("reset-button")
  resetButton.classList.add("loading")
  resetButton.disabled = true

  // Send password reset email
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      // Show success message
      showSuccessMessage("Email Sent!", "Check your email for a link to reset your password.", "Back to Login")

      // Reset form
      forgotPasswordForm.reset()

      // Switch to login form after success
      successButton.addEventListener(
        "click",
        () => {
          forms.forEach((form) => form.classList.remove("active"))
          loginForm.classList.add("active")
          hideSuccessMessage()
        },
        { once: true },
      )
    })
    .catch((error) => {
      resetButton.classList.remove("loading")
      resetButton.disabled = false

      console.error("Password reset error:", error)

      if (error.code === "auth/user-not-found") {
        document.getElementById("forgot-email-error").textContent = "No account found with this email"
      } else {
        showToast("Error", error.message, "error")
      }
    })
}

// Auth state change handler
function handleAuthStateChanged(user) {
  if (user) {
    // User is signed in
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data()

          // Store user data in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: user.uid,
              email: userData.email,
              name: userData.name,
              role: userData.role,
            }),
          )

          // Check if we're on the auth page and redirect if needed
          if (window.location.pathname.includes("auth.html")) {
            redirectBasedOnRole(userData.role)
          }
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error)
      })
  } else {
    // User is signed out
    localStorage.removeItem("user")
  }
}

// Redirect based on user role
function redirectBasedOnRole(role) {
  switch (role) {
    case "team":
      window.location.href = "team/dashboard.html"
      break
    case "employee":
      window.location.href = "employee/dashboard.html"
      break
    default:
      window.location.href = "index.html"
  }
}

// Success message helpers
function showSuccessMessage(title, text, buttonText) {
  const successTitle = document.getElementById("success-title")
  const successText = document.getElementById("success-text")
  const successButton = document.getElementById("success-button")
  const successMessage = document.getElementById("success-message")
  const forms = document.querySelectorAll(".auth-form")

  successTitle.textContent = title
  successText.textContent = text
  successButton.textContent = buttonText

  forms.forEach((form) => (form.style.display = "none"))
  successMessage.style.display = "block"
}

function hideSuccessMessage() {
  const successMessage = document.getElementById("success-message")
  const forms = document.querySelectorAll(".auth-form")

  successMessage.style.display = "none"
  forms.forEach((form) => {
    if (form.classList.contains("active")) {
      form.style.display = "block"
    }
  })
}

// Toast notification
function showToast(title, message, type = "info") {
  const toastContainer = document.getElementById("toast-container")

  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  let iconClass
  switch (type) {
    case "success":
      iconClass = "fa-check-circle"
      break
    case "error":
      iconClass = "fa-exclamation-circle"
      break
    case "warning":
      iconClass = "fa-exclamation-triangle"
      break
    default:
      iconClass = "fa-info-circle"
  }

  toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `

  toastContainer.appendChild(toast)

  // Close button functionality
  const closeButton = toast.querySelector(".toast-close")
  closeButton.addEventListener("click", () => {
    toast.remove()
  })

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove()
    }
  }, 3000)
}
