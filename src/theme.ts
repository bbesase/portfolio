// Theme state: a global singleton (which palette is active), backed by a
// data-theme attribute on <html> + localStorage, not React context -- there's
// only ever one active theme for the whole document, so a hand-rolled hook
// (mirroring router.tsx's style) is simpler than a Provider tree.
import { useEffect, useState } from 'react'

export type ThemeId = 'faceted-dark' | 'cherry-blossom' | 'light-ocean' | 'midnight-violet'

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
    id: 'cherry-blossom',
    label: 'Cherry Blossom',
    colors: {
      ink: '#FBF1EE', panel: '#F5E4DE', panel2: '#ECD3C7', line: '#DCB9AC',
      mist: '#71494D', paper: '#2A151A',
      volt: '#A32E58', cyan: '#7A5714', violet: '#356333',
    },
  },
  {
    id: 'light-ocean',
    label: 'Light Ocean',
    colors: {
      ink: '#EFF8FB', panel: '#E1F0F4', panel2: '#CDE6EC', line: '#AFD3DE',
      mist: '#3A5F6C', paper: '#0C232E',
      volt: '#146A96', cyan: '#0E6D5A', violet: '#5347B8',
    },
  },
  {
    id: 'midnight-violet',
    label: 'Midnight Violet',
    colors: {
      ink: '#0A0714', panel: '#150F24', panel2: '#1E1636', line: '#332954',
      mist: '#A79FC4', paper: '#F5F2FA',
      volt: '#A375E8', cyan: '#E0619A', violet: '#3FBFA8',
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
