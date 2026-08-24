// V3 — Diagonal light-band sweep.
// A narrow band of brightness drifts diagonally across the mesh (top-left →
// bottom-right) on a ~14s loop, simulating light catching crystal facets.
// Accent triangles glow brightest at peak; dark triangles lift subtly.
// Reduced-motion: static.
import { useEffect, useRef } from 'react'
import { buildMesh, fillTri, Tri } from './lowPolyUtils'

const BAND_WIDTH = 0.22  // fraction of the diagonal length

export default function LowPolyV3({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let tris: Tri[] = []
    let diagLen = 1

    function build() {
      const rect = canvas!.getBoundingClientRect()
      canvas!.width = rect.width * devicePixelRatio
      canvas!.height = rect.height * devicePixelRatio
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      tris = buildMesh(rect.width, rect.height)
      diagLen = Math.hypot(rect.width, rect.height)
    }

    function render(ts: number) {
      const rect = canvas!.getBoundingClientRect()
      ctx!.clearRect(0, 0, rect.width, rect.height)

      // Band position: normalised projection along diagonal, oscillates 0→1→0
      const bandPos = (Math.sin(ts * 0.00045) + 1) / 2  // 0–1

      for (const t of tris) {
        // Project centroid onto the diagonal unit vector (1,1)/√2
        const proj = (t.cx + t.cy) / (Math.SQRT2 * diagLen)  // 0–1
        const dist = Math.abs(proj - bandPos)
        const influence = reduced ? 0 : Math.max(0, 1 - dist / BAND_WIDTH)
        // Accent triangles glow up to 2×; dark triangles lift to 1.4×
        const bri = 1 + influence * (t.isAccent ? 1.0 : 0.4)
        fillTri(ctx!, t.p0, t.p1, t.p2, t.rgb[0] * bri, t.rgb[1] * bri, t.rgb[2] * bri)
      }
      if (!reduced) raf = requestAnimationFrame(render)
    }

    build()
    raf = requestAnimationFrame(render)

    function onResize() { cancelAnimationFrame(raf); build(); raf = requestAnimationFrame(render) }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none w-full h-full ${className}`}
    />
  )
}
