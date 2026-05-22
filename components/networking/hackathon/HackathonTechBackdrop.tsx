'use client'

import { motion } from 'framer-motion'
import { Cpu, Terminal, Binary, Layers, Zap, Network, Boxes, Smartphone } from 'lucide-react'

const ICONS = [Cpu, Terminal, Binary, Layers, Zap, Network, Boxes, Smartphone]

/**
 * Decoración tras el mazo de preguntas: estilo tech / neón púrpura del hackathon.
 */
export function HackathonTechBackdrop() {
  const nodes = ICONS.map((Icon, i) => ({
    Icon,
    left: `${6 + ((i * 19) % 78)}%`,
    top: `${8 + ((i * 27) % 72)}%`,
    delay: i * 0.35,
    duration: 12 + (i % 6) * 2.5,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,rgba(123,53,255,0.14),transparent_68%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(123,53,255,0.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123,53,255,0.45) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
      {nodes.map(({ Icon, left, top, delay, duration }, i) => (
        <motion.div
          key={i}
          className="absolute text-[#7B35FF]/35"
          style={{ left, top, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.2, 0.42, 0.22],
            y: [0, -14, 10, 0],
            x: [0, 10, -8, 0],
            rotate: [0, 4, -3, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        >
          <Icon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  )
}
