import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'

// V2: Full-Viewport Facet Chapters
// Each chapter is min-h-screen; ghost watermark + content slides from left; facet clip-path dividers
export default function Journey() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const contentRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    contentRefs.current.forEach((el) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            obs.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const accentColors = ['#FF5D5D', '#3FE0D0', '#8B6BFF', '#FF5D5D', '#3FE0D0']
  const bgClasses = ['bg-ink', 'bg-panel', 'bg-ink', 'bg-panel', 'bg-ink']

  return (
    <div className="min-h-screen text-paper">
      <style>{`
        .facet-content {
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .facet-content.revealed {
          opacity: 1;
          transform: translateX(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .facet-content { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
      <header className="border-b border-line px-6 py-4 bg-ink sticky top-0 z-50">
        <Link to="/" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </Link>
      </header>

      {/* Intro section */}
      <div className="bg-ink px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4">My Journey</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
            Where I&apos;ve worked, and what I built there.
          </h1>
          <p className="text-mist text-lg max-w-xl">
            Five roles, five different problems. Scroll through the story.
          </p>
        </div>
      </div>

      {journey.map((chapter, i) => (
        <div key={chapter.company}>
          {/* Facet divider */}
          <div
            className={bgClasses[i]}
            style={{
              clipPath: i % 2 === 0 ? 'polygon(0 0, 100% 3vw, 100% 100%, 0 100%)' : 'polygon(0 3vw, 100% 0, 100% 100%, 0 100%)',
              marginTop: i === 0 ? 0 : '-3vw',
              paddingTop: '3vw',
            }}
          >
            <section
              aria-labelledby={`chapter-${chapter.company}`}
              className="relative min-h-screen flex items-center overflow-hidden"
            >
              {/* Ghost watermark */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 font-display font-bold text-paper select-none pointer-events-none overflow-hidden leading-none"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', opacity: 0.04, lineHeight: 1 }}
              >
                {chapter.company}
              </div>

              {/* Chapter counter */}
              <div
                aria-hidden="true"
                className="absolute top-8 right-8 font-mono font-bold text-line"
                style={{ fontSize: '5rem', lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div
                className={`relative z-10 max-w-3xl mx-auto px-6 py-24 w-full ${reducedMotion ? '' : 'facet-content'}`}
                ref={(el) => {
                  contentRefs.current[i] = el as HTMLDivElement | null
                }}
              >
                <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: accentColors[i] }}>
                  {chapter.start} &ndash; {chapter.end} &middot; {chapter.location}
                </p>
                <div className="flex items-start gap-4 mb-2">
                  <div
                    className="w-1 flex-shrink-0 rounded-full mt-2"
                    style={{ height: '3rem', background: accentColors[i] }}
                    aria-hidden="true"
                  />
                  <h2
                    id={`chapter-${chapter.company}`}
                    className="font-display text-4xl sm:text-5xl font-bold text-paper"
                  >
                    {chapter.company}
                  </h2>
                </div>
                <p className="text-xl font-medium mb-6 ml-5" style={{ color: accentColors[i] }}>
                  {chapter.role}
                </p>
                <p className="text-mist leading-relaxed mb-8 max-w-2xl">{chapter.summary}</p>
                <ul className="space-y-3 max-w-2xl">
                  {chapter.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-mist text-sm leading-relaxed pl-4 border-l-2"
                      style={{ borderColor: accentColors[i] + '40' }}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      ))}

      <div className="bg-ink px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-block rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
