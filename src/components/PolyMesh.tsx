import { useEffect, useRef } from 'react'

type PolyMeshProps = {
  density?: number
  className?: string
}

type MeshNode = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  c: string
}

// Signature visual: a drifting triangulated node mesh. It reads as pure
// geometric texture, but the node/edge structure is a quiet nod to an
// agent pipeline (nodes = tasks, edges = handoffs) for anyone who reads it that way.
export default function PolyMesh({ density = 46, className = '' }: PolyMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let nodes: MeshNode[] = []
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    const colors = ['#FF5D5D', '#3FE0D0', '#8B6BFF']

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      canvas!.width = rect.width * devicePixelRatio
      canvas!.height = rect.height * devicePixelRatio
      ctx!.scale(devicePixelRatio, devicePixelRatio)
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    function seed() {
      const w = canvas!.getBoundingClientRect().width
      const h = canvas!.getBoundingClientRect().height
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.8,
        c: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    function step() {
      const w = canvas!.getBoundingClientRect().width
      const h = canvas!.getBoundingClientRect().height
      ctx!.clearRect(0, 0, w, h)

      for (const n of nodes) {
        if (!prefersReducedMotion) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          const maxD = 150
          if (d < maxD) {
            ctx!.strokeStyle = `rgba(150, 145, 176, ${0.16 * (1 - d / maxD)})`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      for (const n of nodes) {
        const dMouse = Math.hypot(n.x - mouse.x, n.y - mouse.y)
        const glow = dMouse < 120 ? 1 - dMouse / 120 : 0
        ctx!.beginPath()
        ctx!.fillStyle = n.c
        ctx!.globalAlpha = 0.55 + glow * 0.45
        ctx!.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.globalAlpha = 1
      }

      raf = requestAnimationFrame(step)
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    seed()
    step()
    if (prefersReducedMotion) cancelAnimationFrame(raf)

    const onResize = () => {
      resize()
      seed()
    }
    window.addEventListener('resize', onResize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-auto w-full h-full ${className}`}
    />
  )
}
