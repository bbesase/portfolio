// Shared utilities for low-poly triangle background variants.
// Colors are read from CSS custom properties so a future theme picker
// can restyle the whole mesh by swapping --color-* vars.

export const COLS = 14
export const ROWS = 9
export const JITTER = 0.38
export const SEED = 0xcafebef0
export const ACCENT_PROB = 0.10

/** Mulberry32 seeded PRNG → values in [0, 1) */
export function mkRng(seed: number): () => number {
  let s = seed >>> 0
  return (): number => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export type Tri = {
  p0: [number, number]
  p1: [number, number]
  p2: [number, number]
  cx: number
  cy: number
  rgb: [number, number, number]
  isAccent: boolean
  phase: number  // golden-ratio-spread phase for per-triangle animations
}

const PHI = (1 + Math.sqrt(5)) / 2

export function buildMesh(W: number, H: number): Tri[] {
  const darkVars = ['--color-ink', '--color-panel', '--color-panel2', '--color-line']
  const accentVars = ['--color-volt', '--color-cyan', '--color-violet']
  const dark = darkVars.map(v => hexToRgb(cssVar(v)))
  const accent = accentVars.map(v => hexToRgb(cssVar(v)))

  const rng = mkRng(SEED)
  const cw = W / COLS
  const ch = H / ROWS

  const verts: Array<[number, number]> = []
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const edge = r === 0 || r === ROWS || c === 0 || c === COLS
      const jx = edge ? 0 : (rng() - 0.5) * cw * JITTER * 2
      const jy = edge ? 0 : (rng() - 0.5) * ch * JITTER * 2
      verts.push([c * cw + jx, r * ch + jy])
    }
  }

  const tris: Tri[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tl = verts[r * (COLS + 1) + c]
      const tr = verts[r * (COLS + 1) + c + 1]
      const bl = verts[(r + 1) * (COLS + 1) + c]
      const br = verts[(r + 1) * (COLS + 1) + c + 1]

      const pairs: [[number, number], [number, number], [number, number]][] = [
        [tl, tr, bl],
        [tr, br, bl],
      ]
      for (const [p0, p1, p2] of pairs) {
        const roll = rng()
        const iroll = rng()
        const isAccent = roll < ACCENT_PROB
        const rgb = isAccent
          ? accent[Math.floor(iroll * accent.length)]
          : dark[Math.floor(iroll * dark.length)]
        const cx = (p0[0] + p1[0] + p2[0]) / 3
        const cy = (p0[1] + p1[1] + p2[1]) / 3
        tris.push({ p0, p1, p2, cx, cy, rgb, isAccent, phase: (tris.length * PHI * Math.PI * 2) % (Math.PI * 2) })
      }
    }
  }
  return tris
}

export function fillTri(
  ctx: CanvasRenderingContext2D,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  r: number,
  g: number,
  b: number,
) {
  ctx.beginPath()
  ctx.moveTo(p0[0], p0[1])
  ctx.lineTo(p1[0], p1[1])
  ctx.lineTo(p2[0], p2[1])
  // fill() closes the path implicitly — closePath() is not needed
  ctx.fillStyle = `rgb(${Math.round(Math.max(0, Math.min(255, r)))},${Math.round(Math.max(0, Math.min(255, g)))},${Math.round(Math.max(0, Math.min(255, b)))})`
  ctx.fill()
}
