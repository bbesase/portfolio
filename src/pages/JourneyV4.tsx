// Variant 4 — "Immersive": sticky timeline sidebar, collage fills card background dramatically
import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/journey'
import { Link } from '../router'
import LowPolyV3 from '../components/LowPolyV3'
import ThemePicker from '../components/ThemePicker'

const ACCENTS = ['volt', 'cyan', 'violet', 'volt', 'cyan'] as const
type Accent = (typeof ACCENTS)[number]

// CSS var refs, not literal hex, so these inline styles stay theme-reactive.
const HEX: Record<Accent, string> = { volt: 'var(--color-volt)', cyan: 'var(--color-cyan)', violet: 'var(--color-violet)' }
const CLS: Record<Accent, string> = { volt: 'text-volt', cyan: 'text-cyan', violet: 'text-violet' }

type Item = { tech: string; x: number; y: number; rotate: number; size: number }

const COLLAGE: Item[][] = [
  [
    { tech: 'storybook',      x: 55, y: 8,  rotate: 12,  size: 52 },
    { tech: 'react',          x: 75, y: 3,  rotate: -8,  size: 72 },
    { tech: 'typescript',     x: 62, y: 48, rotate: 5,   size: 48 },
    { tech: 'github-actions', x: 82, y: 55, rotate: -15, size: 60 },
  ],
  [
    { tech: 'azure',      x: 58, y: 10, rotate: 20,  size: 68 },
    { tech: 'react',      x: 80, y: 35, rotate: -5,  size: 52 },
    { tech: 'typescript', x: 65, y: 65, rotate: 10,  size: 56 },
  ],
  [
    { tech: 'angular',     x: 60, y: 15, rotate: -8,  size: 64 },
    { tech: 'material-ui', x: 80, y: 55, rotate: 12,  size: 58 },
  ],
  [
    { tech: 'nodejs',  x: 60, y: 18, rotate: 15,  size: 66 },
    { tech: 'angular', x: 80, y: 60, rotate: -18, size: 56 },
  ],
  [
    { tech: 'react',      x: 62, y: 10, rotate: -10, size: 62 },
    { tech: 'javascript', x: 80, y: 55, rotate: 18,  size: 58 },
  ],
]

function Icon({ tech, size = 32 }: { tech: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none' as const, 'aria-hidden': true as const }
  switch (tech) {
    case 'react': return <svg {...p}><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 16 16)"/><circle cx="16" cy="16" r="2.5" fill="currentColor"/></svg>
    case 'typescript': return <svg {...p}><rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 17h8M14 12v10" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/></svg>
    case 'storybook': return <svg {...p}><rect x="8" y="3" width="14" height="26" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M8 9h14" stroke="currentColor" strokeWidth="1.5"/><path d="M13 15c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    case 'github-actions': return <svg {...p}><circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="24" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="25" cy="24" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M16 10v7M16 17l-6.5 4M16 17l6.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    case 'azure': return <svg {...p}><path d="M4 26L14 6l6 8-6 6 10 6H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 6l10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    case 'angular': return <svg {...p}><path d="M16 3l13 4.5-2 17L16 29 5 24.5l-2-17z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 22l6-14 6 14M12 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    case 'material-ui': return <svg {...p}><path d="M4 8v10l12 7 12-7V8L16 15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M16 15V8" stroke="currentColor" strokeWidth="1.5"/><path d="M4 8l12 7 12-7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6"/></svg>
    case 'nodejs': return <svg {...p}><path d="M16 3l12 7v12L16 29 4 22V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M16 3v26M4 10l12 8 12-8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/></svg>
    case 'javascript': return <svg {...p}><rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M20 12v8c0 2-1 3.5-3 3.5s-3-1.5-3-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 12v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    default: return null
  }
}

export default function JourneyV4() {
  const allIndices = () => new Set(journey.map((_, i) => i))
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [revealed, setRevealed] = useState<Set<number>>(() => reducedMotion() ? allIndices() : new Set())
  // Which chapter is "current" (drives both the header's mini progress row
  // and the sidebar diamonds) -- only updates while at least one chapter
  // is majority-visible, and holds its last value through the brief gap
  // between one chapter dropping below 50% and the next rising past it,
  // rather than snapping to whatever was merely glimpsed.
  const [current, setCurrent] = useState<number>(() => reducedMotion() ? journey.length - 1 : 0)
  const majorityVisible = useRef<Set<number>>(new Set())
  // Chapters already in the initial viewport on load (varies by viewport
  // height -- taller screens can fit more than just chapter 0) shouldn't
  // wait on a 700ms transition to become visible: that's a needless pop-in
  // delay for real users, and it's a genuine, if brief, low-contrast state
  // mid-fade that axe reliably catches since page load and analysis both
  // happen well inside that window. Tracked separately so only these
  // chapters' entrance transition is suppressed -- chapters revealed later
  // by actually scrolling still animate normally.
  const [noAnimate, setNoAnimate] = useState<Set<number>>(() => new Set())
  // Pixel offset of each chapter's diamond within the sidebar's track (the
  // ref'd div below). Diamond 01 is anchored to chapter 1's real on-page
  // position -- so it starts level with the first card, not at the very
  // top of the sticky rail -- and the rest are spaced proportionally to
  // real chapter length, compressed to fit under it. Defaults to an even
  // spread over a rough viewport-height guess so layout is sane before the
  // first measurement lands.
  const [dotOffsets, setDotOffsets] = useState<number[]>(() => {
    const approxTrack = Math.max(200, window.innerHeight - 200)
    return journey.map((_, i) => (i / Math.max(1, journey.length - 1)) * approxTrack)
  })
  const refs = useRef<(HTMLElement | null)[]>([])
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const measure = () => {
      const trackEl = trackRef.current
      if (!trackEl || refs.current.some((r) => !r)) return
      const trackRect = trackEl.getBoundingClientRect()
      const trackTop = trackRect.top + window.scrollY
      const trackHeight = trackRect.height
      const chapterTops = refs.current.map((el) => el!.getBoundingClientRect().top + window.scrollY)
      const firstTop = chapterTops[0]
      const lastTop = chapterTops[chapterTops.length - 1]
      const span = Math.max(1, lastTop - firstTop)

      const firstOffset = Math.min(trackHeight, Math.max(0, firstTop - trackTop))
      const availableBelow = Math.max(1, trackHeight - firstOffset)

      setDotOffsets(chapterTops.map((t) => {
        const raw = firstOffset + ((t - firstTop) / span) * availableBelow
        return Math.min(trackHeight, Math.max(0, raw))
      }))
    }
    // Chapter heights don't change from the reveal transition (only
    // opacity/translateX, not layout), so one post-mount measurement plus
    // remeasuring on resize (responsive reflow can change chapter heights)
    // is enough -- no need to hook this into scroll.
    const raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // IntersectionObserver fires its first callback almost immediately for
    // elements already in the viewport when observe() is called -- reuse
    // that first batch to detect "already visible on load" instead of a
    // separate DOM-measuring effect.
    //
    // Two different bars for two different things: `revealed` (the card's
    // own fade-in) fires as soon as any sliver of it shows, same as
    // before. `current` (which drives which diamond is lit in both the
    // header and sidebar) requires the majority of the card to actually
    // be on screen -- otherwise a card whose header just peeks into view
    // at the bottom of a tall viewport lights up its diamond before
    // there's anything to read. It only advances while something clears
    // that bar, holding its last value through the brief gap where one
    // card has dropped below 50% and the next hasn't risen past it yet
    // (rather than falling back to whatever was merely glimpsed). Both
    // thresholds have to be registered on the observer for the callback
    // to fire at each crossing.
    let firstBatch = true
    const obs = new IntersectionObserver((entries) => {
      const initial = new Set<number>()
      entries.forEach((e) => {
        const idx = parseInt(e.target.getAttribute('data-idx') ?? '0', 10)
        if (e.isIntersecting) {
          if (firstBatch) initial.add(idx)
          setRevealed((p) => new Set([...p, idx]))
        }
        if (e.intersectionRatio >= 0.5) majorityVisible.current.add(idx)
        else majorityVisible.current.delete(idx)
      })
      if (majorityVisible.current.size > 0) setCurrent(Math.max(...majorityVisible.current))
      if (firstBatch && initial.size) setNoAnimate(initial)
      firstBatch = false
    }, { threshold: [0.12, 0.5] })
    refs.current.forEach((r) => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const pad = (n: number) => String(n + 1).padStart(2, '0')

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Fixed, very low-opacity faceted mesh -- fills the empty space
          beside the reading column on wide viewports, and ties this page
          visually back to the Hero's signature background. Stays put while
          content scrolls over it (fixed, not absolute), so it covers
          whatever's in view at any scroll position, not just the top. */}
      <div className="fixed inset-0 pointer-events-none">
        <LowPolyV3 className="opacity-[0.08]" />
      </div>

      {/* Fixed header with prominent progress */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-ink/90 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display font-semibold tracking-tight">
            Brent<span className="text-volt">Besase</span>
          </Link>
          <div className="flex items-center gap-5">
          <div
            aria-live="polite"
            aria-label={`Chapter ${current + 1} of ${journey.length}`}
            className="flex items-center gap-3"
          >
            {/* Mini diamond row */}
            {journey.map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  width: 8, height: 8,
                  background: i <= current ? HEX[ACCENTS[i]] : 'transparent',
                  border: `1.5px solid ${i <= current ? HEX[ACCENTS[i]] : 'var(--color-line)'}`,
                  clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                  transition: 'background-color 0.4s, border-color 0.4s',
                }}
              />
            ))}
            <span className="font-mono text-xs text-mist tracking-widest ml-2">
              {pad(current)}&nbsp;/&nbsp;{String(journey.length).padStart(2, '0')}
            </span>
          </div>
          <ThemePicker />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex lg:ml-[14rem]">
        {/* Sticky left sidebar timeline -- purely decorative, duplicates info
            already in each chapter's own heading and dates below */}
        <div
          aria-hidden="true"
          className="hidden lg:flex flex-col items-center gap-0 sticky top-0 self-start"
          style={{ width: 80, paddingTop: 72 + 24, height: '100vh', flexShrink: 0 }}
        >
          <div className="relative w-full flex-1">
            {/* Line and diamonds share this track div so a diamond's pixel
                offset lines up directly with the line's own rendered range. */}
            <div ref={trackRef} className="absolute inset-x-0 top-8 bottom-8">
              <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-line" aria-hidden="true" />
              {journey.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 flex flex-col items-center gap-1 z-10"
                  style={{ top: dotOffsets[i] ?? 0, transform: 'translate(-50%, -50%)' }}
                >
                  <div
                    style={{
                      width: 18, height: 18,
                      background: i <= current ? HEX[ACCENTS[i]] : 'var(--color-ink)',
                      border: `2px solid ${HEX[ACCENTS[i]]}`,
                      clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                      transition: 'background-color 0.6s ease',
                    }}
                    aria-hidden="true"
                  />
                  {/* Text (unlike the diamond above) is still subject to
                      WCAG contrast regardless of aria-hidden -- aria-hidden
                      only removes it from the screen-reader tree, sighted
                      users still see it, so this can't dim below ~0.9
                      opacity the way the diamond's fill safely can. The
                      diamond's solid-vs-outline fill already carries the
                      revealed/not-revealed signal, so this label doesn't
                      need its own dim state. */}
                  <span
                    className="font-mono text-[8px] tracking-wider"
                    style={{ color: HEX[ACCENTS[i]] }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Hero */}
          <section className="px-6 lg:px-12 pt-32 pb-20">
            <p className="eyebrow mb-6">My Journey</p>
            <h1 className="font-display font-semibold leading-none mb-8">
              <span className="block text-5xl sm:text-7xl text-paper">Where I've worked,</span>
              <span className="block text-5xl sm:text-7xl text-mist">and what I built there.</span>
            </h1>
            <p className="text-mist text-lg max-w-md leading-relaxed">
              Five roles, five different problems. Scroll through the story.
            </p>
            <p className="font-mono text-sm text-mist mt-6">
              <span className="text-cyan">brent@portfolio</span>
              <span className="text-mist">:~$</span> git log --oneline --all
            </p>
            <div className="flex items-center gap-3 mt-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist">Scroll</span>
              <div className="w-16 h-px bg-cyan/40" />
            </div>
          </section>

          {/* Chapters -- single column, ~18% wider than the original max-w-4xl */}
          <div className="px-6 lg:px-12 pb-24 space-y-12 max-w-[72rem]">
            {journey.map((ch, i) => {
              const accent = ACCENTS[i]
              const show = revealed.has(i)

              return (
                <section
                  key={ch.company}
                  ref={(el) => { refs.current[i] = el }}
                  data-idx={i}
                  aria-labelledby={`v4-ch-${i}`}
                  className="relative bg-panel overflow-hidden rounded-sm"
                  style={{
                    opacity: show ? 1 : 0,
                    transform: show ? 'translateX(0)' : 'translateX(-24px)',
                    transition: noAnimate.has(i) ? 'none' : 'opacity 0.7s ease, transform 0.7s ease',
                  }}
                >
                  {/* Faceted border */}
                  <div
                    aria-hidden="true"
                    style={{ height: 5, background: HEX[accent], clipPath: 'polygon(0 0, 100% 40%, 100% 100%, 0 100%)' }}
                  />
                  {/* Dramatic full-card tech collage */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    {COLLAGE[i].map((item) => (
                      <div
                        key={item.tech}
                        className="absolute"
                        style={{
                          left: `${item.x}%`, top: `${item.y}%`,
                          transform: `rotate(${item.rotate}deg)`,
                          opacity: 0.06,
                          color: HEX[accent],
                        }}
                      >
                        <Icon tech={item.tech} size={item.size} />
                      </div>
                    ))}
                  </div>
                  {/* Content */}
                  <div className="relative p-6 md:p-8 max-w-2xl">
                    <p className={`eyebrow ${CLS[accent]} mb-2 text-[10px]`}>{ch.start} – {ch.end} · {ch.location}</p>
                    <h2 id={`v4-ch-${i}`} className="font-display text-3xl font-semibold text-paper mb-1">{ch.company}</h2>
                    <p className={`font-medium mb-5 ${CLS[accent]} text-lg`}>{ch.role}</p>
                    <p className="text-mist leading-relaxed mb-7">{ch.summary}</p>
                    <ul className="space-y-3">
                      {ch.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill={HEX[accent]} aria-hidden="true" className="mt-1.5 flex-shrink-0"><path d="M4 0l4 4-4 4L0 4z"/></svg>
                          <span className="text-mist text-sm leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )
            })}
          </div>

          <div className="px-6 lg:px-12 pb-16">
            <Link to="/" className="inline-block rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors">
              Back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
