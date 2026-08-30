import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'

type RouterState = {
  path: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterState | null>(null)

// Minimal client-side router: tracks window.location.pathname, updates it via
// the History API, and re-renders on both programmatic navigation and the
// browser's back/forward buttons (popstate). No routing library -- this site
// only ever needs two routes.
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to: string) => {
    if (to === window.location.pathname) return
    window.history.pushState(null, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}

type LinkProps = {
  to: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

// Same-origin route link. Falls through to a normal browser navigation for
// modified clicks (ctrl/cmd/shift/middle-click) so "open in new tab" etc.
// keep working.
export function Link({ to, children, className, onClick }: LinkProps) {
  const { navigate } = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
    onClick?.()
  }

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
