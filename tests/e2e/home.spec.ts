import { test, expect } from '@playwright/test'

test('homepage loads with hero and nav', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/build interfaces/i)
  await expect(page.getByRole('link', { name: /projects/i }).first()).toBeVisible()
})

test('nav links scroll to each section', async ({ page }) => {
  await page.goto('/')
  const menuToggle = page.getByRole('button', { name: /menu/i })
  for (const [label, id] of [
    ['About', 'about'],
    ['Skills', 'skills'],
    ['Projects', 'projects'],
    ['Contact', 'contact'],
  ]) {
    // Below the sm breakpoint, nav links live behind a hamburger toggle.
    if (await menuToggle.isVisible()) {
      await menuToggle.click()
    }
    await page.getByRole('link', { name: label, exact: true }).first().click()
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
})

test('contact section exposes a mailto link', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: /bbesase51@gmail\.com/i })
  await expect(link).toHaveAttribute('href', 'mailto:bbesase51@gmail.com')
})
