import { test, expect } from '@playwright/test'

test('clicking a project card navigates to its detail page', async ({ page }) => {
  await page.goto('/')
  await page.locator('#projects').scrollIntoViewIfNeeded()
  await page.getByRole('link', { name: /migrateiq/i }).click()
  await expect(page).toHaveURL(/\/projects\/migrateiq$/)
  await expect(page.getByRole('heading', { name: 'MigrateIQ', level: 1 })).toBeVisible()
  await expect(page).toHaveTitle(/MigrateIQ \| Brent Besase/)
})

test('direct navigation to a project detail page renders its diagram', async ({ page }) => {
  await page.goto('/projects/archmage')
  await expect(page.getByRole('heading', { name: 'Archmage', level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Java' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Gradle' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Minecraft Forge' })).toBeVisible()
})

test('hovering and keyboard-focusing a node reveals its description', async ({ page }) => {
  await page.goto('/projects/migrateiq')
  const prisma = page.getByRole('button', { name: 'Prisma' })
  const tooltip = page.locator('[id^="arch-desc-prisma"]')

  await expect(tooltip).toHaveCSS('opacity', '0')
  await prisma.hover()
  await expect(tooltip).toHaveCSS('opacity', '1')
  await expect(tooltip).toContainText(/ORM/i)

  await page.mouse.move(0, 0)
  await expect(tooltip).toHaveCSS('opacity', '0')

  await prisma.focus()
  await expect(tooltip).toHaveCSS('opacity', '1')
})

test('clicking a node highlights its connections and click-outside clears it', async ({ page }) => {
  await page.goto('/projects/migrateiq')
  const prisma = page.getByRole('button', { name: 'Prisma' })
  const typescript = page.getByRole('button', { name: 'TypeScript' })

  await prisma.click()
  await expect(prisma).toHaveAttribute('aria-pressed', 'true')
  // TypeScript isn't connected to Prisma -- it should dim.
  await expect(typescript).toHaveCSS('opacity', '0.4')

  await page.mouse.click(10, 10)
  await expect(prisma).toHaveAttribute('aria-pressed', 'false')
  await expect(typescript).toHaveCSS('opacity', '1')
})

test('detail page CTA links to the right place with the right label', async ({ page }) => {
  await page.goto('/projects/archmage')
  const cta = page.getByRole('link', { name: 'View on GitHub' })
  await expect(cta).toHaveAttribute('href', 'https://github.com/bbesase/archmage')

  await page.goto('/projects/migrateiq')
  const visit = page.getByRole('link', { name: 'Visit site' })
  await expect(visit).toHaveAttribute('href', 'https://migrateiq.vercel.app')
})

test('back home link returns to the homepage', async ({ page }) => {
  await page.goto('/projects/this-site')
  await page.getByRole('link', { name: 'Back home' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/build interfaces/i)
})
