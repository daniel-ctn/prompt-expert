// Generates src/app/favicon.ico from public/logo-mark.svg at multiple sizes.
// Run with: pnpm gen:icons

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import toIco from 'to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SVG_SOURCE = path.join(ROOT, 'public', 'logo-mark.svg')
const OUT_ICO = path.join(ROOT, 'src', 'app', 'favicon.ico')
const OUT_PNG_512 = path.join(ROOT, 'public', 'logo-mark-512.png')
const OUT_PNG_OG = path.join(ROOT, 'public', 'og-image.png')

const ICO_SIZES = [16, 32, 48, 64]

async function main() {
  const svg = await fs.readFile(SVG_SOURCE)

  // 1. Render PNGs at every required size and bundle into a multi-size ICO
  const pngBuffers = await Promise.all(
    ICO_SIZES.map((size) =>
      sharp(svg, { density: 512 })
        .resize(size, size, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
        .png({ compressionLevel: 9 })
        .toBuffer(),
    ),
  )
  const ico = await toIco(pngBuffers)
  await fs.writeFile(OUT_ICO, ico)
  console.log(
    `✓ favicon.ico  → ${path.relative(ROOT, OUT_ICO)}  (${ICO_SIZES.join(', ')}px)`,
  )

  // 2. A large PNG of the mark for sharing / readme use
  await sharp(svg, { density: 512 })
    .resize(512, 512, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toFile(OUT_PNG_512)
  console.log(`✓ logo-mark-512.png → ${path.relative(ROOT, OUT_PNG_512)}`)

  // 3. OG image (1200x630) with paper background and centered mark
  const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F4ECDD"/>
  <g opacity="0.06">
    ${Array.from({ length: 32 })
      .map(
        (_, i) =>
          `<line x1="0" y1="${i * 20}" x2="1200" y2="${i * 20}" stroke="#1B2240" stroke-width="0.3"/>`,
      )
      .join('')}
  </g>
  <g transform="translate(220 195) scale(3.75)">
    <rect width="64" height="64" fill="#1B2240"/>
    <rect x="3" y="3" width="58" height="58" fill="none" stroke="#F4ECDD" stroke-opacity="0.08" stroke-width="0.75"/>
    <polyline points="18,18 35,32 18,46" fill="none" stroke="#F4ECDD" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="40" y="23" width="7" height="18" fill="#E0A23A"/>
  </g>
  <g transform="translate(560 240)">
    <text x="0" y="40" font-family="'Fraunces', 'Source Serif Pro', Georgia, serif" font-weight="500" font-size="72" fill="#1B2240" letter-spacing="-2">Prompt Expert</text>
    <line x1="0" y1="64" x2="540" y2="64" stroke="#1B2240" stroke-width="1.2"/>
    <text x="0" y="98" font-family="'JetBrains Mono', 'Cascadia Mono', monospace" font-size="18" fill="#1B2240" fill-opacity="0.65" letter-spacing="4">PROMPT WORKFLOWS · V2</text>
    <text x="0" y="160" font-family="'Fraunces', 'Source Serif Pro', Georgia, serif" font-style="italic" font-size="32" fill="#1B2240" fill-opacity="0.78">Sharper prompts, calmer workflow.</text>
  </g>
</svg>`
  await sharp(Buffer.from(ogSvg))
    .png({ compressionLevel: 9 })
    .toFile(OUT_PNG_OG)
  console.log(`✓ og-image.png → ${path.relative(ROOT, OUT_PNG_OG)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
