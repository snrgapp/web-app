'use client'

import { useRef } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
// import TarjetasSection from '@/components/inicio/TarjetasSection'
import Partners from '@/components/Partners'
import ConectarSection from '@/components/inicio/ConectarSection'
import ComoFuncionaSection from '@/components/inicio/ComoFuncionaSection'
import QueSigueSection from '@/components/inicio/QueSigueSection'
import Footer from '@/components/Footer'
import { useCinematicScroll } from '@/hooks/useCinematicScroll'

export default function InicioPage() {
  const mainRef = useRef<HTMLElement>(null)
  useCinematicScroll(mainRef)

  return (
    <main ref={mainRef} className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a] overflow-x-hidden">
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
