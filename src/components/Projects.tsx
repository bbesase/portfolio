import { projects } from '../data/projects'
import { Link } from '../router'

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 bg-panel facet-divider">
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <p className="eyebrow mb-4">Projects</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-14 max-w-xl">
          A few things I've worked on and shipped.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p.title}
              to={`/projects/${p.slug}`}
              className="group flex flex-col bg-panel2 border border-line rounded-2xl p-6 text-paper no-underline hover:border-cyan transition-colors"
            >
              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-cyan transition-colors">
                {p.title}
              </h3>
              {/* Fixed height reserves space for the longest current blurb
                  (7 lines) so every card's tags start at the same Y right
                  after it, regardless of how short a given blurb is.
                  line-clamp-7 truncates with an ellipsis if a future blurb
                  ever runs longer than that. */}
              <p className="text-mist text-sm leading-relaxed mb-5 h-40 line-clamp-7">{p.blurb}</p>
              {/* flex-1 absorbs whatever's left, so the CTA footer below
                  always lands at the same Y regardless of whether a card's
                  tags wrap to one row or two (e.g. 3 tags vs 4). */}
              <ul className="flex flex-1 flex-wrap items-start gap-2 mb-5">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="font-mono text-[11px] uppercase tracking-wide text-volt border border-volt/40 rounded-full px-2 py-0.5"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {/* Explicit, visible-at-rest CTA (not a hover-only reveal) --
                  a card that just looks like a static write-up read as a
                  dead end; this tells the visitor there's more (the tools/
                  architecture diagram) one click away. Arrow nudges right
                  on hover as a secondary, reinforcing cue. */}
              <div className="flex items-center gap-1.5 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-wide text-cyan">
                View tools &amp; architecture
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
