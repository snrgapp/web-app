'use client'

import { useRef } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
// import TarjetasSection from '@/components/inicio/TarjetasSection'
import AIMatchingSection from '@/components/inicio/AIMatchingSection'
import ThreeStepsSection from '@/components/inicio/ThreeStepsSection'
import WhyAttendSection from '@/components/inicio/WhyAttendSection'
import ReviewsCarousel from '@/components/inicio/ReviewsCarousel'
import PhotoGallery from '@/components/inicio/PhotoGallery'
import Footer from '@/components/Footer'
import FaqSection from '@/components/inicio/FaqSection'
import { useCinematicScroll } from '@/hooks/useCinematicScroll'

export default function InicioPage() {
  const mainRef = useRef<HTMLElement>(null)
  useCinematicScroll(mainRef)

  return (
    <main
      ref={mainRef}
      className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]"
    >
      <Navbar />
      <Hero />
      <PhotoGallery />
      <AIMatchingSection />
      <ThreeStepsSection />
      <WhyAttendSection />
      <ReviewsCarousel />
      <FaqSection />
      {/* <TarjetasSection /> */}
      <Footer />
    </main>
  )
}
