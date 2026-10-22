import type { Metadata } from 'next'
import './directorio.css'

export const dynamic = 'force-dynamic'

const titulo = 'Quiénes estuvieron'
const descripcion = 'Directorio temporal para quienes asistieron al encuentro del 20 de octubre.'

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: titulo,
    description: descripcion,
    locale: 'es_CO',
    images: [{ url: '/brand/logo-synergy.svg', alt: 'Synergy' }],
  },
  twitter: {
    card: 'summary',
    title: titulo,
    description: descripcion,
    images: [{ url: '/brand/logo-synergy.svg', alt: 'Synergy' }],
  },
}

export default function DirectorioLayout({ children }: { children: React.ReactNode }) {
  return <div className="directorio">{children}</div>
}
