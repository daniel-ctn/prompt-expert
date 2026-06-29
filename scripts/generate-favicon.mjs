// Generates all raster brand assets from the "Aperture P" mark.
// Run with: pnpm gen:icons
//
// Outputs:
//   src/app/favicon.ico        — multi-size tab icon (16/32/48/64)
//   public/logo-mark-512.png   — large square mark (readme / sharing)
//   public/logo.png            — square mark alias
//   public/icon-192.png        — PWA / maskable icon
//   public/icon-512.png        — PWA / maskable icon
//   public/og-image.png        — 1200×630 Open Graph card

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import toIco from 'to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

// ── Brand tokens (sRGB hex of the live Ink & Signal OKLCH tokens) ──────────
const TILE = '#101216' // dark instrument tile (terminal tone)
const INK = '#F2F4F5' // near-white foreground
const SIGNAL = '#B1EF4A' // electric lime signal
const PAGE = '#0D0E11' // dark page background

// Shared "Aperture P" glyph (stem + bowl + windowed counter), on the 64 grid.
const P_GLYPH = `M17 14 Q17 13 18 13 L36 13 A12 12 0 0 1 36 37 L26 37 L26 48 Q26 49 25 49 L18 49 Q17 49 17 48 Z M26 20 L35 20 A5 5 0 0 1 35 30 L26 30 Z`

/**
 * Build a self-contained mark SVG.
 * @param {object} o
 * @param {number} [o.rx]      tile corner radius on the 64 grid (0 = full-bleed)
 * @param {number} [o.pad]     inner padding for maskable safe-zone (grid units)
 * @param {boolean} [o.frame]  draw the hairline instrument edge
 */
function markSvg({ rx = 14, pad = 0, frame = false } = {}) {
  // Optionally inset the glyph into a maskable safe zone.
  const inner = pad
    ? `<g transform="translate(${pad} ${pad}) scale(${(64 - pad * 2) / 64})">`
    : '<g>'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="${rx}" fill="${TILE}"/>
  ${frame ? `<rect x="0.6" y="0.6" width="62.8" height="62.8" rx="${rx - 0.6}" fill="none" stroke="${INK}" stroke-opacity="0.07"/>` : ''}
  ${inner}
    <path fill-rule="evenodd" clip-rule="evenodd" fill="${INK}" d="${P_GLYPH}"/>
    <rect x="29.5" y="22" width="5" height="6" rx="1.3" fill="${SIGNAL}"/>
  </g>
</svg>`
}

const render = (svg, size, opts = {}) =>
  sharp(Buffer.from(svg), { density: 512 })
    .resize(size, size, { fit: 'contain', kernel: sharp.kernel.lanczos3, ...opts })
    .png({ compressionLevel: 9 })

async function main() {
  const tabMark = markSvg({ rx: 14, frame: false }) // rounded tile, crisp at 16px
  const maskable = markSvg({ rx: 0, pad: 10 }) // full-bleed + safe-zone padding

  // 1. favicon.ico (multi-size)
  const icoSizes = [16, 32, 48, 64]
  const icoBuffers = await Promise.all(
    icoSizes.map((s) => render(tabMark, s).toBuffer()),
  )
  const ico = await toIco(icoBuffers)
  await fs.writeFile(path.join(ROOT, 'src', 'app', 'favicon.ico'), ico)
  console.log(`✓ favicon.ico  (${icoSizes.join(', ')}px)`)

  // 2. Square mark PNGs
  await render(markSvg({ rx: 14, frame: true }), 512).toFile(
    path.join(PUBLIC, 'logo-mark-512.png'),
  )
  await render(markSvg({ rx: 14, frame: true }), 512).toFile(
    path.join(PUBLIC, 'logo.png'),
  )
  console.log('✓ logo-mark-512.png, logo.png')

  // 3. PWA / maskable icons
  await render(maskable, 192).toFile(path.join(PUBLIC, 'icon-192.png'))
  await render(maskable, 512).toFile(path.join(PUBLIC, 'icon-512.png'))
  console.log('✓ icon-192.png, icon-512.png')

  // 4. Open Graph card (1200×630) — Ink & Signal
  const grid = Array.from({ length: 22 }, (_, i) => i * 56)
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAGE}"/>
  <g stroke="${INK}" stroke-opacity="0.05" stroke-width="1">
    ${grid.map((y) => `<line x1="0" y1="${y}" x2="1200" y2="${y}"/>`).join('')}
    ${grid.map((x) => `<line x1="${x * 1.6}" y1="0" x2="${x * 1.6}" y2="630"/>`).join('')}
  </g>
  <!-- mark -->
  <g transform="translate(96 232) scale(2.6)">
    <rect width="64" height="64" rx="14" fill="${TILE}"/>
    <rect x="0.6" y="0.6" width="62.8" height="62.8" rx="13.4" fill="none" stroke="${INK}" stroke-opacity="0.08"/>
    <path fill-rule="evenodd" clip-rule="evenodd" fill="${INK}" d="${P_GLYPH}"/>
    <rect x="29.5" y="22" width="5" height="6" rx="1.3" fill="${SIGNAL}"/>
  </g>
  <!-- eyebrow -->
  <g transform="translate(300 250)">
    <circle cx="6" cy="-5" r="5" fill="${SIGNAL}"/>
    <text x="22" y="0" font-family="'Geist Mono', ui-monospace, 'Cascadia Mono', monospace" font-size="20" letter-spacing="5" fill="${INK}" fill-opacity="0.6">PROMPT WORKFLOW · FREE &amp; OPEN</text>
  </g>
  <text x="300" y="330" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="86" font-weight="600" letter-spacing="-3" fill="${INK}">Prompt Expert</text>
  <text x="300" y="400" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="34" font-weight="400" fill="${INK}" fill-opacity="0.62">The workbench for serious prompting.</text>
  <rect x="300" y="416" width="232" height="10" rx="5" fill="${SIGNAL}" fill-opacity="0.22"/>
</svg>`
  await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(
    path.join(PUBLIC, 'og-image.png'),
  )
  console.log('✓ og-image.png (1200×630)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
