import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Full-bleed dark tile (iOS applies its own corner mask), glyph inset for breathing room.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#101216"/>
  <g transform="translate(8 8) scale(0.75)">
    <path fill-rule="evenodd" clip-rule="evenodd" fill="#F2F4F5" d="M17 14 Q17 13 18 13 L36 13 A12 12 0 0 1 36 37 L26 37 L26 48 Q26 49 25 49 L18 49 Q17 49 17 48 Z M26 20 L35 20 A5 5 0 0 1 35 30 L26 30 Z"/>
    <rect x="29.5" y="22" width="5" height="6" rx="1.3" fill="#B1EF4A"/>
  </g>
</svg>`

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: 180, height: 180 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og (Satori) renders a raw <img>, not next/image */}
      <img
        alt=""
        width={180}
        height={180}
        src={`data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`}
      />
    </div>,
    size,
  )
}
