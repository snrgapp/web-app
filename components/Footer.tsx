'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [
  {
    href: 'https://www.instagram.com/_____synergy?igsh=MjhocGI0eWp3dDJr&utm_source=qr',
    icon: '/images/icon-instagram.png',
    alt: 'Instagram',
  },
  {
    href: 'https://www.linkedin.com/company/synergy-founders-makers/',
    icon: '/images/icon-linkedin.png',
    alt: 'LinkedIn',
  },
]

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 pb-8 pt-4">
      {/* Tarjeta negra principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-[#0a0a0a] rounded-[2rem] px-6 py-16 sm:py-20 flex flex-col items-center text-center"
      >
        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Síguenos
        </h3>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed">
          Mantente al día con los últimos eventos, talleres y estrategias para llevar adelante tu empresa.
        </p>

        {/* Iconos de redes */}
        <div className="flex items-center gap-6 mt-10">
          {socialLinks.map((social) => (
            <motion.a
              key={social.alt}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden transition-shadow hover:shadow-lg hover:shadow-white/20"
            >
              <Image
                src={social.icon}
                alt={social.alt}
                width={28}
                height={28}
                className="object-contain"
              />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Texto de derechos */}
      <p className="text-center text-xs sm:text-sm text-zinc-500 mt-8">
        Derechos reservados <strong className="text-[#1a1a1a]">Synergy Founders & Makers community 2026</strong>
      </p>
    </footer>
  )
}
