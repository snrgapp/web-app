import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Synergy — networking para founders y makers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #f2f2f2 0%, #e8e8e8 50%, #d4d4d4 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            Synergy
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Founders & makers — networking sin fricción
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: '#525252',
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            Eventos, comunidad e IA para conectar perfiles.
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 72,
            width: 120,
            height: 8,
            background: '#E5B318',
            borderRadius: 4,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
