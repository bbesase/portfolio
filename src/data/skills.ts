export type SkillGroup = {
  label: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    items: ['React', 'Tailwind CSS', 'JavaScript / TypeScript', 'Vite'],
  },
  {
    label: 'Quality',
    items: ['React Testing Library', 'Vitest', 'Playwright', 'GitHub Actions'],
  },
  {
    label: 'AI-assisted engineering',
    items: ['Claude Code', 'Custom skills & subagents', 'Agentic CI workflows', 'Prompt-driven refactors'],
  },
  {
    label: 'Deployment',
    items: ['Vercel', 'Git / GitHub', 'CI/CD pipelines'],
  },
]
