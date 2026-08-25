import { useState } from 'react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-ink/70 border-b border-line">
      <nav
        aria-label="Primary"
        className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4"
      >
        <a href="#top" className="font-display font-semibold tracking-tight text-paper">
          Your<span className="text-volt">Name</span>
        </a>
        <ul className="hidden sm:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-mist hover:text-cyan transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="text-sm font-medium border border-volt text-volt rounded-full px-4 py-1.5 hover:bg-volt hover:text-ink transition-colors"
          >
            Say hello
          </a>
          <button
            type="button"
            className="sm:hidden text-paper p-2 -mr-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5l12 12M17 5L5 17"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                />
              ) : (
                <path
                  d="M4 6h14M4 11h14M4 16h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <ul
          id="mobile-nav"
          className="sm:hidden flex flex-col border-t border-line bg-ink px-6 py-4 gap-1"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-mist hover:text-cyan transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
