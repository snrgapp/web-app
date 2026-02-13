'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function ComoFuncionaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })

  // Desktop: palabras se acercan desde fuera
  const xLeft = useTransform(scrollYProgress, [0, 1], [-120, 0])
  const xRight = useTransform(scrollYProgress, [0, 1], [120, 0])

  // Tarjetas se agrandan desde pequeñas
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.6, 1])
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  // Opacidad del texto
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])

  // Mobile: palabras se acercan verticalmente
  const yTop = useTransform(scrollYProgress, [0, 1], [-40, 0])
  const yBottom = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Versión desktop */}
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-center w-full">
            <motion.h2
              style={{ x: xLeft, opacity: textOpacity }}
              className="text-[5.5rem] xl:text-[7rem] 2xl:text-[8rem] font-black text-[#1a1a1a] lowercase tracking-tighter leading-none z-0"
            >
              cómo
            </motion.h2>

            <motion.div
              style={{ scale: cardScale, opacity: cardOpacity }}
              className="relative w-[360px] xl:w-[440px] 2xl:w-[500px] h-[340px] xl:h-[420px] 2xl:h-[470px] flex-shrink-0 -mx-10 xl:-mx-14 z-10"
            >
              <Image
                src="/images/tarjetas-como-funciona.png"
                alt="Tarjetas de cómo funciona Synergy"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            <motion.h2
              style={{ x: xRight, opacity: textOpacity }}
              className="text-[5.5rem] xl:text-[7rem] 2xl:text-[8rem] font-black text-[#1a1a1a] lowercase tracking-tighter leading-none z-0"
            >
              funciona
            </motion.h2>
          </div>
        </div>

        {/* Versión mobile/tablet */}
        <div className="flex flex-col items-center lg:hidden">
          <div className="relative flex flex-col items-center">
            <motion.h2
              style={{ y: yTop, opacity: textOpacity }}
              className="text-6xl sm:text-7xl md:text-8xl font-black text-[#1a1a1a] lowercase tracking-tighter leading-none text-center z-0"
            >
              cómo
            </motion.h2>

            <motion.div
              style={{ scale: cardScale, opacity: cardOpacity }}
              className="relative w-[300px] sm:w-[380px] md:w-[440px] h-[240px] sm:h-[300px] md:h-[350px] -my-4 z-10"
            >
              <Image
                src="/images/tarjetas-como-funciona.png"
                alt="Tarjetas de cómo funciona Synergy"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            <motion.h2
              style={{ y: yBottom, opacity: textOpacity }}
              className="text-6xl sm:text-7xl md:text-8xl font-black text-[#1a1a1a] lowercase tracking-tighter leading-none text-center z-0"
            >
              funciona
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  )
}
