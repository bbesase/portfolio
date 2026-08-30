import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'

// V5: Card Stack Reveal
// Geometric clip-path corner-cut cards reveal with scale+fade on scroll
export default function Journey() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardRefs.current.forEach((el) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-revealed')
            obs.disconnect()
          }
        },
        { threshold: 0.12 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const accentColors = ['#FF5D5D', '#3FE0D0', '#FF5D5D', '#3FE0D0', '#8B6BFF']

  return (
    <div className="min-h-screen bg-ink text-paper">
      <style>{`
        .stack-card {
          opacity: 0;
          transform: scale(0.95) translateY(56px);
          transition: opacity 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .stack-card.card-revealed {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .stack-card { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <header className="border-b border-line px-6 py-4">
        <Link to="/" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-4">My Journey</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
          Where I&apos;ve worked, and what I built there.
        </h1>
        <p className="text-mist text-lg mb-16 max-w-xl">
          Five roles, five different problems. Scroll through the story.
        </p>

        <div className="space-y-8">
          {journey.map((chapter, i) => (
            <section
              key={chapter.company}
              aria-labelledby={`chapter-${chapter.company}`}
              className={`relative overflow-hidden ${reducedMotion ? '' : 'stack-card'}`}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              style={{
                background: '#1A1730',
                borderLeft: `4px solid ${accentColors[i]}`,
                clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)',
                padding: '2rem 2rem 2rem 1.75rem',
              }}
            >
              {/* Top accent line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${accentColors[i]}, transparent 60%)`,
                }}
              />

              {/* Ghost chapter number */}
              <div
                aria-hidden="true"
                className="absolute top-3 right-5 font-mono font-bold text-line select-none pointer-events-none"
                style={{ fontSize: '5rem', lineHeight: 1, opacity: 0.6 }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: accentColors[i] }}>
                {chapter.start} &ndash; {chapter.end} &middot; {chapter.location}
              </p>
              <h2
                id={`chapter-${chapter.company}`}
                className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-1 pr-24"
              >
                {chapter.company}
              </h2>
              <p className="text-volt font-medium mb-4">{chapter.role}</p>
              <p className="text-mist leading-relaxed mb-5 text-sm">{chapter.summary}</p>
              <ul className="space-y-2">
                {chapter.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-mist text-sm leading-relaxed pl-3 border-l"
                    style={{ borderColor: accentColors[i] + '50' }}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          ))}
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
