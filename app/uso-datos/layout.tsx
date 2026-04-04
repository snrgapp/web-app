import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Uso de datos y comunidades',
  description:
    'Información sobre datos y participación en comunidades Synergy.',
  alternates: { canonical: absoluteUrl('/uso-datos') },
  robots: { index: true, follow: true },
}

export default function UsoDatosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
