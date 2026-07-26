// Regenerate the Open Graph link-preview card (public/og-preview.png, 1200x630).
//
//   node scripts/generate-og.mjs
//
// Renders the card with headless Chromium, so it needs a local Chrome/Chromium.
// Set CHROME_PATH to override the executable location.
import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '../public')
const markPath = resolve(publicDir, 'brand/bond-logo-white-512.png')
const outPath = resolve(publicDir, 'og-preview.png')

const chromePath =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const markDataUri =
  'data:image/png;base64,' + readFileSync(markPath).toString('base64')

const html = `<!doctype html><html><head><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{background:#0a0a0a;color:#fafafa;font-family:'Helvetica Neue',Arial,ui-sans-serif,system-ui;position:relative}
  .mono{font-family:ui-monospace,'SF Mono',Menlo,monospace}
  .wrap{position:absolute;inset:0;display:flex}
  .left{width:64%;display:flex;flex-direction:column;justify-content:center;padding:0 0 0 96px}
  .right{width:36%;position:relative;border-left:1px solid rgba(250,250,250,.10);
         display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
  .mark{width:216px;height:216px;object-fit:contain;opacity:.96}
  .rcap{font-size:14px;letter-spacing:.26em;text-transform:uppercase;color:#8f8f8f}
  .eyebrow{font-size:15px;letter-spacing:.32em;text-transform:uppercase;color:#8f8f8f}
  .brand{font-size:158px;font-weight:600;letter-spacing:-.06em;line-height:.88;margin-top:24px}
  .tagline{font-size:46px;font-weight:500;letter-spacing:-.03em;margin-top:24px;color:#fafafa}
  .desc{font-size:24px;letter-spacing:-.01em;margin-top:16px;color:#a3a3a3}
  .mech{font-size:16px;letter-spacing:.16em;text-transform:uppercase;margin-top:30px;color:#8f8f8f}
  .footer{position:absolute;left:96px;bottom:52px;font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#6b6b6b}
  .domain{position:absolute;right:52px;bottom:52px;font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#6b6b6b}
</style></head><body>
  <div class="wrap">
    <div class="left">
      <div class="eyebrow mono">USDC escrow on Arc</div>
      <div class="brand">BOND</div>
      <div class="tagline">Safe deals on Arc.</div>
      <div class="desc">Lock USDC, settle the deal in one room.</div>
      <div class="mech mono">Fund &rarr; Deliver &rarr; Release &rarr; Dispute</div>
    </div>
    <div class="right">
      <img class="mark" src="${markDataUri}" />
      <div class="rcap mono">Escrow rooms</div>
    </div>
  </div>
  <div class="footer mono">Build on Arc Testnet</div>
  <div class="domain mono">usebond.xyz</div>
</body></html>`

const browser = await chromium.launch({ executablePath: chromePath })
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } })
writeFileSync(outPath, buf)
await browser.close()
console.log('Wrote', outPath)
