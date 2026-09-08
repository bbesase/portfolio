import { useState } from 'react'
import { Link } from '../router'
import ThemePicker from './ThemePicker'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

// Shared hover/focus "flair" for every nav link: the text lights up cyan
// via a clip-path reveal that grows from the right edge toward the left,
// while the underline below it grows the opposite way (left toward right)
// -- two motions crossing rather than matching. The lit-up copy is a
// duplicate, aria-hidden overlay directly on top of the real (always-
// visible, always-accessible) label; only its clip-path animates, so
// screen readers only ever see the one real label underneath.
function NavLinkContent({ label }: { label: string }) {
  return (
    <>
      {label}
      <span
        aria-hidden="true"
        className="absolute inset-0 text-cyan [clip-path:inset(0_0_0_100%)] transition-[clip-path] duration-300 ease-out group-hover:[clip-path:inset(0_0_0_0%)] group-focus-visible:[clip-path:inset(0_0_0_0%)]"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-cyan transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ clipPath: 'polygon(0 0, 100% 0, 94% 100%, 0 100%)' }}
      />
    </>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-ink/70 border-b border-line">
      <nav
        aria-label="Primary"
        className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4"
      >
        <a href="#top" className="font-display font-semibold tracking-tight text-paper">
          Brent<span className="text-volt">Besase</span>
        </a>
        <ul className="hidden sm:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative inline-block text-sm text-mist py-1"
              >
                <NavLinkContent label={l.label} />
              </a>
            </li>
          ))}
          <li>
            <Link to="/journey" className="group relative inline-block text-sm text-mist py-1">
              <NavLinkContent label="My Journey" />
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <ThemePicker />
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
                className="group relative block py-2 text-sm text-mist"
              >
                <NavLinkContent label={l.label} />
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/journey"
              onClick={() => setOpen(false)}
              className="group relative block py-2 text-sm text-mist"
            >
              <NavLinkContent label="My Journey" />
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
