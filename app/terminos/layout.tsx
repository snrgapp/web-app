import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Términos de uso del sitio y servicios Synergy.',
  alternates: { canonical: absoluteUrl('/terminos') },
  robots: { index: true, follow: true },
}

export default function TerminosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
