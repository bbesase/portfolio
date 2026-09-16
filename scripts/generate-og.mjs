// Renders scripts/og-image.html (a static, standalone mockup -- not part of
// the built app) to public/og-image.png at the exact 1200x630 Open Graph
// size. Run via `npm run og-image` whenever the branding in og-image.html
// changes; the PNG itself is committed since it's a real deployed asset,
// not a build artifact.
import { chromium } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('file://' + path.join(__dirname, 'og-image.html'))
await page.waitForTimeout(300) // let webfonts settle
await page.screenshot({ path: path.join(__dirname, '..', 'public', 'og-image.png') })
await browser.close()
console.log('done')
