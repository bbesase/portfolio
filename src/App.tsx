import { useEffect } from 'react'
import { RouterProvider, useRouter } from './router'
import { projects } from './data/projects'
import Home from './pages/Home'
import Journey from './pages/Journey'
import ProjectDetail from './pages/ProjectDetail'

// index.html's <title>/<meta description> cover "/" (and are the only
// thing a non-JS crawler or link unfurler ever sees, since this is a
// client-rendered SPA with no server-side rendering). This just keeps the
// browser tab and any JS-executing crawler in sync for the other routes.
const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Brent Besase | Software Engineer, Frontend & Agentic Tooling',
    description: 'Portfolio of a software engineer building with React, Tailwind, and agentic AI workflows.',
  },
  '/journey': {
    title: 'My Journey | Brent Besase',
    description: 'Five roles, five different problems -- a scrollable look at where Brent Besase has worked and what he built there.',
  },
}

const PROJECTS_PREFIX = '/projects/'

function Routes() {
  const { path } = useRouter()
  const project = path.startsWith(PROJECTS_PREFIX)
    ? projects.find((p) => p.slug === path.slice(PROJECTS_PREFIX.length))
    : undefined
  const meta = project
    ? { title: `${project.title} | Brent Besase`, description: project.blurb }
    : (PAGE_META[path] ?? PAGE_META['/'])

  useEffect(() => {
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    // meta is a fresh object every render when on a project page (built
    // from `project`, not looked up from the stable PAGE_META constant),
    // so depend on its primitive fields rather than its reference.
  }, [meta.title, meta.description])

  if (project) return <ProjectDetail project={project} />
  if (path === '/journey') return <Journey />
  return <Home />
}

function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  )
}

export default App
