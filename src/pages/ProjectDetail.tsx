import type { Project } from '../data/projects'
import { Link } from '../router'
import LowPolyV3 from '../components/LowPolyV3'
import ThemePicker from '../components/ThemePicker'
import ArchitectureDiagram from '../components/ArchitectureDiagram'

export default function ProjectDetail({ project }: { project: Project }) {
  const isGitHub = project.href.includes('github.com')

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Same low-opacity mesh treatment as the Journey page -- faint
          enough that a translucent header over it (unlike the Hero's
          full-opacity mesh, fixed earlier this project) doesn't need to
          be fully opaque to stay readable. */}
      <div className="fixed inset-0 pointer-events-none">
        <LowPolyV3 className="opacity-[0.08]" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-ink/90 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display font-semibold tracking-tight">
            Brent<span className="text-volt">Besase</span>
          </Link>
          <ThemePicker />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        <p className="eyebrow mb-4">Project</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-6">{project.title}</h1>
        <p className="text-mist text-lg leading-relaxed max-w-2xl mb-12">{project.blurb}</p>

        <h2 className="eyebrow mb-6">Tools &amp; architecture</h2>
        <div className="bg-panel border border-line rounded-sm p-4 sm:p-8 mb-12">
          <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-volt text-ink font-medium px-6 py-3 hover:bg-cyan transition-colors"
          >
            {isGitHub ? 'View on GitHub' : 'Visit site'}
          </a>
          <Link to="/" className="text-sm text-mist hover:text-cyan transition-colors">
            Back home
          </Link>
        </div>
      </main>
    </div>
  )
}
