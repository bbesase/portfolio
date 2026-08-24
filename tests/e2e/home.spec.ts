import { test, expect } from '@playwright/test'

test('homepage loads with hero and nav', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/build interfaces/i)
  await expect(page.getByRole('link', { name: /projects/i }).first()).toBeVisible()
})

test('nav links scroll to each section', async ({ page }) => {
  await page.goto('/')
  for (const [label, id] of [
    ['About', 'about'],
    ['Skills', 'skills'],
    ['Projects', 'projects'],
    ['Contact', 'contact'],
  ]) {
    await page.getByRole('link', { name: label, exact: true }).first().click()
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
})

test('contact section exposes a mailto link', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: /you@example\.com/i })
  await expect(link).toHaveAttribute('href', 'mailto:you@example.com')
})
