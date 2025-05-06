document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const mobileSidebarOpen = document.getElementById("mobile-sidebar-open")
  const mobileSidebarClose = document.getElementById("mobile-sidebar-close")
  const chatSidebar = document.querySelector(".chat-sidebar")

  if (mobileSidebarOpen) {
    mobileSidebarOpen.addEventListener("click", () => {
      chatSidebar.classList.add("open")
    })
  }

  if (mobileSidebarClose) {
    mobileSidebarClose.addEventListener("click", () => {
      chatSidebar.classList.remove("open")
    })
  }

  // Auto-resize textarea
  const chatInput = document.querySelector(".chat-input")
  if (chatInput) {
    chatInput.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = this.scrollHeight + "px"
    })
  }

  // Send message on Enter (but allow Shift+Enter for new line)
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })
  }

  // Send button click
  const sendButton = document.querySelector(".chat-send-button")
  if (sendButton) {
    sendButton.addEventListener("click", sendMessage)
  }

  function sendMessage() {
    const input = document.querySelector(".chat-input")
    const message = input.value.trim()

    if (message) {
      // In a real app, this would send the message to the server
      // For demo purposes, we'll just add it to the UI
      addMessage(message)
      input.value = ""
      input.style.height = "auto"

      // Simulate a response after a delay
      setTimeout(() => {
        simulateTyping()

        setTimeout(() => {
          const responses = [
            "Thanks for the update!",
            "I'll check on that right away.",
            "Let me get back to you on that.",
            "That sounds good, please proceed.",
            "I've noted your request.",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          addResponse(randomResponse)
        }, 2000)
      }, 1000)
    }
  }

  function addMessage(text) {
    const messagesContainer = document.querySelector(".chat-messages")
    const typingIndicator = document.querySelector(".chat-typing-indicator")

    const messageElement = document.createElement("div")
    messageElement.className = "chat-message chat-message-outgoing"

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageElement.innerHTML = `
      <div class="chat-message-avatar">
        <span>JD</span>
      </div>
      <div class="chat-message-bubble">
        <div class="chat-message-sender">You</div>
        <div class="chat-message-content">
          <p>${text}</p>
        </div>
        <div class="chat-message-time">${timeString}</div>
      </div>
    `

    if (typingIndicator) {
      messagesContainer.insertBefore(messageElement, typingIndicator)
    } else {
      messagesContainer.appendChild(messageElement)
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function simulateTyping() {
    const messagesContainer = document.querySelector(".chat-messages")
    const existingTypingIndicator = document.querySelector(".chat-typing-indicator")

    if (!existingTypingIndicator) {
      const typingElement = document.createElement("div")
      typingElement.className = "chat-typing-indicator"
      typingElement.innerHTML = `
        <div class="chat-message-avatar bg-green-600">
          <span>S</span>
        </div>
        <div class="typing-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `

      messagesContainer.appendChild(typingElement)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }

  function addResponse(text) {
    const messagesContainer = document.querySelector(".chat-messages")
    const typingIndicator = document.querySelector(".chat-typing-indicator")

    if (typingIndicator) {
      typingIndicator.remove()
    }

    const messageElement = document.createElement("div")
    messageElement.className = "chat-message chat-message-incoming"

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageElement.innerHTML = `
      <div class="chat-message-avatar bg-green-600">
        <span>S</span>
      </div>
      <div class="chat-message-bubble">
        <div class="chat-message-sender">Sarah (Sales)</div>
        <div class="chat-message-content">
          <p>${text}</p>
        </div>
        <div class="chat-message-time">${timeString}</div>
      </div>
    `

    messagesContainer.appendChild(messageElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  // Dialog functionality
  const newChatButton = document.getElementById("new-chat-button")
  const emailChatButton = document.getElementById("email-chat-button")
  const newChatDialog = document.getElementById("new-chat-dialog")
  const emailChatDialog = document.getElementById("email-chat-dialog")
  const dialogCloseButtons = document.querySelectorAll(".dialog-close, .dialog-button-secondary")

  if (newChatButton && newChatDialog) {
    newChatButton.addEventListener("click", () => {
      newChatDialog.classList.remove("hidden")
    })
  }

  if (emailChatButton && emailChatDialog) {
    emailChatButton.addEventListener("click", () => {
      emailChatDialog.classList.remove("hidden")
    })
  }

  dialogCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest(".dialog-overlay")
      if (dialog) {
        dialog.classList.add("hidden")
      }
    })
  })

  // Chat type change
  const chatTypeSelect = document.getElementById("chat-type")
  const orderIdGroup = document.getElementById("order-id-group")

  if (chatTypeSelect && orderIdGroup) {
    chatTypeSelect.addEventListener("change", () => {
      if (chatTypeSelect.value === "order") {
        orderIdGroup.style.display = "block"
      } else {
        orderIdGroup.style.display = "none"
      }
    })
  }

  // Conversation item click
  const conversationItems = document.querySelectorAll(".chat-conversation-item")

  conversationItems.forEach((item) => {
    item.addEventListener("click", () => {
      conversationItems.forEach((i) => i.classList.remove("active"))
      item.classList.add("active")

      // In a real app, this would load the selected conversation
      // For demo purposes, we'll just update the header
      const title = item.querySelector(".chat-conversation-title").textContent
      document.querySelector(".chat-header h2").textContent = title
    })
  })
})
