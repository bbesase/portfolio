import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'

// V4: Split-Panel Sticky Focus
// Left sticky panel shows company/role/dates; right panel scrolls highlights
// Pure CSS position:sticky — each chapter's left panel sticks while its right panel scrolls
export default function Journey() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const leftPanelRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    leftPanelRefs.current.forEach((el) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('panel-revealed')
            obs.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const accentColors = ['#FF5D5D', '#3FE0D0', '#8B6BFF', '#FF5D5D', '#3FE0D0']

  return (
    <div className="min-h-screen bg-ink text-paper">
      <style>{`
        .panel-content {
          opacity: 0.2;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .panel-revealed .panel-content {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .panel-content { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <header className="border-b border-line px-6 py-4 sticky top-0 z-50 bg-ink">
        <Link to="/" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </Link>
      </header>

      {/* Page intro */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-b border-line">
        <p className="eyebrow mb-4">My Journey</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
          Where I&apos;ve worked, and what I built there.
        </h1>
        <p className="text-mist text-lg max-w-xl">
          Five roles, five different problems. Scroll through the story.
        </p>
      </div>

      {/* Chapters */}
      {journey.map((chapter, i) => (
        <section
          key={chapter.company}
          aria-labelledby={`chapter-${chapter.company}`}
          className="border-b border-line"
          style={{ minHeight: '100vh' }}
          ref={(el) => {
            leftPanelRefs.current[i] = el
          }}
        >
          <div className="max-w-6xl mx-auto flex">
            {/* Left sticky panel */}
            <div
              className="hidden md:flex flex-col justify-center px-8 py-12 border-r border-line flex-shrink-0"
              style={{
                width: '42%',
                position: 'sticky',
                top: '57px',
                height: 'calc(100vh - 57px)',
                background: i % 2 === 0 ? '#08070D' : '#121020',
              }}
            >
              <div className={reducedMotion ? '' : 'panel-content'}>
                {/* Geometric slash accent */}
                <div
                  aria-hidden="true"
                  className="mb-6"
                  style={{
                    width: 4,
                    height: 64,
                    background: accentColors[i],
                    transform: 'skewY(-12deg)',
                    borderRadius: 2,
                  }}
                />
                <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: accentColors[i] }}>
                  {chapter.start} &ndash; {chapter.end}
                </p>
                <h2
                  id={`chapter-${chapter.company}`}
                  className="font-display text-4xl xl:text-5xl font-bold text-paper mb-3 leading-tight"
                >
                  {chapter.company}
                </h2>
                <p className="text-lg font-medium mb-4" style={{ color: accentColors[i] }}>
                  {chapter.role}
                </p>
                <p className="font-mono text-xs text-mist uppercase tracking-widest">
                  {chapter.location}
                </p>
                <div
                  className="mt-8 text-line font-mono font-bold"
                  style={{ fontSize: '4rem', lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Right scrolling panel */}
            <div className="flex-1 px-8 py-16 md:py-24 flex flex-col justify-center">
              {/* Mobile: show company name here */}
              <div className="md:hidden mb-6">
                <p className="font-mono text-xs uppercase tracking-widest text-cyan mb-2">
                  {chapter.start} &ndash; {chapter.end} &middot; {chapter.location}
                </p>
                <h2
                  id={`chapter-${chapter.company}`}
                  className="font-display text-2xl font-bold text-paper mb-1"
                >
                  {chapter.company}
                </h2>
                <p className="text-volt font-medium">{chapter.role}</p>
              </div>
              <p className="text-mist leading-relaxed mb-8 text-lg">{chapter.summary}</p>
              <ul className="space-y-4">
                {chapter.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-mist text-sm leading-relaxed pl-4 border-l-2"
                    style={{ borderColor: accentColors[i] + '60' }}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link
          to="/"
          className="inline-block rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
