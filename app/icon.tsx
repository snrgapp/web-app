import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  let logoSrc = '/logo.png'

  try {
    const logoBuffer = fs.readFileSync(logoPath)
    logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`
  } catch {
    // fallback to path if file read fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={32}
          height={32}
          style={{
            filter: 'grayscale(100%) brightness(1.1) contrast(1.1)',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
