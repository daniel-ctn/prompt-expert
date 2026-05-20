import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

async function loadFraunces() {
  const res = await fetch(
    'https://fonts.googleapis.com/css2?family=Fraunces:wght@600&display=swap',
  )
  const css = await res.text()
  const fontUrl = css.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
  if (!fontUrl) return null
  const fontRes = await fetch(fontUrl)
  return await fontRes.arrayBuffer()
}

export default async function AppleIcon() {
  const font = await loadFraunces().catch(() => null)

  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: '#1B2240',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F4ECDD',
        fontFamily: 'Fraunces, serif',
        fontWeight: 600,
        fontSize: 112,
        letterSpacing: -3,
        position: 'relative',
      }}
    >
      {/* Inner registration frame */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          bottom: 12,
          border: '1px solid rgba(244, 236, 221, 0.08)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <span>P</span>
        <span style={{ color: '#E0A23A', margin: '0 -8px' }}>·</span>
        <span>E</span>
      </div>
    </div>,
    {
      ...size,
      fonts: font
        ? [{ name: 'Fraunces', data: font, weight: 600, style: 'normal' }]
        : undefined,
    },
  )
}
