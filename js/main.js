// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear()

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle")
const floatingThemeToggle = document.getElementById("floating-theme-toggle")
const sunIcon = document.getElementById("sun-icon")
const moonIcon = document.getElementById("moon-icon")
const floatingSunIcon = document.getElementById("floating-sun-icon")
const floatingMoonIcon = document.getElementById("floating-moon-icon")
const htmlElement = document.documentElement

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem("theme")
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")

// Set initial theme
setTheme(initialTheme)

// Theme toggle event listeners
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme)
}

if (floatingThemeToggle) {
  floatingThemeToggle.addEventListener("click", toggleTheme)
}

function toggleTheme() {
  const currentTheme = htmlElement.classList.contains("dark") ? "dark" : "light"
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  setTheme(newTheme)
  localStorage.setItem("theme", newTheme)
}

function setTheme(theme) {
  if (theme === "dark") {
    htmlElement.classList.add("dark")
    if (sunIcon) sunIcon.classList.remove("hidden")
    if (moonIcon) moonIcon.classList.add("hidden")
    if (floatingSunIcon) floatingSunIcon.classList.remove("hidden")
    if (floatingMoonIcon) floatingMoonIcon.classList.add("hidden")
  } else {
    htmlElement.classList.remove("dark")
    if (sunIcon) sunIcon.classList.add("hidden")
    if (moonIcon) moonIcon.classList.remove("hidden")
    if (floatingSunIcon) floatingSunIcon.classList.add("hidden")
    if (floatingMoonIcon) floatingMoonIcon.classList.remove("hidden")
  }
}

// Firebase config warning
const firebaseWarning = document.getElementById("firebase-warning")
const closeFirebaseWarning = document.getElementById("close-firebase-warning")

if (closeFirebaseWarning) {
  closeFirebaseWarning.addEventListener("click", () => {
    firebaseWarning.classList.add("hidden")
    localStorage.setItem("firebase-warning-dismissed", "true")
  })
}

// Check if Firebase warning was previously dismissed
if (firebaseWarning && !localStorage.getItem("firebase-warning-dismissed")) {
  firebaseWarning.classList.remove("hidden")
}

// Intersection Observer for scroll animations
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".animate-on-scroll, .feature-card, .testimonial-card")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  animatedElements.forEach((element, index) => {
    element.style.setProperty("--index", index)
    observer.observe(element)
  })
})
