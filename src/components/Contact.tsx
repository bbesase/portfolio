export default function Contact() {
  return (
    <section id="contact" className="py-28">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="eyebrow mb-4">Contact</p>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold mb-6">
          Let's build something.
        </h2>
        <p className="text-mist text-lg max-w-xl mx-auto mb-10">
          Open to new roles and interesting projects. The fastest way to reach me
          is email.
        </p>
        <a
          href="mailto:you@example.com"
          className="inline-block rounded-full bg-volt text-ink font-medium px-8 py-3 hover:bg-cyan transition-colors"
        >
          you@example.com
        </a>
        <div className="mt-10 flex justify-center gap-6 text-sm text-mist">
          <a href="https://github.com/yourhandle" className="hover:text-cyan transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com/in/yourhandle" className="hover:text-cyan transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
      <footer className="mt-24 text-center text-xs text-mist/70 font-mono">
        Built with React, Tailwind, and Claude Code.
      </footer>
    </section>
  )
}
