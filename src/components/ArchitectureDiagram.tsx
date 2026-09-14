import { useEffect, useId, useRef, useState } from 'react'
import type { ArchNode, ArchEdge, ArchCategory } from '../data/projects'

// Fixed so every project's diagram reads top-to-bottom the same way --
// only categories that actually have a node for a given project render a
// row. Layout is pure percentage math (0-100 for both the SVG viewBox and
// the HTML nodes' left/top), so it stays correct at any container size
// with no resize listener or DOM measurement needed.
const CATEGORY_ORDER: ArchCategory[] = ['language', 'build', 'frontend', 'backend', 'data', 'infra', 'testing', 'tooling']
const ROW_ACCENTS = ['var(--color-volt)', 'var(--color-cyan)', 'var(--color-violet)']

type Props = {
  nodes: ArchNode[]
  edges: ArchEdge[]
}

export default function ArchitectureDiagram({ nodes, edges }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  // Click-outside-clears-selection, same pattern as ThemePicker's dropdown
  // -- a document-level listener rather than an onClick on this component's
  // own (non-interactive) root div, which jsx-a11y correctly rejects since
  // a plain div can't be operated by keyboard.
  useEffect(() => {
    if (!selected) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setSelected(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [selected])

  const rows = CATEGORY_ORDER.filter((cat) => nodes.some((n) => n.category === cat))

  const positions: Record<string, { x: number; y: number; color: string }> = {}
  rows.forEach((cat, rowIdx) => {
    const rowNodes = nodes.filter((n) => n.category === cat)
    const y = ((rowIdx + 0.5) / rows.length) * 100
    const color = ROW_ACCENTS[rowIdx % ROW_ACCENTS.length]
    rowNodes.forEach((n, colIdx) => {
      positions[n.id] = { x: ((colIdx + 0.5) / rowNodes.length) * 100, y, color }
    })
  })

  const isConnected = (id: string) =>
    !!selected && edges.some((e) => (e.from === selected && e.to === id) || (e.to === selected && e.from === id))

  const isDimmed = (id: string) => !!selected && id !== selected && !isConnected(id)

  // Hover wins over a click-selection while it lasts (lets you preview a
  // different node's role without losing your click-highlighted one), and
  // falls back to it once the mouse/focus leaves.
  const active = nodes.find((n) => n.id === (hovered ?? selected))

  return (
    <div ref={rootRef} className="w-full select-none">
      <div className="relative w-full aspect-[3/5] sm:aspect-[16/10]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {edges.map((e, i) => {
            const from = positions[e.from]
            const to = positions[e.to]
            if (!from || !to) return null
            const activeEdge = selected && (e.from === selected || e.to === selected)
            const dimmed = selected && !activeEdge
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={activeEdge ? from.color : 'var(--color-line)'}
                strokeWidth={activeEdge ? 0.6 : 0.35}
                opacity={dimmed ? 0.25 : 1}
                className="transition-all duration-300"
              />
            )
          })}
        </svg>

        {nodes.map((n) => {
          const pos = positions[n.id]
          if (!pos) return null
          const dimmed = isDimmed(n.id)
          const highlighted = selected === n.id || isConnected(n.id)
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelected((prev) => (prev === n.id ? null : n.id))}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered((prev) => (prev === n.id ? null : prev))}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered((prev) => (prev === n.id ? null : prev))}
              aria-describedby={panelId}
              aria-pressed={selected === n.id}
              className="absolute flex max-w-[7.5rem] sm:max-w-[10.5rem] flex-col items-center gap-2 rounded-sm border bg-panel px-3 py-2.5 text-center font-mono text-xs sm:text-sm leading-snug text-paper transition-all duration-300"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                borderColor: highlighted ? pos.color : 'var(--color-line)',
                opacity: dimmed ? 0.4 : 1,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  background: pos.color,
                  clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                }}
              />
              {n.label}
            </button>
          )
        })}
      </div>

      {/* Fixed panel below the grid, not a floating per-node tooltip --
          a tooltip positioned relative to its own node had no awareness of
          neighboring nodes and could render right on top of one in a
          tightly-packed row (confirmed via screenshot on a 5-row diagram).
          A single shared, fixed-position panel can't collide with
          anything, and every node points at it via aria-describedby, so a
          screen reader announces the right text no matter which node has
          focus -- the panel's content updates in the same render as the
          focus-triggered state change. */}
      <div
        id={panelId}
        className="mt-4 flex min-h-[4.5rem] items-center rounded-sm border border-line bg-panel2 px-4 py-3 text-sm leading-relaxed text-mist"
      >
        {active ? (
          <span>
            <span className="text-paper font-medium">{active.label}: </span>
            {active.description}
          </span>
        ) : (
          <span>Hover or select a node to see its role in this project.</span>
        )}
      </div>
    </div>
  )
}
