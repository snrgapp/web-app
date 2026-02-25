'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function UsoDatosPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-6">Uso de datos y comunidades</h1>
        <p className="text-zinc-600 mb-8">
          Esta página está en construcción. La información sobre uso de datos y comunidades será publicada próximamente.
        </p>
        <Link href="/inicio" className="text-sm text-zinc-500 hover:text-black underline">
          ← Volver al inicio
        </Link>
      </div>
      <Footer />
    </main>
  )
}
