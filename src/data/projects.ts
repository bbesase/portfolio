export type Project = {
  title: string
  blurb: string
  tags: string[]
  href: string
}

export const projects: Project[] = [
  {
    title: 'This site',
    blurb:
      'A dark, geometric portfolio scaffolded end-to-end with Claude Code: component design, Tailwind tokens, RTL/Playwright test suites, and a GitHub Actions pipeline, all agent-assisted.',
    tags: ['React', 'Tailwind', 'Claude Code', 'Playwright'],
    href: '#',
  },
  {
    title: 'Project two',
    blurb: 'Swap in a real project: what it does, the problem it solved, and your role building it.',
    tags: ['Add', 'Your', 'Stack'],
    href: '#',
  },
  {
    title: 'Project three',
    blurb: 'A third project slot — pick the one that best shows range beyond the other two.',
    tags: ['Add', 'Your', 'Stack'],
    href: '#',
  },
]
