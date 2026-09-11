import { useEffect } from 'react'
import { RouterProvider, useRouter } from './router'
import Home from './pages/Home'
import Journey from './pages/Journey'

// index.html's <title>/<meta description> cover "/" (and are the only
// thing a non-JS crawler or link unfurler ever sees, since this is a
// client-rendered SPA with no server-side rendering). This just keeps the
// browser tab and any JS-executing crawler in sync for the other route.
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

function Routes() {
  const { path } = useRouter()
  const meta = PAGE_META[path] ?? PAGE_META['/']

  useEffect(() => {
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [meta])

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
