import { useEffect, useRef, useState } from 'react'
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
  const rootRef = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={rootRef} className="relative w-full aspect-[4/5] sm:aspect-[16/9] select-none">
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
          const active = selected && (e.from === selected || e.to === selected)
          const dimmed = selected && !active
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={active ? from.color : 'var(--color-line)'}
              strokeWidth={active ? 0.6 : 0.35}
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
          <div
            key={n.id}
            className="group absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <button
              type="button"
              onClick={() => setSelected((prev) => (prev === n.id ? null : n.id))}
              aria-describedby={`arch-desc-${n.id}`}
              aria-pressed={selected === n.id}
              className="flex max-w-[6.5rem] sm:max-w-[9rem] flex-col items-center gap-1.5 rounded-sm border bg-panel px-2.5 py-2 text-center font-mono text-[11px] sm:text-xs leading-snug text-paper transition-all duration-300"
              style={{
                borderColor: highlighted ? pos.color : 'var(--color-line)',
                opacity: dimmed ? 0.4 : 1,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  background: pos.color,
                  clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                }}
              />
              {n.label}
            </button>
            {/* Description is always in the DOM (readable via
                aria-describedby regardless of visual state) and only
                visually revealed on hover/focus. group-focus-within (not
                group-focus-visible on the button itself) is required here
                -- group and group-*: variants only match a *descendant* of
                the .group element, not the group element itself, which is
                exactly the bug that broke the nav hover effect earlier in
                this project. */}
            <div
              id={`arch-desc-${n.id}`}
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-44 -translate-x-1/2 rounded-sm border border-line bg-panel2 p-2 text-xs leading-relaxed text-mist opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {n.description}
            </div>
          </div>
        )
      })}
    </div>
  )
}
