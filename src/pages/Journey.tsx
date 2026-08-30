import { journey } from '../data/journey'
import { Link } from '../router'

// Minimal, functional scaffold. The actual scrollytelling visual/interaction
// treatment (scroll-reveal, sticky panels, etc.) is intentionally left plain
// here -- it's built out separately via the /generate-ui agent workflow.
export default function Journey() {
  return (
    <div className="min-h-screen bg-ink text-paper">
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
        <div className="space-y-16">
          {journey.map((chapter) => (
            <section key={chapter.company} aria-labelledby={`chapter-${chapter.company}`}>
              <p className="font-mono text-xs uppercase tracking-wide text-cyan mb-2">
                {chapter.start} &ndash; {chapter.end} &middot; {chapter.location}
              </p>
              <h2
                id={`chapter-${chapter.company}`}
                className="font-display text-2xl font-semibold mb-1"
              >
                {chapter.company}
              </h2>
              <p className="text-volt font-medium mb-4">{chapter.role}</p>
              <p className="text-mist leading-relaxed mb-4">{chapter.summary}</p>
              <ul className="space-y-2">
                {chapter.highlights.map((h) => (
                  <li key={h} className="text-mist text-sm leading-relaxed pl-4 border-l border-line">
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
