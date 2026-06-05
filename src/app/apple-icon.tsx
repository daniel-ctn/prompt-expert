import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#1B2240"/>
  <rect x="3" y="3" width="58" height="58" fill="none" stroke="#F4ECDD" stroke-opacity="0.08" stroke-width="0.75"/>
  <polyline points="18,18 35,32 18,46" fill="none" stroke="#F4ECDD" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="40" y="23" width="7" height="18" fill="#E0A23A"/>
  <g fill="#F4ECDD" fill-opacity="0.4">
    <rect x="4" y="4" width="3" height="1"/><rect x="4" y="4" width="1" height="3"/>
    <rect x="57" y="4" width="3" height="1"/><rect x="59" y="4" width="1" height="3"/>
    <rect x="4" y="59" width="3" height="1"/><rect x="4" y="57" width="1" height="3"/>
    <rect x="57" y="59" width="3" height="1"/><rect x="59" y="57" width="1" height="3"/>
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
