'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { heroImages, heroCardRotations } from '@/lib/inicio-data'

export default function HeroSection() {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 sm:px-8 lg:px-24 xl:px-32 py-20 lg:py-28 bg-[#f3f3f3]">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
        {/* Logo Synergy - centrado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 mb-12 lg:mb-16"
        >
          <Image
            src="/logo.png"
            alt="Synergy"
            width={48}
            height={48}
            className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
          />
        </motion.div>

        {/* Bloque de texto - centrado, ancho limitado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center w-full max-w-2xl lg:max-w-3xl"
        >
          {/* Título */}
          <h1 className="font-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1a1a1a] lowercase leading-[1.25]">
            no es magia, es networking.
          </h1>

          {/* Subtítulo - más estrecho, espacio vertical mayor */}
          <p className="font-hero-subtitle text-lg sm:text-xl lg:text-2xl text-[#1a1a1a] lowercase tracking-tight max-w-md lg:max-w-lg leading-relaxed mt-8 lg:mt-10">
            creamos experiencias de conexión entre founders.
          </p>
        </motion.div>

        {/* Tarjetas flotantes */}
        <FloatingImageCards images={heroImages} />
      </div>
    </section>
  )
}

interface FloatingImageCardsProps {
  images: readonly string[]
}

function FloatingImageCards({ images }: FloatingImageCardsProps) {
  return (
    <div className="w-full pt-12 lg:pt-16 mt-4">
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-10">
        {images.map((src, i) => (
          <FloatingCard key={src} src={src} index={i} />
        ))}
      </div>
    </div>
  )
}

interface FloatingCardProps {
  src: string
  index: number
}

const CARD_SHADOW = '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 12px 24px -8px rgba(0, 0, 0, 0.08)'
const CARD_SHADOW_HOVER = '0 35px 70px -15px rgba(0, 0, 0, 0.2), 0 20px 40px -12px rgba(0, 0, 0, 0.12)'

function FloatingCard({ src, index }: FloatingCardProps) {
  const rotation = heroCardRotations[index % heroCardRotations.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotation,
        boxShadow: CARD_SHADOW,
      }}
      whileHover={{
        rotate: 0,
        scale: 1.05,
        y: -4,
        boxShadow: CARD_SHADOW_HOVER,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        rotate: { type: 'spring', stiffness: 100, damping: 15 },
      }}
      className="relative aspect-[3/4] w-28 sm:w-36 lg:w-44 xl:w-48 rounded-[2rem] overflow-hidden shrink-0"
    >
      <Image
        src={src}
        alt={`Evento networking ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 144px, (max-width: 1024px) 144px, 192px"
      />
    </motion.div>
  )
}
