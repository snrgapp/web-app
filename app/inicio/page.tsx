'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a] pb-12">
      <Navbar />
      <Hero />
      <Partners />
    </main>
  )
}
