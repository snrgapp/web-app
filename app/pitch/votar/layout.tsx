import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Votar en el pitch',
  description:
    'Vota en el spotlight Synergy. Apoya a los founders seleccionados.',
  alternates: { canonical: absoluteUrl('/pitch/votar') },
  openGraph: {
    title: 'Votar en el pitch | Synergy',
    description:
      'Vota en el spotlight Synergy. Apoya a los founders seleccionados.',
    url: absoluteUrl('/pitch/votar'),
  },
}

export default function PitchVotarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
