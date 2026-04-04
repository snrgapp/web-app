import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pitch',
  description:
    'Acceso al pitch y spotlight Synergy: founders en escena y votación.',
  alternates: { canonical: absoluteUrl('/pitch') },
  openGraph: {
    title: 'Pitch | Synergy',
    description:
      'Acceso al pitch y spotlight Synergy: founders en escena y votación.',
    url: absoluteUrl('/pitch'),
  },
}

export default function PitchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
