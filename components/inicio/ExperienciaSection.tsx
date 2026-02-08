'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  experienciaImage,
  experienciaLeftItems,
  experienciaRightBlock1,
  experienciaRightBlock2,
} from '@/lib/inicio-data'

const IMAGE_SHADOW = '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 12px 24px -8px rgba(0, 0, 0, 0.08)'

export default function ExperienciaSection() {
  return (
    <section className="px-6 sm:px-8 lg:px-24 xl:px-32 py-20 lg:py-28 bg-[#f3f3f3]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Desktop: Layout de 3 columnas editorial */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-12 xl:gap-16 lg:items-center">
          {/* Columna izquierda - texto alineado a la derecha */}
          <div className="flex flex-col gap-3 text-right">
            <h2 className="text-2xl xl:text-3xl font-bold text-[#1a1a1a] lowercase tracking-tight">
              ¿cómo es la experiencia?
            </h2>
            <div className="flex flex-col gap-1">
              {experienciaLeftItems.map((item, i) => (
                <motion.p
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="text-[#1a1a1a] text-base xl:text-lg font-light tracking-[0.02em]"
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Columna central - imagen como eje visual */}
          <div className="flex justify-center items-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative w-[280px] xl:w-[320px] aspect-[3/4] rounded-[2rem] overflow-hidden flex-shrink-0"
              style={{ boxShadow: IMAGE_SHADOW }}
            >
              <Image
                src={experienciaImage}
                alt="Experiencia de networking"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 320px, 280px"
              />
            </motion.div>
          </div>

          {/* Columna derecha - texto alineado a la izquierda */}
          <div className="flex flex-col gap-2 text-left">
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[#1a1a1a] text-base xl:text-lg font-light tracking-[0.02em] max-w-[240px]"
            >
              {experienciaRightBlock1}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="text-[#1a1a1a] text-base xl:text-lg font-light tracking-[0.02em] max-w-[260px]"
            >
              {experienciaRightBlock2.prefix}
              <span className="font-bold text-2xl xl:text-3xl tracking-tight">
                {experienciaRightBlock2.number}
              </span>
              {experienciaRightBlock2.suffix}
            </motion.p>
          </div>
        </div>

        {/* Mobile: título, frases "no" arriba, imagen, textos derecha abajo */}
        <div className="flex flex-col gap-6 lg:hidden">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-[#1a1a1a] lowercase tracking-tight text-center"
          >
            ¿cómo es la experiencia?
          </motion.h2>

          {/* Frases "no" arriba de la imagen */}
          <div className="flex flex-col gap-1 text-center">
            {experienciaLeftItems.map((item, i) => (
              <motion.p
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                className="text-[#1a1a1a] text-base font-light tracking-[0.02em]"
              >
                {item}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full max-w-[280px] aspect-[3/4] mx-auto rounded-[2rem] overflow-hidden"
            style={{ boxShadow: IMAGE_SHADOW }}
          >
            <Image
              src={experienciaImage}
              alt="Experiencia de networking"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 280px"
            />
          </motion.div>

          {/* Textos derecha abajo de la imagen */}
          <div className="flex flex-col gap-2 text-center">
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="text-[#1a1a1a] text-base font-light tracking-[0.02em]"
              >
                {experienciaRightBlock1}
            </motion.p>
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: 0.42 }}
                className="text-[#1a1a1a] text-base font-light tracking-[0.02em]"
              >
                {experienciaRightBlock2.prefix}
                <span className="font-bold text-2xl tracking-tight">
                  {experienciaRightBlock2.number}
                </span>
                {experienciaRightBlock2.suffix}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
