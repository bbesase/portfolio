const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
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
        <a
          href="#contact"
          className="text-sm font-medium border border-volt text-volt rounded-full px-4 py-1.5 hover:bg-volt hover:text-ink transition-colors"
        >
          Say hello
        </a>
      </nav>
    </header>
  )
}
