import { skillGroups } from '../data/skills'

export default function Skills() {
  return (
    <section id="skills" className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <p className="eyebrow mb-4">Skills</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-14 max-w-xl">
          The stack, and the workflow around it.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden">
          {skillGroups.map((group) => (
            <div key={group.label} className="bg-panel p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-volt mb-4">
                {group.label}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-paper text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
