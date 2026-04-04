import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Eventos',
  description:
    'Calendario y experiencias Synergy: encuentros para founders y makers.',
  alternates: { canonical: absoluteUrl('/eventos') },
  openGraph: {
    title: 'Eventos | Synergy',
    description:
      'Calendario y experiencias Synergy: encuentros para founders y makers.',
    url: absoluteUrl('/eventos'),
  },
}

export default function EventosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
