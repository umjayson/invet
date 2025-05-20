document.addEventListener("DOMContentLoaded", () => {
  const loadingState = document.getElementById("loading-state")
  const successState = document.getElementById("success-state")
  const errorState = document.getElementById("error-state")
  const successMessage = document.getElementById("success-message")
  const errorMessage = document.getElementById("error-message")

  // Parse URL query parameters
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get("code")
  const error = urlParams.get("error")

  if (error) {
    // Show error state
    loadingState.classList.add("hidden")
    errorState.classList.remove("hidden")
    errorMessage.textContent = `Authorization failed: ${error}`
  } else if (!code) {
    // No code received
    loadingState.classList.add("hidden")
    errorState.classList.remove("hidden")
    errorMessage.textContent = "No authorization code received"
  } else {
    // Process the authorization code
    handleAuthorizationCode(code)
  }

  function handleAuthorizationCode(code) {
    // In a real implementation, you would exchange the code for an access token
    // by making a request to your backend API

    // For demo purposes, we'll simulate a successful response after a delay
    setTimeout(() => {
      // Get credentials from localStorage (for demo purposes only)
      const apiKey = localStorage.getItem("bouncie_api_key")
      const clientId = localStorage.getItem("bouncie_client_id")
      const clientSecret = localStorage.getItem("bouncie_client_secret")

      if (!apiKey || !clientId || !clientSecret) {
        // Missing credentials
        loadingState.classList.add("hidden")
        errorState.classList.remove("hidden")
        errorMessage.textContent = "Missing Bouncie credentials"
        return
      }

      // Show success state
      loadingState.classList.add("hidden")
      successState.classList.remove("hidden")
      successMessage.textContent = "Authorization successful! You can now close this window and return to the app."

      // In a real implementation, you would store the tokens securely
      // and associate them with the user's account

      // For demo purposes, store a flag indicating successful authorization
      localStorage.setItem("bouncie_authorized", "true")
      localStorage.setItem("bouncie_auth_time", new Date().toISOString())
    }, 2000)
  }
})
