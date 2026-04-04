import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de cookies',
  description: 'Uso de cookies en el sitio Synergy.',
  alternates: { canonical: absoluteUrl('/politica-cookies') },
  robots: { index: true, follow: true },
}

export default function PoliticaCookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
