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

## Routing & pages

Minimal hand-rolled router (`src/router.tsx`, `RouterProvider`/`useRouter`/
`Link`) — no library, tracks `window.location.pathname` via the History
API. Routes are matched in `src/App.tsx`'s `Routes()`, including the one
dynamic segment, `/projects/:slug` (matched by prefix-stripping and a
`find()` against `src/data/projects.ts`, not a route-pattern library).

Each project's tools/architecture are described as `{ nodes, edges }` on
its `Project` entry and rendered by `src/components/ArchitectureDiagram.tsx`
(`src/pages/ProjectDetail.tsx`) — a hand-rolled, hover/click-interactive
diagram (no diagramming library; the JS bundle has little headroom under
`npm run size`'s budget). Adding a new project's diagram means adding
`architecture.nodes`/`architecture.edges` to its data entry, not new
component code — reuse this pattern rather than building a bespoke page
per project.

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
  - `cherry-blossom` (light — off-white blush base, dark plum text) —
    ink #FBF1EE, panel #F5E4DE, panel2 #ECD3C7, line #DCB9AC,
    mist #71494D, paper #2A151A, volt #A32E58 (sakura pink),
    cyan #7A5714 (stamen gold), violet #356333 (leaf sage).
  - `light-ocean` (light — pale sky/foam base, deep navy text) —
    ink #EFF8FB, panel #E1F0F4, panel2 #CDE6EC, line #AFD3DE,
    mist #3A5F6C, paper #0C232E, volt #146A96 (sea blue),
    cyan #0E6D5A (deep teal), violet #5347B8 (indigo).
  - Light palettes' accents are deepened well past the flat-bg AA minimum
    for the same reason the dark palettes' accents were lightened past
    it — the low-poly mesh renders behind text at full opacity, so a
    color that merely clears contrast against a flat swatch can still
    read poorly where text crosses a mesh triangle close to it in
    luminance. Verify new/changed accents visually against the mesh, not
    just via axe (which can't see the canvas overlap), before shipping.
  - `midnight-violet` — ink #0A0714, panel #150F24, panel2 #1E1636,
    line #332954, mist #A79FC4, paper #F5F2FA, volt #A375E8, cyan #E0619A,
    violet #3FBFA8.
  - Accent lightness is deliberately kept close to `faceted-dark`'s (not
    just AA-passing on a flat background) — the Hero's low-poly mesh
    renders behind text at full opacity, and an accent color noticeably
    brighter than the default's makes that mesh compete with the text on
    top of it, not just fail a flat contrast check.
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
