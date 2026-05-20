import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
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

export default async function Icon() {
  const font = await loadFraunces().catch(() => null)

  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#1B2240',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F4ECDD',
        fontFamily: 'Fraunces, serif',
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: -0.5,
      }}
    >
      P<span style={{ color: '#E0A23A', margin: '0 -1px' }}>·</span>E
    </div>,
    {
      ...size,
      fonts: font
        ? [{ name: 'Fraunces', data: font, weight: 600, style: 'normal' }]
        : undefined,
    },
  )
}
