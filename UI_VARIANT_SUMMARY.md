# Hero Background — UI Variant Summary

## Brief

Replace the Hero section's PolyMesh (animated particle-mesh canvas) with a
**fully tessellated, flat-shaded low-poly triangle background**: opaque
triangles tiling the entire viewport, faceted gem/crystal aesthetic, coloured
exclusively from the existing dark design tokens (`ink`, `panel`, `panel2`,
`line`) with `volt`/`cyan`/`violet` as sparing accent facets (~10%). All
colours must reference CSS custom properties (`--color-*` vars in `:root`)
rather than hardcoded hex, so a future theme picker can restyle the mesh.
Must respect `prefers-reduced-motion` and keep hero text legible.

---

## Rubric (per CLAUDE.md)

Score each variant 1–5 on:
1. **Fidelity** — does it fulfil the written brief?
2. **Tokens** — correct use of design-system CSS vars, no invented colours?
3. **A11y** — contrast, focus, motion (`prefers-reduced-motion` respected)?
4. **Distinctiveness** — considered choice for this specific site, not a
   template default?

---

## Variant Scores

| # | Name | Fidelity | Tokens | A11y | Distinct | **Total** |
|---|------|----------|--------|------|----------|-----------|
| V1 | Static tessellation | 5 | 5 | 5 | 3 | **18** |
| V2 | Breathing facets | 5 | 5 | 4 | 4 | **18** |
| V3 | Diagonal light-band sweep | 5 | 5 | 4 | 5 | **19** ✓ |
| V4 | Mouse-proximity glow | 4 | 5 | 3 | 4 | **16** |
| V5 | Vertex drift (morphing) | 4 | 5 | 4 | 5 | **18** |

### One-line rationale per variant

- **V1 (18)** — Pixel-perfect brief compliance, flawless accessibility, but a
  static low-poly mesh is a well-known web pattern; scores 3 on distinctiveness.
- **V2 (18)** — Golden-ratio phase spread produces an organic shimmer that reads
  "alive" rather than decorative; accessibility ding is minor (slow animation,
  no contrast impact), but the effect reads as a breathing texture rather than a
  crystal, so distinctiveness stays at 4.
- **V3 (19)** — A diagonal band of brightness catches the facets as it drifts
  across (top-left → bottom-right), making accent facets (volt/cyan/violet)
  visibly pulse at full saturation when hit. This directly embodies the site's
  *faceted gem refracting light* identity — the diagonal direction mirrors the
  `facet-divider` clip-paths used throughout the layout. Not a generic
  animation; a considered metaphor. Scores 5 on distinctiveness.
- **V4 (16)** — Interactive gem-glow is visually satisfying on desktop but
  invisible on touch devices (mouse-only), and capturing pointer-events over
  the hero can interfere with content interaction. A11y drops to 3.
- **V5 (18)** — Slowly morphing vertices create the most immersive crystal
  feel; however, changing vertex positions means the facet *shapes* shift over
  time, which departs from "flat-shaded" (the facets re-facet continuously),
  and there is a small topological risk of near-degenerate triangles. Scores 4
  on fidelity.

---

## Winner: V3 — Diagonal light-band sweep

**File:** `src/components/LowPolyV3.tsx`

V3 scores highest on distinctiveness (5/5) because the diagonal sweep is a
deliberate design choice, not an incidental animation: it simulates light
refracting through a gem as the viewing angle shifts, and the diagonal direction
(top-left → bottom-right) echoes the `facet-divider` / `facet-divider-rev`
clip-paths that define the site's geometric identity. Accent facets glow to
full saturation as the band passes, making the volt/cyan/violet token hierarchy
legible in motion. The ~14 s period keeps motion below distraction threshold.
Under `prefers-reduced-motion`, a single static frame is drawn and the rAF loop
never fires. The gradient overlay (`from-ink/10 via-ink/40 to-ink`) on top of
the mesh guarantees hero text contrast regardless of which facets are lit.
