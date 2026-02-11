'use client'

import Navbar from '@/components/Navbar'
import ContactSection from '@/components/inicio/ContactSection'

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a] pb-12 pt-24">
      <Navbar />
      <ContactSection />
    </main>
  )
}
