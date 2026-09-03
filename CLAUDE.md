# Project context for Claude Code

This file is read automatically by Claude Code (CLI, subagents, and the
GitHub Actions bots in `.github/workflows/`). Keep it accurate — it's the
single source of truth these agents work from.

## Stack

React 19 + Vite + TypeScript (strict mode), Tailwind CSS, ESLint (flat
config, typescript-eslint + jsx-a11y + react-hooks), Vitest + React Testing
Library, Playwright, GitHub Actions, deployed on Vercel.

All source files are `.tsx`/`.ts`. Don't introduce `.jsx`/`.js` files in
`src/`. Prefer explicit prop types over `any`; if a type is awkward, narrow
it rather than widening to `any` or adding an `eslint-disable` comment.

## Branching

Three environments: `dev` (default branch, day-to-day integration) →
`staging` (UAT) → `master` (production, protected). Feature branches come
off `dev` and target `dev`, not `master` — only promotion PRs (`dev →
staging`, `staging → master`) should target the later branches. See
README's "Branching model" section for the full flow.

## Design tokens (do not invent new colors/fonts outside this list)

- Colors are theme-driven: the 9 named tokens below (`ink`, `panel`,
  `panel2`, `line`, `mist`, `paper`, `volt`, `cyan`, `violet`) are CSS
  custom properties (`--color-*` in `src/index.css`) that `tailwind.config.js`
  points its `colors.*` entries at — so `bg-ink`/`text-volt`/etc. always
  render whichever palette is active. `src/theme.ts` switches palettes at
  runtime via a `data-theme` attribute on `<html>`, persisted to
  localStorage, surfaced through the `<ThemePicker>` component in the site
  header. Token *names* are fixed accent-role labels ("accent 1/2/3"), not
  literal hue promises — each palette assigns its own hex to `volt`/`cyan`/
  `violet`. Components should always reference the token name (a Tailwind
  class, or `var(--color-*)` in inline styles), never a literal hex value,
  so new UI stays theme-reactive.
- **Sanctioned palettes** (add a new one here before using it anywhere —
  don't hardcode an ad hoc palette in a component):
  - `faceted-dark` (default) — ink #08070D, panel #121020, panel2 #1A1730,
    line #2A2640, mist #9691B0, paper #F3F1FA, volt #FF5D5D, cyan #3FE0D0,
    violet #8B6BFF.
  - `solar-flare` — ink #0F0904, panel #1C120A, panel2 #2A1B10,
    line #4A331F, mist #C2A78D, paper #FDF3E7, volt #FF7A45, cyan #FFC857,
    violet #FF6F91.
  - `deep-ocean` — ink #05080D, panel #0D1620, panel2 #142230,
    line #223A4E, mist #93ACC0, paper #EAF3F8, volt #38BDF8, cyan #5EEAD4,
    violet #A78BFA.
  - `midnight-violet` — ink #0A0714, panel #150F24, panel2 #1E1636,
    line #332954, mist #A79FC4, paper #F5F2FA, volt #B98CFF, cyan #FF6FA5,
    violet #4FD8C4.
- Type: `font-display` (Space Grotesk, headings), `font-body` (Inter, body
  copy), `font-mono` (JetBrains Mono, labels/eyebrows/code).
- Geometric motif: angled section dividers (`facet-divider` /
  `facet-divider-rev` in `src/index.css`), no rounded-corner-heavy or
  purely rectangular layouts — this site's identity is faceted, not soft.

## Commands agents should use to verify their own work

```bash
npm run lint              # ESLint, must pass
npm run typecheck         # tsc -b --noEmit, must pass
npm run test -- --run     # Vitest + RTL, must pass
npm run build              # tsc -b && vite build, must succeed
npm run test:e2e           # Playwright, run when UI structure changes
```

## Code review rubric (used by the PR review bot)

Check, in order: correctness, type safety (no unnecessary `any`, no
suppressed lint/type errors), accessibility (semantic HTML, focus states,
color contrast against the token palette, `prefers-reduced-motion`
respected), test coverage for new/changed components, adherence to the
design tokens above, readability, and unnecessary complexity. Flag but
don't "fix" scope-creep — only touch what the PR is about.

## UI variant judging rubric (used by the design bot)

Score each variant 1–5 on: fidelity to the written brief, correct use of
design tokens, accessibility (contrast, focus, motion), and distinctiveness
(does it look like a template default, or a considered choice for this
specific element). Pick the highest total; explain the score in the PR
comment so the reasoning is visible, not just the outcome.
