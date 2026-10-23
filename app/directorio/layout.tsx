import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import './directorio.css'

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--dir-body',
})

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--dir-display',
})

export const metadata: Metadata = {
  title: 'Directorio de asistentes',
  robots: { index: false, follow: false },
}

export default function DirectorioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${body.variable} ${display.variable} dir-page`}>{children}</div>
  )
}
