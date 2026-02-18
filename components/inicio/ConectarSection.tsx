'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ConectarSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Lado izquierdo: composición visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-[420px] lg:max-w-[460px] flex-shrink-0"
          >
            {/* Foto principal */}
            <div className="relative w-[280px] sm:w-[320px] lg:w-[360px] aspect-[3/4] rounded-3xl overflow-hidden mx-auto">
              <Image
                src="/images/inicio-foto.png"
                alt="Founders conectando en evento"
                fill
                className="object-cover scale-110"
              />
            </div>

            {/* Burbuja amarilla - arriba izquierda */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -top-2 -left-2 sm:top-0 sm:-left-4 lg:-left-6 w-[160px] sm:w-[180px] lg:w-[200px] z-10"
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/images/burbuja-marca.png"
                  alt="Quisiera que me ayudaras con mi marca"
                  width={200}
                  height={80}
                  className="w-full h-auto drop-shadow-lg"
                />
              </motion.div>
            </motion.div>

            {/* Tarjeta alianza - centro derecha */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-[40%] -right-4 sm:-right-6 lg:-right-10 w-[150px] sm:w-[170px] lg:w-[190px] z-10"
            >
              <motion.div
                animate={{ y: [0, 5, 0], rotate: [0, -1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Image
                  src="/images/burbuja-alianza.png"
                  alt="¿Qué tipo de alianza buscas hoy?"
                  width={190}
                  height={140}
                  className="w-full h-auto drop-shadow-lg"
                />
              </motion.div>
            </motion.div>

            {/* Pill contactos - abajo izquierda, sobre la foto */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute bottom-8 sm:bottom-10 left-0 sm:-left-2 lg:-left-4 w-[140px] sm:w-[160px] lg:w-[170px] z-10"
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <Image
                  src="/images/burbuja-contactos.png"
                  alt="10 nuevos contactos"
                  width={170}
                  height={60}
                  className="w-full h-auto drop-shadow-lg"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Lado derecho: texto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 text-center lg:text-left"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-[0.85] lg:leading-[0.9]">
              todo lo que necesitas para conectar y escalar.
            </h2>
            <p className="mt-8 text-base sm:text-lg text-zinc-500 leading-relaxed max-w-lg mx-auto lg:mx-0 lowercase tracking-wide">
              synergy simplifica tu camino como founder para que te enfoques en
              lo que realmente importa: <strong className="text-[#1a1a1a]">tu visión</strong>.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
