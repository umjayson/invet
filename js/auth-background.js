document.addEventListener("DOMContentLoaded", () => {
  const shapes = document.querySelector(".shapes")

  // Create animated background shapes with purple colors
  const colors = [
    "rgba(106, 13, 173, 0.2)", // Primary purple
    "rgba(156, 39, 176, 0.2)", // Secondary purple
    "rgba(123, 31, 162, 0.2)", // Deep purple
    "rgba(186, 104, 200, 0.2)", // Light purple
  ]

  const shapeTypes = ["circle", "square", "triangle"]

  // Create shapes
  for (let i = 0; i < 15; i++) {
    createRandomShape()
  }

  function createRandomShape() {
    const shape = document.createElement("div")
    const size = Math.random() * 100 + 50
    const color = colors[Math.floor(Math.random() * colors.length)]
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]

    shape.style.position = "absolute"
    shape.style.width = `${size}px`
    shape.style.height = `${size}px`
    shape.style.backgroundColor = shapeType === "circle" || shapeType === "square" ? color : "transparent"
    shape.style.left = `${Math.random() * 100}%`
    shape.style.top = `${Math.random() * 100}%`
    shape.style.opacity = "0.7"
    shape.style.borderRadius = shapeType === "circle" ? "50%" : "0"
    shape.style.zIndex = "-1"

    if (shapeType === "triangle") {
      shape.style.width = "0"
      shape.style.height = "0"
      shape.style.borderLeft = `${size / 2}px solid transparent`
      shape.style.borderRight = `${size / 2}px solid transparent`
      shape.style.borderBottom = `${size}px solid ${color}`
    }

    // Animation
    const duration = Math.random() * 20 + 10
    const xMovement = Math.random() * 40 - 20
    const yMovement = Math.random() * 40 - 20
    const rotation = Math.random() * 360

    shape.style.animation = `float ${duration}s infinite ease-in-out`
    shape.style.transform = `translate(0, 0) rotate(0deg)`

    // Create keyframes for this specific shape
    const keyframes = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                50% {
                    transform: translate(${xMovement}px, ${yMovement}px) rotate(${rotation}deg);
                }
                100% {
                    transform: translate(0, 0) rotate(0deg);
                }
            }
        `

    // Add keyframes to document
    const styleSheet = document.createElement("style")
    styleSheet.textContent = keyframes
    document.head.appendChild(styleSheet)

    shapes.appendChild(shape)
  }

  // Add parallax effect
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight

    const shapeElements = shapes.querySelectorAll("div")
    shapeElements.forEach((shape, index) => {
      const depth = ((index % 5) + 1) / 10
      const moveX = x * 50 * depth
      const moveY = y * 50 * depth

      shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${shape.style.transform.match(/rotate$$([^)]+)$$/)?.[1] || "0deg"})`
    })
  })
})
