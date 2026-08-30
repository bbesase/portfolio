import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'

// V1: Sticky Timeline Rail
// Left sticky column with numbered nodes; right column chapters fade+slide in on scroll
export default function Journey() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionRefs.current.forEach((el, i) => {
      if (!el) return

      // Reveal observer
      const revealObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            revealObs.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      revealObs.observe(el)
      observers.push(revealObs)

      // Active index observer
      const activeObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i)
        },
        { threshold: 0.4 }
      )
      activeObs.observe(el)
      observers.push(activeObs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const nodeLabels = ['01', '02', '03', '04', '05']

  return (
    <div className="min-h-screen bg-ink text-paper">
      <style>{`
        .chapter-reveal {
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .chapter-reveal.revealed {
          opacity: 1;
          transform: translateX(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .chapter-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
      <header className="border-b border-line px-6 py-4">
        <Link to="/" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </Link>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <p className="eyebrow mb-4">My Journey</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
          Where I&apos;ve worked, and what I built there.
        </h1>
        <p className="text-mist text-lg mb-16 max-w-xl">
          Five roles, five different problems. Scroll through the story.
        </p>
        <div className="flex gap-16">
          {/* Left: sticky timeline rail */}
          <aside className="hidden md:block w-16 flex-shrink-0" aria-hidden="true">
            <div className="sticky top-8">
              <div className="relative flex flex-col items-center gap-0">
                {/* vertical line */}
                <div
                  className="absolute top-3 bottom-3 w-px"
                  style={{ background: 'linear-gradient(to bottom, #FF5D5D, #3FE0D0)' }}
                />
                {nodeLabels.map((label, i) => (
                  <div
                    key={label}
                    className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-mono text-xs font-bold border-2 mb-16 last:mb-0"
                    style={{
                      background: activeIndex === i ? '#FF5D5D' : '#1A1730',
                      borderColor: activeIndex === i ? '#FF5D5D' : '#2A2640',
                      color: activeIndex === i ? '#08070D' : '#9691B0',
                      transition: reducedMotion ? 'none' : 'background 0.3s, border-color 0.3s, color 0.3s',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right: chapters */}
          <div className="flex-1 space-y-24">
            {journey.map((chapter, i) => (
              <section
                key={chapter.company}
                aria-labelledby={`chapter-${chapter.company}`}
                className={reducedMotion ? '' : 'chapter-reveal'}
                ref={(el) => {
                  sectionRefs.current[i] = el
                }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-cyan mb-3">
                  {chapter.start} &ndash; {chapter.end} &middot; {chapter.location}
                </p>
                <h2
                  id={`chapter-${chapter.company}`}
                  className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-1"
                >
                  {chapter.company}
                </h2>
                <p className="text-volt font-medium text-lg mb-4">{chapter.role}</p>
                <p className="text-mist leading-relaxed mb-6">{chapter.summary}</p>
                <ul className="space-y-3">
                  {chapter.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-mist text-sm leading-relaxed pl-4 border-l-2 border-line"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <Link
          to="/"
          className="inline-block mt-20 rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
        >
          Back home
        </Link>
      </main>
    </div>
  )
}
