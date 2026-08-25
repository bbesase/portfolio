import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 bg-panel facet-divider">
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <p className="eyebrow mb-4">Projects</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-14 max-w-xl">
          A few things I've shipped.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="group block bg-panel2 border border-line rounded-2xl p-6 text-paper no-underline hover:border-cyan transition-colors"
            >
              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-cyan transition-colors">
                {p.title}
              </h3>
              <p className="text-mist text-sm leading-relaxed mb-5">{p.blurb}</p>
              <ul className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="font-mono text-[11px] uppercase tracking-wide text-volt border border-volt/40 rounded-full px-2 py-0.5"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
