import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo Synergy trata tus datos personales.',
  alternates: { canonical: absoluteUrl('/politica-privacidad') },
  robots: { index: true, follow: true },
}

export default function PoliticaPrivacidadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
