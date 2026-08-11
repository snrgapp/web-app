'use client'

import dynamic from 'next/dynamic'

const ProgressLibrary = dynamic(
  () =>
    import('@/components/recursos/complete-shelf/ProgressLibrary').then(
      (m) => m.ProgressLibrary
    ),
  {
    ssr: false,
    loading: () => (
      <div className="recursos-shelf-root">
        <div
          style={{
            minHeight: '100dvh',
            display: 'grid',
            placeItems: 'center',
            color: 'rgba(37, 35, 31, 0.62)',
            fontFamily: '"Newsreader Variable", Georgia, serif',
            letterSpacing: '0.04em',
          }}
        >
          Abriendo la estantería…
        </div>
      </div>
    ),
  }
)

export default function RecursosPage() {
  return (
    <div className="recursos-shelf-root">
      <ProgressLibrary />
    </div>
  )
}
