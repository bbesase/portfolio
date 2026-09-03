// Theme state: a global singleton (which palette is active), backed by a
// data-theme attribute on <html> + localStorage, not React context -- there's
// only ever one active theme for the whole document, so a hand-rolled hook
// (mirroring router.tsx's style) is simpler than a Provider tree.
import { useEffect, useState } from 'react'

export type ThemeId = 'faceted-dark' | 'solar-flare' | 'deep-ocean' | 'midnight-violet'

export type Theme = {
  id: ThemeId
  label: string
  colors: {
    ink: string; panel: string; panel2: string; line: string
    mist: string; paper: string; volt: string; cyan: string; violet: string
  }
}

// Hex values here are only for rendering the picker's preview swatches in
// JS -- the site's actual live styling always comes from the CSS custom
// properties in src/index.css, which these must stay in sync with.
export const THEMES: Theme[] = [
  {
    id: 'faceted-dark',
    label: 'Faceted Dark',
    colors: {
      ink: '#08070D', panel: '#121020', panel2: '#1A1730', line: '#2A2640',
      mist: '#9691B0', paper: '#F3F1FA',
      volt: '#FF5D5D', cyan: '#3FE0D0', violet: '#8B6BFF',
    },
  },
  {
    id: 'solar-flare',
    label: 'Solar Flare',
    colors: {
      ink: '#0F0904', panel: '#1C120A', panel2: '#2A1B10', line: '#4A331F',
      mist: '#C2A78D', paper: '#FDF3E7',
      volt: '#FF7A45', cyan: '#FFC857', violet: '#FF6F91',
    },
  },
  {
    id: 'deep-ocean',
    label: 'Deep Ocean',
    colors: {
      ink: '#05080D', panel: '#0D1620', panel2: '#142230', line: '#223A4E',
      mist: '#93ACC0', paper: '#EAF3F8',
      volt: '#38BDF8', cyan: '#5EEAD4', violet: '#A78BFA',
    },
  },
  {
    id: 'midnight-violet',
    label: 'Midnight Violet',
    colors: {
      ink: '#0A0714', panel: '#150F24', panel2: '#1E1636', line: '#332954',
      mist: '#A79FC4', paper: '#F5F2FA',
      volt: '#B98CFF', cyan: '#FF6FA5', violet: '#4FD8C4',
    },
  },
]

const DEFAULT_THEME: ThemeId = 'faceted-dark'
const STORAGE_KEY = 'portfolio-theme'

function isThemeId(value: string | null): value is ThemeId {
  return value != null && THEMES.some((t) => t.id === value)
}

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isThemeId(stored) ? stored : DEFAULT_THEME
}

export function applyTheme(id: ThemeId) {
  if (id === DEFAULT_THEME) {
    delete document.documentElement.dataset.theme
  } else {
    document.documentElement.dataset.theme = id
  }
  window.localStorage.setItem(STORAGE_KEY, id)
  // Lets components that read CSS vars imperatively (LowPolyV3's canvas
  // mesh) know they need to rebuild -- CSS-var-driven Tailwind classes
  // update on their own, no listener needed.
  window.dispatchEvent(new Event('themechange'))
}

export function useTheme(): [ThemeId, (id: ThemeId) => void] {
  const [current, setCurrent] = useState<ThemeId>(() => getStoredTheme())

  useEffect(() => {
    // Keeps multiple tabs (or, in principle, multiple mounted pickers) in
    // sync -- native browser feature, no extra plumbing required.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isThemeId(e.newValue)) setCurrent(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setTheme = (id: ThemeId) => {
    applyTheme(id)
    setCurrent(id)
  }

  return [current, setTheme]
}
