document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("auth-background")
  if (!canvas) return

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
      this.size = Math.random() * 3 + 1
      this.speedX = (Math.random() - 0.5) * 0.5
      this.speedY = (Math.random() - 0.5) * 0.5
      this.color = this.getRandomColor()
      this.alpha = Math.random() * 0.5 + 0.1
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
  const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000))

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
          ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 150)})`
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
})
