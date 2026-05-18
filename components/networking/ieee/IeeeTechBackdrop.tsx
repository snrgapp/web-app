'use client'

import { motion } from 'framer-motion'
import { Cpu, Wifi, Shield, Code, Bot, Network, CircuitBoard, Radar } from 'lucide-react'

const ICONS = [Cpu, Wifi, Shield, Code, Bot, Network, CircuitBoard, Radar]

const NODES = ICONS.map((Icon, i) => ({
  Icon,
  left: `${10 + ((i * 19) % 82)}%`,
  top: `${8 + ((i * 21) % 75)}%`,
  delay: i * 0.35,
  duration: 13 + (i % 5) * 2.2,
}))

export function IeeeTechBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,98,155,0.14),transparent_65%)]" />
      {NODES.map(({ Icon, left, top, delay, duration }, i) => (
        <motion.div
          key={i}
          className="absolute text-[#00629B]/28"
          style={{ left, top, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0.35 }}
          animate={{
            opacity: [0.2, 0.45, 0.2],
            y: [0, -16, 6, 0],
            x: [0, 10, -8, 0],
            rotate: [0, 5, -3, 0],
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
