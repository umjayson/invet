// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear()

// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button")
const mobileMenu = document.getElementById("mobile-menu")

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    // Toggle the menu visibility
    if (mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.remove("hidden")
      mobileMenuButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `
    } else {
      mobileMenu.classList.add("hidden")
      mobileMenuButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      `
    }
  })
}

// Add this code at the end of the file
// Check Bouncie connection status
document.addEventListener("DOMContentLoaded", () => {
  const statusMessage = document.getElementById("status-message")
  if (statusMessage) {
    const isAuthorized = localStorage.getItem("bouncie_authorized") === "true"
    const authTime = localStorage.getItem("bouncie_auth_time")

    if (isAuthorized && authTime) {
      const date = new Date(authTime)
      const formattedDate = date.toLocaleString()
      statusMessage.innerHTML = `
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Connected to Bouncie successfully on ${formattedDate}</span>
        </div>
      `
      statusMessage.classList.remove("bg-gray-50", "text-gray-700")
      statusMessage.classList.add("bg-green-50", "text-green-700")
    } else {
      const apiKey = localStorage.getItem("bouncie_api_key")
      const clientId = localStorage.getItem("bouncie_client_id")
      const clientSecret = localStorage.getItem("bouncie_client_secret")

      if (apiKey && clientId && clientSecret) {
        statusMessage.innerHTML = `
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>Credentials entered but not yet connected. Click "Connect to Bouncie" to complete the connection.</span>
          </div>
        `
        statusMessage.classList.remove("bg-gray-50", "text-gray-700")
        statusMessage.classList.add("bg-yellow-50", "text-yellow-700")
      }
    }
  }
})
