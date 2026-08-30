// Usage: node screenshot-variant.mjs <variantNum> <port>
import { chromium } from '@playwright/test'
import { mkdir } from 'fs/promises'
import { join } from 'path'

const [,, variantNum, port] = process.argv
if (!variantNum || !port) {
  console.error('Usage: node screenshot-variant.mjs <variantNum> <port>')
  process.exit(1)
}

const outDir = join(import.meta.dirname, 'variant-screenshots')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 800 })

const url = `http://localhost:${port}/journey`
console.log(`Opening ${url}`)

// Wait for server to be ready
let attempts = 0
while (attempts < 20) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
    break
  } catch {
    attempts++
    await new Promise(r => setTimeout(r, 1000))
  }
}

// Take initial (top-of-page) screenshot
await page.waitForTimeout(600)
await page.screenshot({
  path: join(outDir, `v${variantNum}-initial.png`),
  fullPage: false,
})
console.log(`Saved v${variantNum}-initial.png`)

// Scroll to second chapter heading and wait for reveal animation
await page.evaluate(() => {
  const headings = document.querySelectorAll('h2')
  if (headings[1]) {
    headings[1].scrollIntoView({ behavior: 'instant', block: 'center' })
  } else {
    window.scrollBy(0, 900)
  }
})
// Wait for scroll-triggered animations to settle
await page.waitForTimeout(1200)

await page.screenshot({
  path: join(outDir, `v${variantNum}-scrolled.png`),
  fullPage: false,
})
console.log(`Saved v${variantNum}-scrolled.png`)

await browser.close()
console.log('Done.')
