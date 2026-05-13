'use client'

import { motion } from 'framer-motion'
import {
  Lightbulb,
  Palette,
  Sparkles,
  PenLine,
  Wand2,
  Brain,
  Rocket,
  Stars,
  Music2,
  ImageIcon,
} from 'lucide-react'

const ICONS = [Lightbulb, Palette, Sparkles, PenLine, Wand2, Brain, Rocket, Stars, Music2, ImageIcon]

const NODES = ICONS.map((Icon, i) => ({
  Icon,
  left: `${8 + ((i * 17) % 84)}%`,
  top: `${5 + ((i * 23) % 78)}%`,
  delay: i * 0.4,
  duration: 14 + (i % 5) * 2.5,
}))

/**
 * Capa decorativa detrás del mazo de preguntas: iconos suaves que se mueven lentos.
 */
export function GeniusCreativityBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(105,74,255,0.12),transparent_65%)]" />
      {NODES.map(({ Icon, left, top, delay, duration }, i) => (
        <motion.div
          key={i}
          className="absolute text-[#694aff]/25"
          style={{ left, top, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0.35 }}
          animate={{
            opacity: [0.2, 0.45, 0.2],
            y: [0, -18, 8, 0],
            x: [0, 12, -10, 0],
            rotate: [0, 6, -4, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        >
          <Icon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.25} />
        </motion.div>
      ))}
    </div>
  )
}
