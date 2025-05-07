document.addEventListener("DOMContentLoaded", () => {
  // Particles background
  const canvas = document.getElementById("particles-canvas")
  if (canvas) {
    const ctx = canvas.getContext("2d")

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.color = this.getRandomColor()
        this.alpha = Math.random() * 0.5 + 0.1
        this.pulseSpeed = Math.random() * 0.01 + 0.005
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1
      }

      getRandomColor() {
        const colors = [
          "rgba(147, 51, 234, alpha)", // purple-600
          "rgba(168, 85, 247, alpha)", // purple-500
          "rgba(192, 132, 252, alpha)", // purple-400
          "rgba(79, 70, 229, alpha)", // indigo-600
          "rgba(99, 102, 241, alpha)", // indigo-500
          "rgba(129, 140, 248, alpha)", // indigo-400
        ]

        return colors[Math.floor(Math.random() * colors.length)].replace("alpha", this.alpha)
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Pulse size
        this.size += this.pulseSpeed * this.pulseDirection
        if (this.size > 3 || this.size < 0.5) {
          this.pulseDirection *= -1
        }

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles = []
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Create connections between particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.05 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      drawConnections()

      requestAnimationFrame(animate)
    }

    animate()
  }

  // Intersection Observer for scroll animations
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

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top")

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible")
      } else {
        backToTopButton.classList.remove("visible")
      }
    })

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Set current year in footer
  const yearElement = document.getElementById("current-year")
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear()
  }

  // Platform card hover effects
  const platformCards = document.querySelectorAll(".platform-card")

  platformCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calculate rotation based on mouse position
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      // Apply the 3D effect
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
      setTimeout(() => {
        card.style.transition = "all 0.4s ease"
      }, 100)
    })

    card.addEventListener("mouseenter", () => {
      card.style.transition = "all 0.1s ease"
    })
  })
})
