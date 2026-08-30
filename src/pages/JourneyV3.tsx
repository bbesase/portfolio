import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'

// V3: Progress Track + Slide-up
// Sticky progress dots at top update as chapters enter view; chapters slide up on scroll
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

      // Reveal animation observer
      const revealObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            revealObs.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
      )
      revealObs.observe(el)
      observers.push(revealObs)

      // Active chapter observer
      const activeObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i)
        },
        { threshold: 0.35 }
      )
      activeObs.observe(el)
      observers.push(activeObs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="min-h-screen bg-ink text-paper">
      <style>{`
        .slide-reveal {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.55s ease-out, transform 0.55s ease-out;
        }
        .slide-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .slide-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <header className="border-b border-line px-6 py-4 sticky top-0 z-50 bg-ink">
        <Link to="/" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </Link>
      </header>

      {/* Sticky progress bar */}
      <div
        className="sticky z-40 border-b border-line px-6 py-3 flex items-center gap-4"
        style={{ top: '57px', background: 'rgba(8,7,13,0.92)', backdropFilter: 'blur(8px)' }}
        aria-hidden="true"
      >
        <div className="flex gap-2">
          {journey.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: activeIndex === i ? '#FF5D5D' : '#2A2640',
                transition: reducedMotion ? 'none' : 'background 0.3s',
              }}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-mist uppercase tracking-widest">
          {journey[activeIndex]?.company}
        </span>
        <span className="font-mono text-xs text-line ml-auto">
          {activeIndex + 1} / {journey.length}
        </span>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-4">My Journey</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
          Where I&apos;ve worked, and what I built there.
        </h1>
        <p className="text-mist text-lg mb-16 max-w-xl">
          Five roles, five different problems. Scroll through the story.
        </p>

        <div className="space-y-24">
          {journey.map((chapter, i) => (
            <section
              key={chapter.company}
              aria-labelledby={`chapter-${chapter.company}`}
              className={reducedMotion ? '' : 'slide-reveal'}
              ref={(el) => {
                sectionRefs.current[i] = el
              }}
            >
              {/* Gradient separator line */}
              <div
                className="mb-6"
                style={{
                  height: 2,
                  background: i % 2 === 0
                    ? 'linear-gradient(90deg, #FF5D5D, transparent)'
                    : 'linear-gradient(90deg, #3FE0D0, transparent)',
                }}
                aria-hidden="true"
              />
              <p className="font-mono text-xs uppercase tracking-widest text-cyan mb-3">
                {chapter.start} &ndash; {chapter.end} &middot; {chapter.location}
              </p>
              <h2
                id={`chapter-${chapter.company}`}
                className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-1"
              >
                {chapter.company}
              </h2>
              <p className="text-volt font-medium text-lg mb-5">{chapter.role}</p>
              <p className="text-mist leading-relaxed mb-6">{chapter.summary}</p>
              <ul className="space-y-3">
                {chapter.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-mist text-sm leading-relaxed pl-4 border-l-2"
                    style={{ borderColor: i % 2 === 0 ? '#3FE0D0' : '#FF5D5D' }}
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
          className="inline-block mt-20 rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
        >
          Back home
        </Link>
      </main>
    </div>
  )
}
