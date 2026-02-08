'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { aliadosLogos } from '@/lib/inicio-data'

export default function AliadosSection() {
  // Duplicar logos para marquesina infinita sin saltos
  const duplicatedLogos = [...aliadosLogos, ...aliadosLogos]

  return (
    <section className="py-12 lg:py-20">
      <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] lowercase text-center mb-8 px-4 lg:px-20">
        algunos aliados
      </h2>

      <div className="bg-black overflow-hidden py-8">
        <motion.div
          className="flex gap-12 lg:gap-16 items-center min-w-max"
          animate={{ x: [0, '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear',
            },
          }}
        >
          {duplicatedLogos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="flex-shrink-0 flex items-center justify-center grayscale invert opacity-80 hover:opacity-100 transition-opacity"
              style={{ width: '140px', height: '60px' }}
            >
              <Image
                src={src}
                alt={`Aliado ${i + 1}`}
                width={140}
                height={60}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
