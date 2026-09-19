import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Radar de convocatorias',
  description:
    'Convocatorias de financiación y aceleración para emprendedores en Colombia.',
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl('/radar-convocatorias') },
  openGraph: {
    title: 'Radar de convocatorias | Synergy',
    description:
      'Convocatorias de financiación y aceleración para emprendedores en Colombia.',
    url: absoluteUrl('/radar-convocatorias'),
  },
}

export default function RadarConvocatoriasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
