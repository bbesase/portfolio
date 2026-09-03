import { test, expect } from '@playwright/test'

test('theme picker opens and lists all themes', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: /choose color theme/i })
  await trigger.click()
  await expect(page.getByRole('button', { name: 'Solar Flare' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Deep Ocean' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Midnight Violet' })).toBeVisible()
})

test('selecting a theme applies it and persists across reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /choose color theme/i }).click()
  await page.getByRole('button', { name: 'Deep Ocean' }).click()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'deep-ocean')
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('deep-ocean')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'deep-ocean')
})

test('theme choice persists when navigating from home to /journey', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /choose color theme/i }).click()
  await page.getByRole('button', { name: 'Solar Flare' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'solar-flare')

  const menuToggle = page.getByRole('button', { name: /menu/i })
  if (await menuToggle.isVisible()) {
    await menuToggle.click()
  }
  await page.getByRole('link', { name: 'My Journey' }).click()
  await expect(page).toHaveURL(/\/journey$/)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'solar-flare')
})

test('escape closes the picker and returns focus to the trigger', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: /choose color theme/i })
  await trigger.click()
  await expect(page.getByRole('button', { name: 'Solar Flare' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Solar Flare' })).not.toBeVisible()
  await expect(trigger).toBeFocused()
})
