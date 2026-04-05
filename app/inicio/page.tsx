'use client'

import { useRef } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
// import TarjetasSection from '@/components/inicio/TarjetasSection'
import Partners from '@/components/Partners'
import AIMatchingSection from '@/components/inicio/AIMatchingSection'
import ThreeStepsSection from '@/components/inicio/ThreeStepsSection'
import ReviewsCarousel from '@/components/inicio/ReviewsCarousel'
import PhotoGallery from '@/components/inicio/PhotoGallery'
import JoinFormSection from '@/components/inicio/JoinFormSection'
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
      <AIMatchingSection />
      <ThreeStepsSection />
      <CommunityMapSection />
      <PhotoGallery />
      <JoinFormSection />
      <ReviewsCarousel />
      {/* <TarjetasSection /> */}
      <Footer />
    </main>
  )
}
