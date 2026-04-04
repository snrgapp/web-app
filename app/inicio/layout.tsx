import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Networking sin fricción para founders y makers: eventos, comunidad y herramientas para conectar.',
  alternates: {
    canonical: absoluteUrl('/inicio'),
  },
  openGraph: {
    title: 'Synergy | Founders & Makers',
    description:
      'Networking sin fricción para founders y makers: eventos, comunidad y herramientas para conectar.',
    url: absoluteUrl('/inicio'),
  },
}

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
