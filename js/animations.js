/* Animation for elements that should animate when they enter the viewport */
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".animate-on-scroll")

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

  // Set current year in footer
  const yearElement = document.getElementById("current-year")
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear()
  }
})
