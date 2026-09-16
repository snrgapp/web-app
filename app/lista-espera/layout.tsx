import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Lista de espera',
  description:
    'Regístrate en la lista de espera de Synergy para nuevas ciudades del Caribe.',
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl('/lista-espera') },
  openGraph: {
    title: 'Lista de espera | Synergy',
    description:
      'Regístrate en la lista de espera de Synergy para nuevas ciudades del Caribe.',
    url: absoluteUrl('/lista-espera'),
  },
}

export default function ListaEsperaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
