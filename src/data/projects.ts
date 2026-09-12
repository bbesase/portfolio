// Category order is fixed so every project's diagram reads top-to-bottom
// the same way; only categories that actually have a node for a given
// project render a row (see ArchitectureDiagram.tsx).
export type ArchCategory = 'language' | 'build' | 'frontend' | 'backend' | 'data' | 'infra' | 'testing' | 'tooling'

export type ArchNode = {
  id: string
  label: string
  category: ArchCategory
  description: string
}

export type ArchEdge = {
  from: string
  to: string
}

export type Project = {
  title: string
  slug: string
  blurb: string
  tags: string[]
  href: string
  architecture: {
    nodes: ArchNode[]
    edges: ArchEdge[]
  }
}

export const projects: Project[] = [
  {
    title: 'This site',
    slug: 'this-site',
    blurb:
      'A dark, geometric portfolio scaffolded end-to-end with Claude Code: component design, Tailwind tokens, React Testing Library/Playwright test suites, and a GitHub Actions pipeline, all agent-assisted.',
    tags: ['React', 'Tailwind', 'Claude Code', 'Playwright'],
    href: 'https://github.com/bbesase/portfolio',
    architecture: {
      nodes: [
        { id: 'react', label: 'React', category: 'frontend', description: 'The UI framework the whole site is built with.' },
        { id: 'tailwind', label: 'Tailwind', category: 'frontend', description: "Utility-first styling driven by the site's design tokens, themeable across 4 color palettes." },
        { id: 'rtl', label: 'RTL', category: 'testing', description: 'React Testing Library -- unit tests for component behavior.' },
        { id: 'playwright', label: 'Playwright', category: 'testing', description: 'End-to-end tests across every route, theme, and viewport.' },
        { id: 'github-actions', label: 'GitHub Actions', category: 'infra', description: 'CI pipeline: lint, typecheck, unit + e2e tests, and Lighthouse on every PR.' },
        { id: 'vercel', label: 'Vercel', category: 'infra', description: 'Hosting and automatic deploys through a dev -> staging -> master pipeline.' },
        { id: 'claude-code', label: 'Claude Code', category: 'tooling', description: 'Agent-assisted the design, implementation, and testing of this entire site.' },
      ],
      edges: [
        { from: 'react', to: 'tailwind' },
        { from: 'react', to: 'rtl' },
        { from: 'react', to: 'playwright' },
        { from: 'rtl', to: 'github-actions' },
        { from: 'playwright', to: 'github-actions' },
        { from: 'github-actions', to: 'vercel' },
        { from: 'claude-code', to: 'react' },
        { from: 'claude-code', to: 'rtl' },
        { from: 'claude-code', to: 'github-actions' },
      ],
    },
  },
  {
    title: 'Archmage',
    slug: 'archmage',
    blurb:
      'A Minecraft Forge mod built around mastering six elements: Lightning, Water/Ice, Fire, Earth, Holy, and Void. XP-based mastery tiers unlock spells, elemental armor, and legendary gear; four elemental bosses guard the path to Holy and Void.',
    tags: ['Java', 'Minecraft Forge', 'Gradle'],
    href: 'https://github.com/bbesase/archmage',
    architecture: {
      nodes: [
        { id: 'java', label: 'Java', category: 'language', description: "The language Archmage's mod logic, spells, and mastery systems are written in." },
        { id: 'gradle', label: 'Gradle', category: 'build', description: 'Build system (via ForgeGradle) that compiles and packages the mod into a loadable jar.' },
        { id: 'minecraft-forge', label: 'Minecraft Forge', category: 'backend', description: 'Modding API the mod is built against -- hooks into items, entities, and world events.' },
        { id: 'minecraft', label: 'Minecraft', category: 'backend', description: 'The game itself. Forge loads the mod into a running Minecraft instance.' },
      ],
      edges: [
        { from: 'java', to: 'gradle' },
        { from: 'gradle', to: 'minecraft-forge' },
        { from: 'minecraft-forge', to: 'minecraft' },
      ],
    },
  },
  {
    title: 'MigrateIQ',
    slug: 'migrateiq',
    blurb:
      'A multi-tenant SaaS platform for migrating data between platforms, with idempotent item tracking through a validated state machine. Turborepo monorepo: Next.js dashboard, API, and background workers processing each migration through Prisma/Postgres.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'Turborepo'],
    href: 'https://migrateiq.vercel.app',
    architecture: {
      nodes: [
        { id: 'typescript', label: 'TypeScript', category: 'language', description: 'Shared language across the dashboard, API, and background workers.' },
        { id: 'turborepo', label: 'Turborepo', category: 'build', description: 'Monorepo build system orchestrating the dashboard, API, and worker packages.' },
        { id: 'nextjs-dashboard', label: 'Next.js', category: 'frontend', description: 'Next.js dashboard -- the tenant-facing UI for configuring and monitoring migrations.' },
        { id: 'api', label: 'API', category: 'backend', description: 'Handles migration requests and coordinates state transitions for each item.' },
        { id: 'background-workers', label: 'Background Workers', category: 'backend', description: 'Processes each migration item through a validated state machine, idempotently.' },
        { id: 'prisma', label: 'Prisma', category: 'data', description: 'Type-safe ORM layer shared by the API and workers.' },
        { id: 'postgres', label: 'Postgres', category: 'data', description: 'Stores tenant data and per-item migration state.' },
      ],
      edges: [
        { from: 'typescript', to: 'nextjs-dashboard' },
        { from: 'typescript', to: 'api' },
        { from: 'turborepo', to: 'nextjs-dashboard' },
        { from: 'turborepo', to: 'api' },
        { from: 'turborepo', to: 'background-workers' },
        { from: 'nextjs-dashboard', to: 'api' },
        { from: 'api', to: 'prisma' },
        { from: 'background-workers', to: 'prisma' },
        { from: 'prisma', to: 'postgres' },
      ],
    },
  },
]
