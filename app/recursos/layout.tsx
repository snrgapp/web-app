import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Recursos',
  description:
    'The Complete Shelf: biblioteca editorial 3D para explorar recursos de Synergy.',
}

export default function RecursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F3EEE4] font-[family-name:var(--font-playfair-display)]">
      <Navbar />
      {children}
    </div>
  )
}
