import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'IA para conectar',
  description:
    'Onboarding con IA: define tu rol y cómo quieres conectar en Synergy.',
  alternates: { canonical: absoluteUrl('/ia') },
  openGraph: {
    title: 'IA para conectar | Synergy',
    description:
      'Onboarding con IA: define tu rol y cómo quieres conectar en Synergy.',
    url: absoluteUrl('/ia'),
  },
}

export default function IALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
