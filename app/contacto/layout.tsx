import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escríbenos para alianzas, dudas o soporte. Synergy — founders y makers.',
  alternates: { canonical: absoluteUrl('/contacto') },
  openGraph: {
    title: 'Contacto | Synergy',
    description:
      'Escríbenos para alianzas, dudas o soporte. Synergy — founders y makers.',
    url: absoluteUrl('/contacto'),
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
