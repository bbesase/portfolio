import { useEffect, useId, useRef, useState } from 'react'
import { THEMES, useTheme } from '../theme'

export default function ThemePicker() {
  const [open, setOpen] = useState(false)
  const [current, setTheme] = useTheme()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const currentLabel = THEMES.find((t) => t.id === current)?.label ?? 'theme'

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Choose color theme, currently ${currentLabel}`}
        onClick={() => setOpen((v) => !v)}
        className="p-2 -m-2 text-mist hover:text-paper transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="7" cy="7.25" r="1.35" fill="currentColor" />
          <circle cx="12.75" cy="6.75" r="1.35" fill="currentColor" />
          <circle cx="13.5" cy="12.25" r="1.35" fill="currentColor" />
          <circle cx="7.25" cy="13" r="1.35" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div
          id={menuId}
          className="absolute right-0 top-full mt-2 w-52 bg-panel border border-line rounded-sm shadow-lg py-1 z-50"
        >
          {THEMES.map((t) => {
            const selected = t.id === current
            return (
              <button
                key={t.id}
                type="button"
                aria-current={selected}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                  buttonRef.current?.focus()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-paper hover:bg-panel2 transition-colors"
              >
                <span className="flex gap-0.5 shrink-0" aria-hidden="true">
                  {[t.colors.volt, t.colors.cyan, t.colors.violet].map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 8, height: 8, background: c,
                        clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                      }}
                    />
                  ))}
                </span>
                <span className="flex-1">{t.label}</span>
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
                    <path
                      d="M2.5 7.5l3 3 6-6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
