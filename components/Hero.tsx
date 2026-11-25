'use client'

import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowRight,
  Check,
  Heart,
  Lightbulb,
  MessageCircle,
  ThumbsUp,
  Users,
} from 'lucide-react'
import { heroImages } from '@/lib/inicio-data'
import { useI18n } from '@/components/i18n/LanguageProvider'

type Polar = { angle: number; radius: number }

const photos: Array<Polar & { src: string; size: string; hide?: string; floatDelay?: string }> = [
  { src: heroImages[0], angle: 200, radius: 44, size: 'h-9 w-9 sm:h-14 sm:w-14 lg:h-16 lg:w-16', floatDelay: '0s' },
  { src: heroImages[2], angle: 322, radius: 44, size: 'h-9 w-9 sm:h-[62px] sm:w-[62px]', floatDelay: '1.2s' },
  { src: heroImages[3], angle: 22, radius: 42, size: 'h-9 w-9 sm:h-14 sm:w-14', floatDelay: '1.8s' },
  { src: '/images/galeria/mt-1.jpeg', angle: 268, radius: 46, size: 'h-9 w-9 sm:h-12 sm:w-12', floatDelay: '1.1s' },
  { src: heroImages[1], angle: 228, radius: 42, size: 'h-11 w-11 sm:h-12 sm:w-12 lg:h-[58px] lg:w-[58px]', hide: 'hidden lg:block', floatDelay: '0.6s' },
  { src: heroImages[4], angle: 52, radius: 43, size: 'h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14', hide: 'hidden lg:block', floatDelay: '0.3s' },
  { src: heroImages[5], angle: 155, radius: 42, size: 'h-11 w-11 sm:h-[56px] sm:w-[56px]', hide: 'hidden lg:block', floatDelay: '2.1s' },
  { src: heroImages[6], angle: 85, radius: 44, size: 'h-10 w-10 sm:h-12 sm:w-12', hide: 'hidden lg:block', floatDelay: '2.7s' },
  { src: '/images/galeria/mt-3.jpeg', angle: 118, radius: 42, size: 'h-11 w-11 sm:h-12 sm:w-12', hide: 'hidden lg:block', floatDelay: '3.2s' },
]

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative px-4 pb-6 pt-20 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8">
      <div className="relative mx-auto w-full max-w-[1100px]">
        <div className="relative flex flex-col items-center lg:block lg:h-[700px]">
          <div
            className="pointer-events-none relative aspect-square w-[min(220px,70vw)] sm:w-[min(260px,55vw)] lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[760px] lg:-translate-x-1/2 lg:-translate-y-1/2"
            aria-hidden
          >
            <div className="absolute inset-[3%] rounded-full border border-[#1a1a1a]/[0.08]" />
            <div className="absolute inset-[14%] rounded-full border border-[#1a1a1a]/[0.09]" />
            <div className="absolute inset-[26%] rounded-full border border-[#1a1a1a]/10" />

            {photos.map((photo) => (
              <OrbitNode
                key={`${photo.src}-${photo.angle}`}
                polar={photo}
                className={photo.hide ?? ''}
                floatDelay={photo.floatDelay}
              >
                <div
                  className={`relative overflow-hidden rounded-full border-2 border-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${photo.size}`}
                >
                  <Image src={photo.src} alt="" fill className="object-cover" sizes="64px" />
                </div>
              </OrbitNode>
            ))}

            <OrbitNode polar={{ angle: 336, radius: 41 }} className="hidden lg:flex" floatDelay="0.8s">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-[#1a1a1a] shadow-sm ring-1 ring-black/10">
                <ThumbsUp className="h-3.5 w-3.5 text-[#E5B318]" />
                35
              </span>
            </OrbitNode>

            <OrbitNode polar={{ angle: 70, radius: 41 }} className="hidden lg:flex" floatDelay="1.5s">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10">
                <Lightbulb className="h-4 w-4 text-[#E5B318]" />
              </span>
            </OrbitNode>

            <OrbitNode polar={{ angle: 102, radius: 39 }} className="hidden lg:flex" floatDelay="2.4s">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-[#1a1a1a] shadow-sm ring-1 ring-black/10">
                <Heart className="h-3.5 w-3.5 fill-[#ef4444] text-[#ef4444]" />
                17
              </span>
            </OrbitNode>

            <OrbitNode polar={{ angle: 248, radius: 33 }} className="hidden lg:flex" duration={95} reverse floatDelay="0.4s">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[11px] font-medium text-[#15803d] shadow-sm ring-1 ring-[#bbf7d0]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e] text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {t.hero.matchConfirmed}
              </span>
            </OrbitNode>

            <OrbitNode polar={{ angle: 178, radius: 37 }} className="hidden lg:flex" duration={95} reverse floatDelay="1.3s">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-[#1a1a1a] shadow-sm ring-1 ring-black/10">
                <MessageCircle className="h-3.5 w-3.5 text-[#64748b]" />
                32
              </span>
            </OrbitNode>

            <OrbitNode polar={{ angle: 8, radius: 35 }} className="hidden lg:flex" duration={95} reverse floatDelay="2s">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-[#1a1a1a] shadow-sm ring-1 ring-black/10">
                <Users className="h-3.5 w-3.5 text-[#64748b]" />
                10
              </span>
            </OrbitNode>

            <OrbitNode polar={{ angle: 130, radius: 28 }} className="hidden lg:flex" duration={95} reverse floatDelay="2.8s">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-sm">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </OrbitNode>
          </div>

          <div className="relative z-10 mt-5 flex flex-col items-center px-1 text-center lg:absolute lg:inset-0 lg:mt-0 lg:h-full lg:justify-center lg:px-4">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="max-w-[12ch] text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[#1a1a1a] sm:text-4xl md:text-[2.75rem] lg:text-[3.15rem]"
            >
              {t.hero.title[0]}
              <br />
              {t.hero.title[1]}
              <br />
              {t.hero.title[2]}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-4 max-w-[32ch] text-[13px] leading-relaxed text-[#5b5b5b] sm:mt-5 sm:max-w-[38ch] sm:text-sm md:text-[15px]"
            >
              {t.hero.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-6 flex flex-col items-center gap-3 sm:mt-7"
            >
              <a
                href="https://www.snrg.lat/reunion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d2d2d] sm:w-auto sm:px-6"
              >
                {t.hero.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#three-steps-heading"
                className="text-sm font-medium text-[#5b5b5b] underline-offset-4 transition-colors hover:text-[#1a1a1a] hover:underline"
              >
                {t.hero.howItWorks}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OrbitNode({
  polar,
  className = '',
  duration = 70,
  reverse = false,
  floatDelay = '0s',
  children,
}: {
  polar: Polar
  className?: string
  duration?: number
  reverse?: boolean
  floatDelay?: string
  children: ReactNode
}) {
  const start = (((polar.angle - 90 + 360) % 360) / 360) * 100
  return (
    <div
      className={`hero-orbit-upright z-[1] ${className}`}
      style={
        {
          '--orbit-r': `${polar.radius}%`,
          '--orbit-start': `${start}%`,
          '--orbit-duration': `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        } as CSSProperties
      }
    >
      <div className="hero-float" style={{ animationDelay: floatDelay }}>
        {children}
      </div>
    </div>
  )
}
