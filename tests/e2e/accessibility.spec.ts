import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { THEMES } from '../../src/theme'

const THEME_IDS = THEMES.map((t) => t.id)

test('homepage has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})

test('journey page has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/journey')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})

// Each palette is a real, sanctioned choice (see CLAUDE.md), not a one-off
// -- so every one of them needs its own contrast check, not just the
// default. localStorage is set before the app boots (goto, then reload)
// so the theme is active on first paint, same as a real returning visitor.
for (const theme of THEME_IDS) {
  test(`homepage has no detectable accessibility violations [${theme}]`, async ({ page }) => {
    await page.goto('/')
    await page.evaluate((t) => localStorage.setItem('portfolio-theme', t), theme)
    await page.reload()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test(`journey page has no detectable accessibility violations [${theme}]`, async ({ page }) => {
    await page.goto('/journey')
    await page.evaluate((t) => localStorage.setItem('portfolio-theme', t), theme)
    await page.reload()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
}
