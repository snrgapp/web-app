'use client'

import { useRef } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
// import TarjetasSection from '@/components/inicio/TarjetasSection'
import Partners from '@/components/Partners'
import ConectarSection from '@/components/inicio/ConectarSection'
import ComoFuncionaSection from '@/components/inicio/ComoFuncionaSection'
import QueSigueSection from '@/components/inicio/QueSigueSection'
import ReviewsCarousel from '@/components/inicio/ReviewsCarousel'
import PhotoGallery from '@/components/inicio/PhotoGallery'
import CommunityMapSection from '@/components/inicio/CommunityMapSection'
import Footer from '@/components/Footer'
import { useCinematicScroll } from '@/hooks/useCinematicScroll'

export default function InicioPage() {
  const mainRef = useRef<HTMLElement>(null)
  useCinematicScroll(mainRef)

  return (
    <main
      ref={mainRef}
      className="min-h-screen synergy-page-dots text-[#1a1a1a] overflow-x-hidden"
    >
      <Navbar />
      <Hero />
      <Partners />
      <ConectarSection />
      <ComoFuncionaSection />
      <QueSigueSection />
      <ReviewsCarousel />
      <PhotoGallery />
      <CommunityMapSection />
      {/* <TarjetasSection /> */}
      <Footer />
    </main>
  )
}
