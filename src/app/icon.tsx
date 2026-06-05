import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#1B2240"/>
  <polyline points="18,18 35,32 18,46" fill="none" stroke="#F4ECDD" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="40" y="23" width="7" height="18" fill="#E0A23A"/>
</svg>`

export default function Icon() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: 32, height: 32 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og (Satori) renders a raw <img>, not next/image */}
      <img
        alt=""
        width={32}
        height={32}
        src={`data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`}
      />
    </div>,
    size,
  )
}
