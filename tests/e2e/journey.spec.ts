import { test, expect } from '@playwright/test'

test('direct navigation to /journey renders the route', async ({ page }) => {
  await page.goto('/journey')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/journey|worked/i)
  await expect(page.getByRole('heading', { name: 'Blueprint Income' })).toBeVisible()
})

test('nav link navigates to /journey and back link returns home', async ({ page }) => {
  await page.goto('/')
  const menuToggle = page.getByRole('button', { name: /menu/i })
  if (await menuToggle.isVisible()) {
    await menuToggle.click()
  }
  await page.getByRole('link', { name: 'My Journey' }).click()
  await expect(page).toHaveURL(/\/journey$/)
  await expect(page.getByRole('heading', { name: 'Blueprint Income' })).toBeVisible()

  await page.getByRole('link', { name: /back home/i }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/build interfaces/i)
})

test('browser back button returns from /journey to the homepage', async ({ page }) => {
  await page.goto('/')
  const menuToggle = page.getByRole('button', { name: /menu/i })
  if (await menuToggle.isVisible()) {
    await menuToggle.click()
  }
  await page.getByRole('link', { name: 'My Journey' }).click()
  await expect(page).toHaveURL(/\/journey$/)

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/build interfaces/i)
})
