'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { partnerLogos } from '@/lib/partners-data'

export default function Partners() {
  const duplicatedLogos = [...partnerLogos, ...partnerLogos]

  return (
    <section className="-mt-6 lg:-mt-10 pb-8 lg:pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="py-2"
      >
        {/* Carrusel a ancho de viewport: las tarjetas cruzan de un extremo al otro */}
        <div className="relative w-screen max-w-[100vw] -translate-x-1/2 left-1/2 overflow-hidden">
          <motion.div
            className="flex min-w-max items-center gap-3 px-4 sm:px-6 lg:gap-3.5"
            animate={{ x: [0, '-50%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 75,
                ease: 'linear',
              },
            }}
          >
            {duplicatedLogos.map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className={cn(
                  'group flex h-11 w-[152px] shrink-0 items-center justify-center rounded-2xl px-2.5 py-1.5 sm:h-12 sm:w-[180px] sm:px-3',
                  'border border-white/55 bg-gradient-to-b from-white/60 to-white/[0.22]',
                  'shadow-[0_2px_16px_rgba(26,26,26,0.06),inset_0_1px_0_0_rgba(255,255,255,0.72)]',
                  'backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow]',
                  'lg:h-[52px] lg:w-[200px] lg:px-3.5',
                  'hover:border-[#E5B318]/45 hover:shadow-[0_4px_20px_rgba(229,179,24,0.12),inset_0_1px_0_0_rgba(255,255,255,0.8)]'
                )}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={224}
                  height={80}
                  className="max-h-[30px] w-auto max-w-[90%] object-contain object-center grayscale brightness-[0.5] opacity-90 transition-[filter,opacity] group-hover:opacity-100 group-hover:grayscale-[0.25] sm:max-h-[34px] lg:max-h-[38px]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
