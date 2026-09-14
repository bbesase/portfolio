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

test('hovering and keyboard-focusing a node shows its description in the shared panel', async ({ page }) => {
  await page.goto('/projects/migrateiq')
  const prisma = page.getByRole('button', { name: 'Prisma' })
  const panelId = await prisma.getAttribute('aria-describedby')
  const panel = page.locator(`#${panelId}`)

  await expect(panel).toContainText(/hover or select a node/i)
  await prisma.hover()
  await expect(panel).toContainText(/ORM/i)

  await page.mouse.move(0, 0)
  await expect(panel).toContainText(/hover or select a node/i)

  await prisma.focus()
  await expect(panel).toContainText(/ORM/i)
  await prisma.blur()
  await expect(panel).toContainText(/hover or select a node/i)
})

test('the description panel never overlaps the diagram, even in the top row', async ({ page }) => {
  // MigrateIQ's diagram has 5 rows -- hovering the first row's node is the
  // exact case that previously rendered a floating tooltip on top of the
  // row directly below it.
  await page.goto('/projects/migrateiq')
  const typescript = page.getByRole('button', { name: 'TypeScript' })
  const lastRowNode = page.getByRole('button', { name: 'Postgres' })
  await typescript.hover()

  const panelBox = await page.locator(`#${await typescript.getAttribute('aria-describedby')}`).boundingBox()
  const lastRowBox = await lastRowNode.boundingBox()
  if (!panelBox || !lastRowBox) throw new Error('expected both elements to have a bounding box')

  // The panel renders below every node in the diagram, including the
  // last row's -- structurally impossible to collide with any node.
  expect(panelBox.y).toBeGreaterThanOrEqual(lastRowBox.y + lastRowBox.height)
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
