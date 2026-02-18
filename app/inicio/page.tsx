'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
// import TarjetasSection from '@/components/inicio/TarjetasSection'
import Partners from '@/components/Partners'
import ConectarSection from '@/components/inicio/ConectarSection'
import ComoFuncionaSection from '@/components/inicio/ComoFuncionaSection'
import QueSigueSection from '@/components/inicio/QueSigueSection'
import Footer from '@/components/Footer'

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <Hero />
      <Partners />
      <ConectarSection />
      <ComoFuncionaSection />
      <QueSigueSection />
      {/* <TarjetasSection /> */}
      <Footer />
    </main>
  )
}
