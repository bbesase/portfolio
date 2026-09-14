import { test, expect } from '@playwright/test'

test('homepage and journey page have distinct titles and descriptions', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Brent Besase \| Software Engineer/)
  const homeDescription = await page.locator('meta[name="description"]').getAttribute('content')
  expect(homeDescription).toMatch(/React, Tailwind/)

  await page.goto('/journey')
  await expect(page).toHaveTitle(/My Journey \| Brent Besase/)
  const journeyDescription = await page.locator('meta[name="description"]').getAttribute('content')
  expect(journeyDescription).toMatch(/where Brent Besase has worked/)
})

test('homepage exposes canonical link and Open Graph/Twitter tags', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\//)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Brent Besase/)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https:\/\//)
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
})

test('homepage embeds valid Person JSON-LD', async ({ page }) => {
  await page.goto('/')
  const json = await page.locator('script[type="application/ld+json"]').textContent()
  const data = JSON.parse(json ?? '{}')
  expect(data['@type']).toBe('Person')
  expect(data.name).toBe('Brent Besase')
  expect(data.sameAs).toEqual(
    expect.arrayContaining([
      'https://github.com/bbesase',
      'https://www.linkedin.com/in/brent-besase/',
    ])
  )
})

test('robots.txt and sitemap.xml are reachable', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBe(true)
  expect(await robots.text()).toContain('Sitemap:')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBe(true)
  const body = await sitemap.text()
  expect(body).toContain('<urlset')
  expect(body).toContain('/journey')
})
