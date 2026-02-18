'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Sparkles, Users, Bell } from 'lucide-react'

const imagenItems = [
  { src: '/images/foto1.png', rotacion: '-rotate-6', zigzag: 'start' },
  { src: '/images/foto2.png', rotacion: 'rotate-6', zigzag: 'end' },
  { src: '/images/foto3.png', rotacion: '-rotate-6', zigzag: 'start' },
]

const points = [
  {
    icon: Mail,
    text: 'Recibirás correos con detalles\nconfirmando fecha y lugar.',
    bold: ['correos'],
  },
  {
    icon: Sparkles,
    text: 'Por medio de IA te conectamos\ncon perfiles que requieren lo que\nofreces.',
    bold: ['IA', 'ofreces'],
  },
  {
    icon: Users,
    text: 'Serás parte de una comunidad\nde founders que les importa tu\ncrecimiento.',
    bold: ['comunidad', 'crecimiento'],
  },
  {
    icon: Bell,
    text: 'Te mantendremos al tanto de los\neventos de comunidad y\nespacios que te fortalezcan a ti\ny a tu empresa.',
    bold: ['eventos de comunidad', 'fortalezcan'],
  },
]

function renderTextWithBold(text: string, boldWords: string[]) {
  let result = text
  for (const word of boldWords) {
    result = result.replace(
      new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'),
      '<strong class="font-semibold text-[#1a1a1a]">$1</strong>'
    )
  }
  return result.replace(/\n/g, '<br />')
}

export default function QueSigueSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#f2f2f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pl-8 sm:pl-12 lg:pl-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Columna 1: título centrado + bullet points con descripciones a la izquierda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-[0.85] lg:leading-[0.9] mb-3 text-center">
              ¿Qué sigue luego que te inscribes?
            </h2>

            {/* Timeline: iconos + tramos de línea entre ellos (sin tocar los iconos) */}
            <div className="flex flex-col pl-12 sm:pl-16 lg:pl-20">
              {points.map(({ icon: Icon, text, bold }, i) => (
                <div key={i}>
                  {/* Tramo: gap + línea + gap (conecta un icono con el siguiente sin tocarlos) */}
                  {i > 0 && (
                    <div className="flex gap-0">
                      <div className="flex flex-col items-center flex-shrink-0 w-6">
                        <div className="h-1 shrink-0" aria-hidden />
                        <div className="w-px min-h-[1.75rem] flex-1 bg-[#1a1a1a]/25" />
                        <div className="h-1 shrink-0" aria-hidden />
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-5 items-start"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1a1a]/5 flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#1a1a1a]" strokeWidth={2} />
                    </div>
                    <p
                      className="text-xs sm:text-sm text-[#1a1a1a]/85 leading-snug text-left flex-1 pt-0.5"
                      dangerouslySetInnerHTML={{
                        __html: renderTextWithBold(text, bold),
                      }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Columna 2: imágenes zig-zag, una debajo de otra, interpuestas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-auto flex flex-col items-center lg:items-start mt-12 lg:mt-0"
          >
            <div className="w-[200px] sm:w-[220px] flex flex-col gap-0 items-center lg:items-stretch">
              {imagenItems.map(({ src, rotacion, zigzag }, i) => (
                <div
                  key={i}
                  className={`flex ${zigzag === 'start' ? 'justify-start' : 'justify-end'}`}
                  style={i > 0 ? { marginTop: '-0.4rem' } : undefined}
                >
                  <div className={`relative w-[170px] sm:w-[190px] ${rotacion}`}>
                    <div
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1a1a1a]/5"
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 170px, 190px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
