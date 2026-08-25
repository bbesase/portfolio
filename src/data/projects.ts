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
    title: 'Archmage',
    blurb:
      'A Minecraft Forge mod built around mastering six elements — Lightning, Water/Ice, Fire, Earth, Holy, and Void. XP-based mastery tiers unlock spells, elemental armor, and legendary gear; four elemental bosses guard the path to Holy and Void.',
    tags: ['Java', 'Minecraft Forge', 'Gradle'],
    href: 'https://github.com/bbesase/archmage',
  },
  {
    title: 'Project three',
    blurb: 'A third project slot — pick the one that best shows range beyond the other two.',
    tags: ['Add', 'Your', 'Stack'],
    href: '#',
  },
]
