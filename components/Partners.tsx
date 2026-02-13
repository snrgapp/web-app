'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
        className="mx-4 sm:mx-6 lg:mx-8 py-2 overflow-hidden"
      >
        <motion.div
          className="flex gap-2 lg:gap-2.5 items-center min-w-max px-6"
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
              className="relative h-14 w-40 sm:h-16 sm:w-48 lg:h-20 lg:w-56 flex-shrink-0 flex items-center justify-center grayscale brightness-[0.5] opacity-90 hover:opacity-100 transition-opacity"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={224}
                height={80}
                className="h-full w-auto object-contain object-center"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
