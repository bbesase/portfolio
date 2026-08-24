import PolyMesh from './PolyMesh'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <PolyMesh />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/40 to-ink pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24">
        <p className="eyebrow mb-5">Software Engineer — Frontend &amp; Agentic Tooling</p>
        <h1 className="font-display font-semibold text-5xl sm:text-7xl leading-[1.05] max-w-3xl">
          I build interfaces,
          <br />
          <span className="text-volt">then teach agents</span>
          <br />
          to help build the next one.
        </h1>
        <p className="mt-6 max-w-xl text-mist text-lg">
          React and Tailwind for the product. Claude Code, custom skills, and subagents
          for the workflow behind it. Tested with RTL and Playwright, shipped through
          GitHub Actions to Vercel.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full bg-volt text-ink font-medium px-6 py-3 hover:bg-cyan transition-colors"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-line text-paper font-medium px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
