import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'

// V5: Faceted Card Stack with Center Timeline
// Geometric cards with skewed top borders (facet-style clip-path).
// Cards fade and rise from below as they enter the viewport.
// Left vertical timeline line with accent-colored diamond connectors.
// Accent color cycles: volt → cyan → violet.

const ACCENT_COLORS = [
  { text: 'text-volt', border: 'border-volt', bg: 'bg-volt' },
  { text: 'text-cyan', border: 'border-cyan', bg: 'bg-cyan' },
  { text: 'text-violet', border: 'border-violet', bg: 'bg-violet' },
  { text: 'text-volt', border: 'border-volt', bg: 'bg-volt' },
  { text: 'text-cyan', border: 'border-cyan', bg: 'bg-cyan' },
]

export default function Journey() {
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [visible, setVisible] = useState<boolean[]>(() => journey.map(() => prefersReducedMotion))
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion) return
    const observers: IntersectionObserver[] = []
    refs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(prev => { const n = [...prev]; n[i] = true; return n })
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [prefersReducedMotion])

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-20 border-b border-line px-6 py-4 bg-ink/95 backdrop-blur-sm flex items-center">
        <Link to="/" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-4">My Journey</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
          Where I&apos;ve worked, and what I built there.
        </h1>
        <p className="text-mist text-lg mb-20 max-w-xl">
          Five roles, five different problems. Scroll through the story.
        </p>

        {/* Timeline container */}
        <div className="relative">
          {/* Left timeline line */}
          <div
            className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-volt via-cyan to-violet"
            aria-hidden="true"
          />

          <div className="space-y-12 pl-12">
            {journey.map((c, i) => {
              const accent = ACCENT_COLORS[i]
              const vis = visible[i]

              return (
                <section
                  key={c.company}
                  ref={el => { refs.current[i] = el }}
                  aria-labelledby={`chapter-${c.company}`}
                  className="relative"
                >
                  {/* Diamond connector on timeline */}
                  <div
                    className={`absolute -left-[2.75rem] top-6 w-4 h-4 border-2 ${accent.border} bg-ink z-10`}
                    style={{ transform: 'rotate(45deg)' }}
                    aria-hidden="true"
                  >
                    <div
                      className={`absolute inset-0.5 transition-colors duration-700 ${vis ? accent.bg : 'bg-transparent'}`}
                      style={{ transitionDelay: vis ? '0.3s' : '0s' }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    style={{
                      opacity: vis ? 1 : 0,
                      transform: vis ? 'translateY(0)' : 'translateY(2.5rem)',
                      transition: prefersReducedMotion ? 'none' : 'opacity 0.65s ease, transform 0.65s ease',
                    }}
                  >
                    {/* Faceted top border */}
                    <div
                      className={`h-1 ${accent.bg}`}
                      style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 1.5rem) 100%, 0 100%)' }}
                      aria-hidden="true"
                    />

                    <div className="bg-panel border border-t-0 border-line p-6">
                      <div className="mb-4">
                        <p className="font-mono text-xs uppercase tracking-wide text-cyan mb-2">
                          {c.start} &ndash; {c.end} &middot; {c.location}
                        </p>
                        <h2
                          id={`chapter-${c.company}`}
                          className={`font-display text-xl sm:text-2xl font-semibold mb-0.5 ${accent.text}`}
                        >
                          {c.company}
                        </h2>
                        <p className="text-paper/80 font-medium text-sm">{c.role}</p>
                      </div>

                      <p className="text-mist leading-relaxed text-sm mb-5">{c.summary}</p>

                      <ul className="grid sm:grid-cols-2 gap-2">
                        {c.highlights.map((h, hi) => (
                          <li
                            key={h}
                            className="text-xs text-mist/80 leading-relaxed flex gap-2"
                            style={{
                              opacity: vis ? 1 : 0,
                              transform: vis ? 'translateY(0)' : 'translateY(0.75rem)',
                              transition: prefersReducedMotion
                                ? 'none'
                                : `opacity 0.4s ease ${0.25 + hi * 0.06}s, transform 0.4s ease ${0.25 + hi * 0.06}s`,
                            }}
                          >
                            <span className={`${accent.text} shrink-0 mt-px select-none`} aria-hidden="true">▸</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <Link
          to="/"
          className="inline-block mt-16 rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
        >
          Back home
        </Link>
      </main>
    </div>
  )
}
