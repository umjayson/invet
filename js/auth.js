// Auth functionality
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const loginTab = document.querySelector('[data-tab="login"]')
  const signupTab = document.querySelector('[data-tab="signup"]')
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const teamCodeSection = document.getElementById("team-code-section")

  if (loginTab && signupTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active")
      signupTab.classList.remove("active")
      loginForm.classList.add("active")
      signupForm.classList.remove("active")

      // Check URL params for mode
      const urlParams = new URLSearchParams(window.location.search)
      const mode = urlParams.get("mode")

      if (mode === "team") {
        teamCodeSection.classList.remove("hidden")
      } else {
        teamCodeSection.classList.add("hidden")
      }
    })

    signupTab.addEventListener("click", () => {
      signupTab.classList.add("active")
      loginTab.classList.remove("active")
      signupForm.classList.add("active")
      loginForm.classList.remove("active")
      teamCodeSection.classList.add("hidden")
    })
  }

  // Password visibility toggle
  const passwordToggles = document.querySelectorAll(".password-toggle")

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const passwordInput = toggle.parentElement.querySelector("input")
      const eyeOpen = toggle.querySelector(".eye-open")
      const eyeClosed = toggle.querySelector(".eye-closed")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        eyeOpen.classList.add("hidden")
        eyeClosed.classList.remove("hidden")
      } else {
        passwordInput.type = "password"
        eyeOpen.classList.remove("hidden")
        eyeClosed.classList.add("hidden")
      }
    })
  })

  // Check URL params for mode on page load
  const urlParams = new URLSearchParams(window.location.search)
  const mode = urlParams.get("mode")

  if (mode === "team" && teamCodeSection) {
    teamCodeSection.classList.remove("hidden")
  }

  // Form submission handling
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // In a real app, this would authenticate with Firebase
      // For demo purposes, we'll just redirect to the appropriate page
      if (mode === "admin") {
        window.location.href = "admin/dashboard.html"
      } else if (mode === "team") {
        window.location.href = "team/dashboard.html"
      } else {
        window.location.href = "chat.html"
      }
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm-password").value

      // Basic validation
      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      // In a real app, this would create a new user in Firebase
      // For demo purposes, we'll just redirect to a success page
      window.location.href = "signup/success.html"
    })
  }
})
