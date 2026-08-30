# UI Variant Summary — /journey Scrollytelling

## Brief

Redesign the `/journey` route (`src/pages/Journey.tsx`) into a real scrollytelling experience. Five job-history chapters, revealed as the user scrolls. Constraints: no new npm dependencies (IntersectionObserver + CSS transitions/transforms + position:sticky only); must respect `prefers-reduced-motion`; stay within the existing dark token palette and faceted/geometric visual identity; keep each chapter's company name as an accessible heading with its exact current text; keep the 'My Journey' nav link and a 'back home' link working; zero axe violations at wcag2a/wcag2aa.

---

## Variants

### V1 — Sticky Timeline Reveal

**Score: 17 / 20** (Fidelity 4 · Tokens 5 · A11y 4 · Distinctiveness 4)

Two-column layout: sticky left rail with diamond-shaped chapter indicators that activate as you scroll, right column where each chapter slides in from the right (`translateX`). Diamond dots fill with `volt` when the chapter is active, `cyan` when visited. A gradient accent line appears under each company name.

Rationale: Solid and functional, but the two-column layout is a common pattern for timelines and doesn't distinguish itself strongly within the site's geometric identity.

![v1-initial](variant-screenshots/v1-initial.png)
![v1-scrolled](variant-screenshots/v1-scrolled.png)

---

### V2 — Full-Viewport Chapter Stacks

**Score: 18 / 20** (Fidelity 4 · Tokens 5 · A11y 4 · Distinctiveness 5)

Each chapter occupies `min-h-screen` with a full-bleed reveal. A cinematic hero ("Where I've worked, / and what I built there.") with a "SCROLL" prompt. Fixed header shows a `01 / 05` progress counter that updates with `aria-live`. Large decorative chapter numbers (`02`, `03`…) float in the background at 3% opacity. Content fades + scales up from below; highlights reveal staggered left.

Rationale: Cinematic and premium. Chapter-counter progress indicator is a distinctive touch. Slightly marked down on A11y because the fixed header can obscure content during anchor navigation in some scenarios, and the 100vh sections are sparse for shorter chapters.

![v2-initial](variant-screenshots/v2-initial.png)
![v2-scrolled](variant-screenshots/v2-scrolled.png)

---

### V3 — Terminal Chronicle

**Score: 17 / 20** (Fidelity 4 · Tokens 4 · A11y 4 · Distinctiveness 5)

Each chapter is a terminal window card complete with macOS-style traffic lights, a date range in the title bar, a `brent@portfolio:~$ git log` command prompt, and output structured as `// summary` and numbered `// highlights`. Slides in from the left.

Rationale: Extremely memorable and developer-appropriate. However, the terminal aesthetic drifts from the brief's explicit "faceted/geometric" visual identity, and monospace-heavy text reduces token score. The `font-mono` output blocks also lose some of the design system's typographic hierarchy.

![v3-initial](variant-screenshots/v3-initial.png)
![v3-scrolled](variant-screenshots/v3-scrolled.png)

---

### V4 — Alternating Magazine with Clip-Path Wipe

**Score: 15 / 20** (Fidelity 4 · Tokens 4 · A11y 3 · Distinctiveness 4)

Odd chapters: content left / highlights right. Even chapters: highlights left / content right, using `md:[&>*:first-child]:order-2`. A full-bleed company name watermark floats behind each section. Content panels wipe in via `clip-path: inset(0 100% 0 0 → 0 0% 0 0)` — a horizontal reveal matched to the alternating direction.

Rationale: The clip-path wipe is visually interesting but the visual order reversal (`order-2`) creates a mismatch between DOM order and reading order that can confuse screen reader and keyboard users (A11y –2). The watermark text also pushes the grid layout upward in an unpredictable way.

![v4-initial](variant-screenshots/v4-initial.png)
![v4-scrolled](variant-screenshots/v4-scrolled.png)

---

### V5 — Faceted Card Stack with Timeline ✓ **WINNER**

**Score: 19 / 20** (Fidelity 5 · Tokens 5 · A11y 5 · Distinctiveness 4)

Left vertical timeline gradient line (volt → cyan → violet) with accent-colored diamond connectors that fill in as each card reveals. Each chapter card has a **faceted top border** — a 1px band cut with `clip-path: polygon(0 0, 100% 0, calc(100% - 1.5rem) 100%, 0 100%)` — that directly applies the site's `facet-divider` geometric motif from `src/index.css`. Cards rise from below (`translateY`) as they enter the viewport. Highlights display in a 2-column grid inside the `bg-panel` card body. Accent color cycles: volt → cyan → violet → volt → cyan.

Rationale: The faceted top border is the most direct, considered application of the site's geometric identity token. The timeline with cycling diamond connectors gives clear chronological rhythm. 2-column highlight grid uses space efficiently. Aria structure is clean: no DOM/tab-order mismatches, all decorative elements are `aria-hidden`, headings use `aria-labelledby` correctly.

![v5-initial](variant-screenshots/v5-initial.png)
![v5-scrolled](variant-screenshots/v5-scrolled.png)

---

## Why V5 Won

V5 earned the highest score (19/20) for three reasons:

1. **Geometric identity fidelity**: The clip-path faceted top border on every card is a direct instance of the `facet-divider` motif the CLAUDE.md calls out as the site's identity. No other variant applied this token so literally and effectively.

2. **Accessibility**: No DOM-order / visual-order mismatches, proper `aria-hidden` on all decorative elements, and the IntersectionObserver initial state is correctly set to fully visible when `prefers-reduced-motion` is active — so content is never invisible without JavaScript.

3. **Clarity and scannability**: The left timeline and per-card accent color give a reader immediate visual orientation — you know where you are in the five-chapter sequence without reading dates. The 2-column highlight grid makes efficient use of horizontal space for longer lists.
