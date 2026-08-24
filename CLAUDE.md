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

## Design tokens (do not invent new colors/fonts outside this list)

- Colors: `ink` #08070D (bg), `panel` #121020, `panel2` #1A1730,
  `line` #2A2640, `mist` #9691B0 (secondary text), `paper` #F3F1FA
  (primary text), `volt` #FF5D5D (primary accent), `cyan` #3FE0D0
  (secondary accent), `violet` #8B6BFF (tertiary accent, used sparingly).
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
