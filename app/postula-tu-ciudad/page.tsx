'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PostulaTuCiudadPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-6">Postula a tu ciudad</h1>
        <p className="text-zinc-600 mb-8">
          Esta página está en construcción. Próximamente podrás postular tu ciudad para llevar Synergy a más lugares.
        </p>
        <Link href="/inicio" className="text-sm text-zinc-500 hover:text-black underline">
          ← Volver al inicio
        </Link>
      </div>
      <Footer />
    </main>
  )
}
