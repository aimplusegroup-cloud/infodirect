"use client"
import { useEffect, useRef } from "react"

export default function ScenesNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const nodes = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }))

    const mouse = { x: width / 2, y: height / 2 }

    function draw() {
      const isDark = document.documentElement.classList.contains("dark")

      // پس‌زمینه
      if (isDark) {
        // گرادینت عمودی از آبی تیره به خاکستری تیره
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, "#0f172a") // slate-900
        gradient.addColorStop(1, "#1e293b") // slate-800
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.25)"
      }
      ctx.fillRect(0, 0, width, height)

      // رنگ نقاط
      ctx.fillStyle = isDark ? "#67e8f9" : "#000000" // cyan-300 vs black
      nodes.forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // خطوط
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.strokeStyle = isDark
              ? `rgba(103,232,249,${0.35 - dist / 300})` // cyan-300 شفاف
              : `rgba(0,0,0,${1 - dist / 120})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // حرکت نقاط
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy

        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          n.vx -= (dx / dist) * 0.02
          n.vy -= (dy / dist) * 0.02
        }

        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      })

      requestAnimationFrame(draw)
    }

    draw()

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener("resize", resize)

    function mouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block transition-colors duration-500"
    />
  )
}
