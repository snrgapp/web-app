'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, Instagram, Linkedin } from 'lucide-react'
import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { heroImages } from '@/lib/inicio-data'

gsap.registerPlugin(ScrollTrigger)

const CAROUSEL_DURATION = 25

export default function Hero() {
  const [foundersCount, setFoundersCount] = useState(0)

  const heroSectionRef = useRef<HTMLElement>(null)
  const titlePart1Ref = useRef<HTMLSpanElement>(null)
  const titlePart2Ref = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        if (!titlePart1Ref.current || !titlePart2Ref.current || !subtitleRef.current) return

        gsap.set(titlePart1Ref.current, { filter: 'blur(8px)', opacity: 0.5 })
        gsap.set(titlePart2Ref.current, { filter: 'blur(8px)', opacity: 0.5 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })

        tl.to(titlePart1Ref.current, {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        })
          .to({}, { duration: 0.5 })
          .to(titlePart2Ref.current, {
            filter: 'blur(0px)',
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          }, '-=0.1')
          .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          }, '-=0.3')

        gsap.set(subtitleRef.current, { opacity: 0, y: 36 })

        if (heroSectionRef.current) {
          const obj = { val: 0 }
          gsap.to(obj, {
            val: 630,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              setFoundersCount(Math.round(obj.val))
            },
          })
        }

      }, heroSectionRef)

      return () => ctx.revert()
    },
    { dependencies: [setFoundersCount] }
  )

  const col1Images = heroImages.filter((_, i) => i % 2 === 0)
  const col2Images = heroImages.filter((_, i) => i % 2 === 1)

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna izquierda: texto y prueba social */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-[1.1]"
              >
                <span ref={titlePart1Ref} className="inline-block">no es magia,</span>
                {' '}
                <span ref={titlePart2Ref} className="inline-block">es networking.</span>
              </h1>
              <p
                ref={subtitleRef}
                className="text-base text-gray-500 tracking-widest max-w-md lowercase"
              >
                conexiones que generan resultados
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex max-w-md flex-wrap items-center gap-x-6 gap-y-4"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-[#1a1a1a] sm:text-sm">
                <span className="font-medium">4,9</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3 w-3 text-[#E5B318] fill-[#E5B318] sm:h-4 sm:w-4" />
                  ))}
                  <div className="h-3 w-1.5 overflow-hidden sm:h-4 sm:w-2">
                    <Star className="h-3 w-3 text-[#E5B318] fill-[#E5B318] sm:h-4 sm:w-4" />
                  </div>
                </div>
                <span className="font-light text-gray-600">
                  en + <span>{foundersCount}</span> founders
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/_____synergy?igsh=MjhocGI0eWp3dDJr&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a1a1a]/60 transition-colors hover:text-[#1a1a1a]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 sm:h-4 sm:w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/synergy-founders-makers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a1a1a]/60 transition-colors hover:text-[#1a1a1a]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 sm:h-4 sm:w-4" />
                </a>
              </div>
            </motion.div>

          </div>

          {/* Columna derecha: dos carruseles verticales */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            {/* Carrusel descendente (columna izq) */}
            <div
              className="relative h-[380px] sm:h-[520px] w-[150px] sm:w-[200px] flex-shrink-0 overflow-hidden rounded-xl"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                maskSize: '100% 100%',
              }}
            >
              <div
                className="flex flex-col gap-4 animate-carousel-down"
                style={{
                  animationDuration: `${CAROUSEL_DURATION}s`,
                }}
              >
                {[...col1Images, ...col1Images].map((src, i) => (
                  <div
                    key={`col1-${src}-${i}`}
                    className="relative w-[150px] sm:w-[200px] h-[180px] sm:h-[240px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={src}
                      alt={`Networking ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 150px, 200px"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Carrusel ascendente (columna der) */}
            <div
              className="relative h-[380px] sm:h-[520px] w-[150px] sm:w-[200px] flex-shrink-0 overflow-hidden rounded-xl"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                maskSize: '100% 100%',
              }}
            >
              <div
                className="flex flex-col gap-4 animate-carousel-up"
                style={{
                  animationDuration: `${CAROUSEL_DURATION}s`,
                }}
              >
                {[...col2Images, ...col2Images].map((src, i) => (
                  <div
                    key={`col2-${src}-${i}`}
                    className="relative w-[150px] sm:w-[200px] h-[180px] sm:h-[240px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={src}
                      alt={`Networking ${i + 3}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 150px, 200px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
