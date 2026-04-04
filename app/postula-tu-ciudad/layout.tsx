import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Postula tu ciudad',
  description:
    'Lleva Synergy a tu ciudad: comunidad de founders y networking.',
  alternates: { canonical: absoluteUrl('/postula-tu-ciudad') },
  openGraph: {
    title: 'Postula tu ciudad | Synergy',
    description:
      'Lleva Synergy a tu ciudad: comunidad de founders y networking.',
    url: absoluteUrl('/postula-tu-ciudad'),
  },
}

export default function PostulaCiudadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
