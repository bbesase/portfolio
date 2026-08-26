export default function About() {
  return (
    <section id="about" className="relative py-28 bg-panel facet-divider-rev">
      <div className="max-w-6xl mx-auto px-6 pt-10 grid sm:grid-cols-[1fr_1.3fr] gap-12">
        <div>
          <p className="eyebrow mb-4">About</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
            Faceted by design,
            <br />
            not by accident.
          </h2>
        </div>
        <div className="text-mist text-lg leading-relaxed space-y-4">
          <p>
            I'm a software engineer who likes clean interfaces and messy, interesting
            problems. Most of what I build lately sits at the intersection of
            frontend engineering and agentic AI tooling, using Claude Code, custom
            skills, and subagents as real collaborators in the build process, not just
            autocomplete.
          </p>
          <p>
            That shows up in how I work: breaking a feature into steps an agent can
            reason about, writing tests that keep both me and the agent honest, and
            treating CI as the source of truth rather than "it worked on my machine."
          </p>
          <p>
            Replace this paragraph with your own story: where you've worked, what
            you care about, and what kind of problems you want to work on next.
          </p>
        </div>
      </div>
    </section>
  )
}
