# Portfolio

A personal portfolio site — dark, geometric, built with React, Tailwind, and
Claude Code (skills + subagents used throughout development), tested with
Vitest/React Testing Library and Playwright, and shipped through GitHub
Actions to Vercel.

## Stack

- **React 19 + Vite + TypeScript** — app shell, strict mode
- **Tailwind CSS** — styling, custom dark/geometric token set in `tailwind.config.js`
- **ESLint** (flat config) — `typescript-eslint`, `eslint-plugin-jsx-a11y`,
  `eslint-plugin-react-hooks`
- **Vitest + React Testing Library** — component/unit tests (`src/test`)
- **Playwright** — end-to-end tests (`tests/e2e`)
- **GitHub Actions** — CI: lint → typecheck → unit tests → build → e2e on
  every push/PR to `dev`, `staging`, or `master`
- **Vercel** — hosting (auto-deploys from GitHub once connected)

## Local development

```bash
npm install
npm run dev             # start dev server
npm run lint            # ESLint
npm run typecheck        # tsc -b --noEmit
npm run test             # unit tests (watch mode)
npm run test -- --run    # unit tests (single run, what CI does)
npm run test:e2e         # Playwright e2e tests (requires: npx playwright install)
npm run build             # tsc -b && vite build -> dist/
npm run preview           # preview the production build locally
```

## Branching model

Three long-lived branches, each an environment:

- **`master`** — production. Protected: no direct pushes, changes land via
  PR from `staging`.
- **`staging`** — UAT. Protected: no direct pushes, changes land via PR
  from `dev`.
- **`dev`** — integration branch for day-to-day work, and the repo's
  default branch (what you get on a fresh clone).

Local/feature work branches off `dev` and merges back into `dev` via PR
once it's ready. When `dev` is in good enough shape, open a `dev → staging`
PR; once that's verified, open a `staging → master` PR to release. Both
`/deep-review` and `/generate-ui` (see below) work against PRs targeting
any of the three, so they're usable at every promotion step, not just for
feature PRs into `dev`.

## Project structure

```
src/
  components/   # Nav, Hero, About, Skills, Projects, Contact, PolyMesh (signature canvas visual) — all .tsx
  data/         # skills.ts, projects.ts — edit these to update site content
  test/         # Vitest setup + component tests (.ts/.tsx)
tests/e2e/      # Playwright specs (.ts)
eslint.config.js
tsconfig.json / tsconfig.app.json / tsconfig.node.json
.github/workflows/ci.yml
```

## Customizing content

- Swap the placeholder name, email, and social links in `src/components/Nav.tsx`
  and `src/components/Contact.tsx`.
- Edit `src/data/projects.ts` and `src/data/skills.ts` — the Projects and
  Skills sections render straight from these typed arrays.
- Rewrite the About copy in `src/components/About.tsx`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo. Vercel auto-detects Vite;
   no config needed (build command `npm run build`, output `dist`).
3. In the Vercel project's Git settings, explicitly set **Production
   Branch** to `master`. Vercel sometimes defaults this to whatever GitHub
   reports as the repo's default branch at import time — which is `dev`
   here, not `master` — so don't rely on the default; set it yourself.
4. With that set: pushes to `master` deploy to your production URL
   (`your-project.vercel.app` until you attach a custom domain); pushes to
   `dev`/`staging` and every PR get their own preview URLs, same as any
   other branch.

## CI

`.github/workflows/ci.yml` runs on every push/PR to `dev`, `staging`, or
`master`. All free, no LLM calls, no API billing:

1. Unit tests (Vitest + RTL) → production build
2. Playwright e2e across 4 breakpoints (mobile/tablet/desktop/wide) +
   an axe-core accessibility pass (`tests/e2e/accessibility.spec.ts`)
3. Lighthouse CI (`lighthouserc.json`) — performance/a11y/best-practices/SEO
   score gates
4. Bundle size budget (`size-limit`, config in `package.json`)
5. GitHub's Dependency Review Action on PRs
6. Changelog: `git-cliff` generates `CHANGELOG.md` from Conventional Commit
   messages on every push to `master` — deterministic, no LLM involved

## Agent workflows (Claude Code in GitHub Actions)

Two workflows use Claude Code as a real agent, not just CI scripting. Each
has three ways to trigger it:

- **`.github/workflows/pr-review-loop.yml`** — comment `/deep-review` on a
  PR, open a PR whose head branch name starts with **`review/`**, or run
  manually from the Actions tab. Claude reviews the diff against
  `CLAUDE.md`'s rubric, fixes real issues, verifies with the test suite,
  and re-reviews — up to 10 rounds, stopping early once a pass is clean.
  Fixes are committed directly to the PR branch.
- **`.github/workflows/ui-variant-bot.yml`** — comment
  `/generate-ui <description>` on a PR, open a PR whose head branch name
  starts with **`ui/`** (the brief is read from the PR body's `## Brief`
  section, falling back to the whole body or the PR title), or run
  manually from the Actions tab. Claude builds 1–10 real implementations
  of that UI element and judges them against `CLAUDE.md`'s rubric. The
  winner is **not** pushed directly: it lands on a new branch
  (`ui-variant/pr-<number>-<run id>`) and the bot opens a second PR from
  that branch into your PR's branch, with the scoring rationale in the PR
  body. You review that diff like any other PR — merge it into your branch
  if you like it, or close it and re-run `/generate-ui` with a refined
  brief if you don't.

Both are gated to `ALLOWED_BASE_BRANCHES` (set at the top of each workflow
file, default `dev,staging,master`) regardless of how they're triggered, so
they can't fire against arbitrary branches even via `workflow_dispatch`.
Note that the
branch-name trigger fires on `opened` only (not on every push to the
branch) to keep the cost model close to the original comment-only design —
but it does mean naming a branch `review/...` or `ui/...` and opening a PR
is enough to spend quota, with no comment confirmation step. Use the
`/deep-review` or `/generate-ui` comment to re-run on that same PR later.

### Setup (one-time)

1. Log into Claude Code locally with your Pro/Max subscription:
   `claude setup-token` — this prints an OAuth token tied to your
   subscription, not a pay-per-token API key.
2. Add it as a repo secret named `CLAUDE_CODE_OAUTH_TOKEN`
   (Settings → Secrets and variables → Actions).
3. That's it — both workflows read `CLAUDE_CODE_OAUTH_TOKEN` from `env:` and
   draw from your subscription's usage/Agent SDK credits, the same pool
   Claude Code CLI uses locally.

### What this costs

Nothing beyond your existing Claude subscription, with one caveat: usage
draws from your plan's monthly quota, not a separate always-free bucket.
Expect the token/quota cost to be front-loaded and then drop off:

- **Building and tuning phase (now):** every time you adjust the system
  prompts in these workflow files and test them against real PRs, that's a
  full agent run — reviewing a diff, editing files, running tests, possibly
  looping several times. This is the expensive part, because you're
  iterating.
- **Steady state (once the prompts are solid):** these only run when you
  type `/deep-review` or `/generate-ui`, which for a personal portfolio site
  might be a handful of times a month. Cost drops close to zero because
  nothing fires automatically — no per-push, no per-commit runs.

If you ever want tighter control, add a `max-turns` cap (already set to 40
and 60 respectively) or lower it, and the `variant_count` input on the UI
bot caps at 10 by design.

