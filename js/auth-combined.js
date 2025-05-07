// Consolidated authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const mode = urlParams.get("mode")

  // Set up mode-specific UI
  if (mode) {
    document.getElementById("mode-indicator").classList.remove("hidden")
    document.getElementById("mode-value").textContent = mode

    if (mode === "team") {
      document.getElementById("team-code-section").classList.remove("hidden")
      document.getElementById("auth-title").textContent = "Team Login"
      document.getElementById("auth-subtitle").textContent = "Sign in to access your team workspace"
    } else if (mode === "admin") {
      document.getElementById("admin-pin-section").classList.remove("hidden")
      document.getElementById("auth-title").textContent = "Admin Login"
      document.getElementById("auth-subtitle").textContent = "Sign in to access the admin dashboard"
    }
  }

  // Tab switching
  const loginTab = document.querySelector('[data-tab="login"]')
  const signupTab = document.querySelector('[data-tab="signup"]')
  const loginFormElement = document.getElementById("login-form")
  const signupFormElement = document.getElementById("signup-form")

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active")
    signupTab.classList.remove("active")
    loginFormElement.classList.add("active")
    signupFormElement.classList.remove("active")
  })

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active")
    loginTab.classList.remove("active")
    signupFormElement.classList.add("active")
    loginFormElement.classList.remove("active")
  })

  // Signup type switching
  const signupTypeTabs = document.querySelectorAll(".signup-type-tab")
  const adminSignupPin = document.getElementById("admin-signup-pin")
  const teamCreationPin = document.getElementById("team-creation-pin")
  const teamNameGroup = document.getElementById("team-name-group")
  const teamDescriptionGroup = document.getElementById("team-description-group")
  const teamSizeGroup = document.getElementById("team-size-group")
  const teamCodeGroup = document.getElementById("team-code-group")
  const joinTeamCodeGroup = document.getElementById("join-team-code-group")
  const signupButtonText = document.getElementById("signup-button-text")

  signupTypeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      signupTypeTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      tab.classList.add("active")

      // Get the signup type
      const signupType = tab.getAttribute("data-type")

      // Hide all type-specific fields
      adminSignupPin.classList.add("hidden")
      teamCreationPin.classList.add("hidden")
      teamNameGroup.classList.add("hidden")
      teamDescriptionGroup.classList.add("hidden")
      teamSizeGroup.classList.add("hidden")
      teamCodeGroup.classList.add("hidden")
      joinTeamCodeGroup.classList.add("hidden")

      // Show fields based on signup type
      if (signupType === "admin") {
        adminSignupPin.classList.remove("hidden")
        signupButtonText.textContent = "Create Admin Account"
      } else if (signupType === "create-team") {
        teamCreationPin.classList.remove("hidden")
        teamNameGroup.classList.remove("hidden")
        teamDescriptionGroup.classList.remove("hidden")
        teamSizeGroup.classList.remove("hidden")
        teamCodeGroup.classList.remove("hidden")
        signupButtonText.textContent = "Create Team & Account"
      } else if (signupType === "join-team") {
        joinTeamCodeGroup.classList.remove("hidden")
        signupButtonText.textContent = "Join Team"
      }
    })
  })

  // Password visibility toggle
  const passwordToggles = document.querySelectorAll(".password-toggle")

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const passwordInput = toggle.parentElement.querySelector("input")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        toggle.textContent = "HIDE"
      } else {
        passwordInput.type = "password"
        toggle.textContent = "SHOW"
      }
    })
  })

  // Generate team code
  const generateCodeBtn = document.getElementById("generate-code-btn")
  const createTeamCodeInput = document.getElementById("create-team-code")

  generateCodeBtn.addEventListener("click", () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    createTeamCodeInput.value = result
  })

  // Password strength checker
  const signupPassword = document.getElementById("signup-password")
  const passwordStrength = document.getElementById("password-strength")
  const strengthText = document.getElementById("strength-text")
  const strengthBars = [
    document.getElementById("strength-1"),
    document.getElementById("strength-2"),
    document.getElementById("strength-3"),
    document.getElementById("strength-4"),
    document.getElementById("strength-5"),
  ]

  signupPassword.addEventListener("input", () => {
    const password = signupPassword.value

    if (password) {
      passwordStrength.classList.remove("hidden")

      let strength = 0

      // Length check
      if (password.length >= 8) strength += 1

      // Contains number
      if (/\d/.test(password)) strength += 1

      // Contains lowercase
      if (/[a-z]/.test(password)) strength += 1

      // Contains uppercase
      if (/[A-Z]/.test(password)) strength += 1

      // Contains special char
      if (/[^A-Za-z0-9]/.test(password)) strength += 1

      // Update strength bars
      strengthBars.forEach((bar, index) => {
        if (index < strength) {
          bar.className =
            "h-1 w-full rounded-full " +
            (strength === 1
              ? "bg-red-500"
              : strength === 2
                ? "bg-orange-500"
                : strength === 3
                  ? "bg-yellow-500"
                  : strength === 4
                    ? "bg-green-500"
                    : "bg-emerald-500")
        } else {
          bar.className = "h-1 w-full rounded-full bg-gray-300/30"
        }
      })

      // Update strength text
      strengthText.textContent =
        strength === 0
          ? "Enter a password"
          : strength === 1
            ? "Very weak - Use at least 8 characters"
            : strength === 2
              ? "Weak - Add numbers"
              : strength === 3
                ? "Medium - Add uppercase letters"
                : strength === 4
                  ? "Strong - Add special characters"
                  : "Excellent password"

      if (strength === 5) {
        strengthText.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Excellent password'
        strengthText.className = "text-xs text-emerald-400 flex items-center"
      } else {
        strengthText.className = "text-xs text-purple-300"
      }
    } else {
      passwordStrength.classList.add("hidden")
    }
  })

  // Form validation
  const loginEmail = document.getElementById("login-email")
  const loginPassword = document.getElementById("login-password")
  const emailError = document.getElementById("email-error")
  const passwordError = document.getElementById("password-error")

  loginEmail.addEventListener("blur", () => {
    validateEmail(loginEmail, emailError)
  })

  loginPassword.addEventListener("blur", () => {
    validatePassword(loginPassword, passwordError)
  })

  const signupName = document.getElementById("signup-name")
  const signupEmail = document.getElementById("signup-email")
  const signupCountry = document.getElementById("signup-country")
  const confirmPassword = document.getElementById("signup-confirm-password")
  const nameError = document.getElementById("name-error")
  const signupEmailError = document.getElementById("signup-email-error")
  const countryError = document.getElementById("country-error")
  const signupPasswordError = document.getElementById("signup-password-error")
  const confirmPasswordError = document.getElementById("confirm-password-error")

  signupName.addEventListener("blur", () => {
    validateName(signupName, nameError)
  })

  signupEmail.addEventListener("blur", () => {
    validateEmail(signupEmail, signupEmailError)
  })

  signupCountry.addEventListener("blur", () => {
    validateSelect(signupCountry, countryError)
  })

  signupPassword.addEventListener("blur", () => {
    validatePassword(signupPassword, signupPasswordError)
    if (confirmPassword.value) {
      validatePasswordMatch(signupPassword, confirmPassword, confirmPasswordError)
    }
  })

  confirmPassword.addEventListener("blur", () => {
    validatePasswordMatch(signupPassword, confirmPassword, confirmPasswordError)
  })

  // Validation functions
  function validateEmail(input, errorElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!input.value) {
      errorElement.textContent = "Email is required"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else if (!emailRegex.test(input.value)) {
      errorElement.textContent = "Please enter a valid email address"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else {
      errorElement.classList.add("hidden")
      input.classList.remove("border-red-500")
      input.classList.add("border-green-500")
      return true
    }
  }

  function validatePassword(input, errorElement) {
    if (!input.value) {
      errorElement.textContent = "Password is required"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else if (input.value.length < 6) {
      errorElement.textContent = "Password must be at least 6 characters"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else {
      errorElement.classList.add("hidden")
      input.classList.remove("border-red-500")
      input.classList.add("border-green-500")
      return true
    }
  }

  function validateName(input, errorElement) {
    if (!input.value) {
      errorElement.textContent = "Name is required"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else if (input.value.trim().length < 2) {
      errorElement.textContent = "Name must be at least 2 characters"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else {
      errorElement.classList.add("hidden")
      input.classList.remove("border-red-500")
      input.classList.add("border-green-500")
      return true
    }
  }

  function validateSelect(input, errorElement) {
    if (!input.value) {
      errorElement.textContent = "Please make a selection"
      errorElement.classList.remove("hidden")
      input.classList.add("border-red-500")
      return false
    } else {
      errorElement.classList.add("hidden")
      input.classList.remove("border-red-500")
      input.classList.add("border-green-500")
      return true
    }
  }

  function validatePasswordMatch(password1, password2, errorElement) {
    if (password1.value !== password2.value) {
      errorElement.textContent = "Passwords do not match"
      errorElement.classList.remove("hidden")
      password2.classList.add("border-red-500")
      return false
    } else if (password2.value) {
      errorElement.classList.add("hidden")
      password2.classList.remove("border-red-500")
      password2.classList.add("border-green-500")
      return true
    }
  }

  // Form submission
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginError = document.getElementById("login-error")
  const loginErrorMessage = document.getElementById("login-error-message")
  const signupError = document.getElementById("signup-error")
  const signupErrorMessage = document.getElementById("signup-error-message")
  const loginButton = document.getElementById("login-button")
  const signupButton = document.getElementById("signup-button")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Reset error
    loginError.classList.add("hidden")

    // Validate form
    const isEmailValid = validateEmail(loginEmail, emailError)
    const isPasswordValid = validatePassword(loginPassword, passwordError)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    // Show loading state
    loginButton.disabled = true
    loginButton.innerHTML =
      '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Signing in...'

    // Simulate authentication (replace with actual authentication in a real app)
    setTimeout(() => {
      // For demo purposes, we'll just check if the email contains "admin" or "team"
      const email = loginEmail.value.toLowerCase()
      let userRole = null

      if (email.includes("admin") && mode === "admin") {
        userRole = "admin"
      } else if (email.includes("team") || mode === "team") {
        userRole = "team"
      } else if (email.includes("employee")) {
        userRole = "employee"
      } else {
        userRole = "user"
      }

      if (userRole) {
        handleSuccessfulLogin(userRole)
      } else {
        // Show error
        loginError.classList.remove("hidden")
        loginErrorMessage.textContent = "Invalid email or password. Please check your credentials."

        // Reset loading state
        loginButton.disabled = false
        loginButton.innerHTML =
          '<span>Sign In</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
      }
    }, 1500)
  })

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Reset error
    signupError.classList.add("hidden")

    // Get active signup type
    const activeTab = document.querySelector(".signup-type-tab.active")
    const signupType = activeTab.getAttribute("data-type")

    // Validate common fields
    const isNameValid = validateName(signupName, nameError)
    const isEmailValid = validateEmail(signupEmail, signupEmailError)
    const isCountryValid = validateSelect(signupCountry, countryError)
    const isPasswordValid = validatePassword(signupPassword, signupPasswordError)
    const isConfirmPasswordValid = validatePasswordMatch(signupPassword, confirmPassword, confirmPasswordError)

    if (!isNameValid || !isEmailValid || !isCountryValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    // Validate type-specific fields
    if (signupType === "admin") {
      const adminPin = document.getElementById("admin-creation-pin")
      if (!adminPin.value) {
        signupError.classList.remove("hidden")
        signupErrorMessage.textContent = "Admin PIN is required"
        return
      }
    } else if (signupType === "create-team") {
      const teamPin = document.getElementById("team-pin")
      const teamName = document.getElementById("team-name")
      const teamSize = document.getElementById("team-size")
      const teamCode = document.getElementById("create-team-code")

      if (!teamPin.value) {
        signupError.classList.remove("hidden")
        signupErrorMessage.textContent = "Team creation PIN is required"
        return
      }

      if (!teamName.value) {
        signupError.classList.remove("hidden")
        signupErrorMessage.textContent = "Team name is required"
        return
      }

      if (!teamSize.value) {
        signupError.classList.remove("hidden")
        signupErrorMessage.textContent = "Team size is required"
        return
      }

      if (!teamCode.value) {
        signupError.classList.remove("hidden")
        signupErrorMessage.textContent = "Team code is required"
        return
      }
    } else if (signupType === "join-team") {
      const joinTeamCode = document.getElementById("join-team-code")

      if (!joinTeamCode.value) {
        signupError.classList.remove("hidden")
        signupErrorMessage.textContent = "Team code is required"
        return
      }
    }

    // Show loading state
    signupButton.disabled = true
    signupButton.innerHTML =
      '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating account...'

    // Simulate account creation (replace with actual account creation in a real app)
    setTimeout(() => {
      if (signupType === "admin") {
        window.location.href = "admin/dashboard.html"
      } else if (signupType === "create-team") {
        // Redirect to team dashboard
        window.location.href = "team/dashboard.html"
      } else if (signupType === "join-team") {
        // Redirect to team chat
        window.location.href = "team/dashboard.html"
      }
    }, 2000)
  })

  // Handle successful login
  function handleSuccessfulLogin(userType) {
    // Store auth info in localStorage
    localStorage.setItem("authToken", "sample-auth-token")
    localStorage.setItem("userRole", userType)
    localStorage.setItem("userEmail", document.getElementById("login-email").value)

    // Redirect based on user type
    if (userType === "admin") {
      window.location.href = "admin/dashboard.html"
    } else if (userType === "team") {
      window.location.href = "team/dashboard.html"
    } else if (userType === "employee") {
      window.location.href = "pages/chat/index.html"
    } else {
      window.location.href = "pages/chat/index.html"
    }
  }
})
