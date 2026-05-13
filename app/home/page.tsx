'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const GENIUS_LOGO_SRC = '/images/genius-fest-logo.png'

const dinamicas = [
  {
    label: 'Networking',
    image: '/images/card-networking.png',
    href: '/networking',
    enabled: true,
  },
  {
    label: 'Genius FEST',
    image: GENIUS_LOGO_SRC,
    href: '/networking/genius',
    enabled: true,
  },
  {
    label: 'Pitch',
    image: '/images/card-pitch.png',
    href: '/pitch',
    enabled: true,
  },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-5 py-10 sm:py-14 font-sans">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 sm:mb-14"
      >
        <Image
          src="/logo.png"
          alt="Synergy"
          width={44}
          height={44}
          className="object-contain"
        />
      </motion.div>

      {/* Título de sección */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-8 sm:mb-10"
      >
        Dinámicas
      </motion.h1>

      {/* Grid de tarjetas */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 sm:gap-5">
        {dinamicas.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            onClick={() => item.enabled && router.push(item.href)}
            disabled={!item.enabled}
            className={`flex flex-col items-center gap-3 sm:gap-4 ${
              !item.enabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {/* Contenedor: Genius = solo logo sobre fondo blanco (sin “tarjeta” gris); el resto mantiene miniatura */}
            <motion.div
              whileHover={item.enabled ? { scale: 1.04 } : undefined}
              whileTap={item.enabled ? { scale: 0.97 } : undefined}
              className={
                item.image === GENIUS_LOGO_SRC
                  ? 'flex w-full min-h-[200px] items-center justify-center rounded-2xl bg-transparent py-3 sm:min-h-[210px] sm:py-4'
                  : 'flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-[#e0e0e0] sm:rounded-3xl'
              }
            >
              <Image
                src={item.image}
                alt={item.label}
                width={1080}
                height={1080}
                className={
                  item.image === GENIUS_LOGO_SRC
                    ? 'h-auto max-h-[min(300px,66vw)] w-auto max-w-full bg-transparent object-contain sm:max-h-[min(280px,58vw)]'
                    : 'h-full w-full object-cover'
                }
              />
            </motion.div>

            {/* Label */}
            <span className="text-base sm:text-lg font-semibold text-black tracking-tight">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
