document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const nav = document.querySelector(".nav")

  mobileMenuToggle.addEventListener("click", () => {
    nav.classList.toggle("active")
    mobileMenuToggle.classList.toggle("active")
  })

  // Pricing toggle
  const pricingToggle = document.getElementById("pricing-toggle")
  const pricingCards = document.querySelectorAll(".pricing-card")

  pricingToggle.addEventListener("change", () => {
    pricingCards.forEach((card) => {
      card.classList.toggle("annual", pricingToggle.checked)
    })
  })

  // Testimonial slider
  const testimonials = document.querySelectorAll(".testimonial")
  const dots = document.querySelectorAll(".dot")
  let currentTestimonial = 0

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = i === index ? "block" : "none"
    })

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index)
    })

    currentTestimonial = index
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showTestimonial(i)
    })
  })

  // Auto-rotate testimonials
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length
    showTestimonial(currentTestimonial)
  }, 5000)

  // Initialize first testimonial
  showTestimonial(0)

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })

        // Close mobile menu if open
        nav.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
      }
    })
  })

  // Animate elements on scroll
  const animateElements = document.querySelectorAll(".feature-card, .step, .pricing-card")

  function checkScroll() {
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight * 0.8) {
        element.classList.add("animate")
      }
    })
  }

  window.addEventListener("scroll", checkScroll)
  checkScroll() // Check on initial load
})
