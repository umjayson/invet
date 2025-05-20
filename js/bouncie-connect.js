document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bouncie-connect-form")
  const connectButton = document.getElementById("connect-button")

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault()

      // Get form values
      const apiKey = document.getElementById("apiKey").value
      const clientId = document.getElementById("clientId").value
      const clientSecret = document.getElementById("clientSecret").value

      // Validate form
      if (!apiKey || !clientId || !clientSecret) {
        alert("Please fill in all fields")
        return
      }

      // Show loading state
      connectButton.innerHTML = `
        <div class="flex items-center justify-center">
          <div class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span>Connecting...</span>
        </div>
      `
      connectButton.disabled = true

      // Store credentials in localStorage (for demo purposes only)
      // In a real app, you would send these to your server securely
      localStorage.setItem("bouncie_api_key", apiKey)
      localStorage.setItem("bouncie_client_id", clientId)
      localStorage.setItem("bouncie_client_secret", clientSecret)

      // Simulate a delay
      setTimeout(() => {
        // Redirect to Bouncie authorization URL
        const redirectUri = encodeURIComponent("https://Invet.info/api/bouncie-callback")
        const authUrl = `https://auth.bouncie.com/dialog/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

        window.location.href = authUrl
      }, 1000)
    })
  }
})
