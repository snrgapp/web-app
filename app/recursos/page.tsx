'use client'

import dynamic from 'next/dynamic'
import '@/components/recursos/recursos-shelf.css'

const CompleteShelf = dynamic(
  () =>
    import('@/components/recursos/CompleteShelf').then((m) => m.CompleteShelf),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          background: '#F3EEE4',
          display: 'grid',
          placeItems: 'center',
          color: '#5c5348',
          fontFamily: 'Georgia, serif',
        }}
      >
        Abriendo la estantería…
      </div>
    ),
  }
)

export default function RecursosPage() {
  return <CompleteShelf />
}
