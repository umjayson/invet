// Background canvas animation
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("background-canvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Set canvas dimensions
  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  handleResize()
  window.addEventListener("resize", handleResize)

  // Create stars
  const stars = []
  const starCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 8000))

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
    })
  }

  // Animation loop
  let animationFrameId

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw stars
    stars.forEach((star) => {
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
      ctx.fill()

      // Move stars
      star.y += star.speed

      // Reset stars that go off screen
      if (star.y > canvas.height) {
        star.y = 0
        star.x = Math.random() * canvas.width
      }
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // Cleanup on page unload
  return () => {
    window.removeEventListener("resize", handleResize)
    cancelAnimationFrame(animationFrameId)
  }
})
