import LowPolyV3 from './LowPolyV3'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <LowPolyV3 />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/40 to-ink pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24">
        {/* Quiet zone: important text should never sit directly on top of the
            mesh's bright shapes -- the mathematical contrast can be fine in
            isolation, but the background changing color underneath a single
            line of text is inherently harder to read than the number
            suggests. A raised bg-panel card (same rounded-sm treatment as
            the site's other cards, not the heavy rounding CLAUDE.md rules
            out) gives the text a calm, consistent backdrop.
            Fully opaque, not translucent -- an earlier /85 version still
            let bright accent triangles bleed through wherever one happened
            to sit behind it, defeating the point. A border-line edge makes
            the card read as deliberate even where the panel token (close in
            tone to the mesh's own dark triangles) would otherwise blend
            into the background with no visible boundary. */}
        <div className="max-w-3xl bg-panel border border-line rounded-sm p-6 sm:p-10">
          <p className="eyebrow mb-5">Software Engineer, Frontend &amp; Agentic Tooling</p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-7xl leading-[1.15] sm:leading-[1.05]">
            I build interfaces
            <br />
            <span className="text-volt">people actually use,</span>
            <br />
            backed by systems that actually work.
          </h1>
          <p className="mt-6 max-w-xl text-mist text-lg">
            React and Tailwind for the product. Claude Code, custom skills, and subagents
            for the workflow behind it. Tested with React Testing Library and Playwright,
            shipped through GitHub Actions.
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
      </div>
    </section>
  )
}
