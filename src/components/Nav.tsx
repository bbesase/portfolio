import { useState, type CSSProperties } from 'react'
import { Link } from '../router'
import ThemePicker from './ThemePicker'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

// Shared hover/focus "flair" for every nav link: the text's own color wipes
// from mist to cyan starting at the right edge and sweeping left, at the
// same speed/easing as the underline below it growing left-to-right --
// crossing motions rather than a flat color swap.
//
// This is a single text node, not a duplicate overlay layered on top of a
// second copy: a hard-edge two-color background-clip:text gradient twice
// the link's width, with only its background-position animating. A layered-
// duplicate version of this was tried first and rejected -- the absolutely
// positioned copy never quite lined up with the real text's rendering,
// producing a ghosted/bulging look. This approach only ever paints glyphs
// once, so that class of bug can't happen.
const textWipeStyle: CSSProperties = {
  backgroundImage: 'linear-gradient(to right, var(--color-mist) 50%, var(--color-cyan) 50%)',
  backgroundSize: '200% 100%',
}

const textWipeClass =
  'bg-clip-text text-transparent bg-[position:0%_0%] transition-[background-position] duration-300 ease-out group-hover:bg-[position:100%_0%] group-focus-visible:bg-[position:100%_0%]'

function NavLinkContent({ label }: { label: string }) {
  return (
    <>
      {/* group-hover:/group-focus-visible: only match a *descendant* of the
          .group element, never the .group element itself -- so the wipe has
          to live on this child span, not on the <a>/<Link> that carries
          `group`. (The underline span below already got this right, which
          is why it worked on the first attempt and this didn't.) */}
      <span className={textWipeClass} style={textWipeStyle}>{label}</span>
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

  // Header is fully opaque, not translucent -- the Hero's mesh sits directly
  // under this fixed header at full brightness, and a translucent backdrop
  // (even blurred) still let bright triangles show through and clash with
  // the nav text, same class of bug fixed in Hero's quiet-zone panel.
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink border-b border-line">
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
                className="group relative inline-block text-sm py-1"
              >
                <NavLinkContent label={l.label} />
              </a>
            </li>
          ))}
          <li>
            <Link to="/journey" className="group relative inline-block text-sm py-1">
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
                className="group relative block py-2 text-sm"
              >
                <NavLinkContent label={l.label} />
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/journey"
              onClick={() => setOpen(false)}
              className="group relative block py-2 text-sm"
            >
              <NavLinkContent label="My Journey" />
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
