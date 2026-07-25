'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import './QuestionRevealDeck.css'

/**
 * Mazo de fondo: offsets grandes + rotaciones fijas (-18°…+18°)
 * Distribución radial alrededor del centro (abanico).
 */
const BACK_CARDS = [
  { rotate: -15, x: -110, y: -95, z: 1 }, // arriba-izquierda
  { rotate: -8, x: -15, y: -120, z: 2 }, // arriba
  { rotate: 12, x: 105, y: -90, z: 3 }, // arriba-derecha
  { rotate: 18, x: 125, y: 8, z: 4 }, // derecha
  { rotate: 6, x: 100, y: 105, z: 5 }, // abajo-derecha
  { rotate: -12, x: 10, y: 125, z: 6 }, // abajo
  { rotate: -18, x: -105, y: 100, z: 7 }, // abajo-izquierda
  { rotate: 8, x: -130, y: 5, z: 8 }, // izquierda
] as const

export type QuestionRevealDeckProps = {
  question: string
  categoryLabel?: string | null
  onContinue?: () => void
}

/**
 * Pantalla post-countdown: mazo de cartas + tarjeta blanca con la pregunta.
 */
export function QuestionRevealDeck({
  question,
  categoryLabel,
  onContinue,
}: QuestionRevealDeckProps) {
  return (
    <motion.div
      className="question-reveal"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="question-reveal__stage">
        {BACK_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="question-reveal__back-card"
            style={{ zIndex: card.z, left: '50%', top: '50%' }}
            initial={{
              opacity: 0,
              scale: 0.75,
              rotate: 0,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: card.rotate,
              x: `calc(-50% + ${card.x}px)`,
              y: `calc(-50% + ${card.y}px)`,
            }}
            transition={{
              duration: 0.55,
              delay: 0.06 + i * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/logowhite.png"
              alt=""
              width={96}
              height={96}
              className="question-reveal__back-logo"
              priority={i < 3}
            />
          </motion.div>
        ))}

        <motion.div
          className="question-reveal__main-card"
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="question-reveal__main-logo">
            <Image
              src="/logo.png"
              alt="Synergy"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>

          <p className="question-reveal__question">{question}</p>

          <p className="question-reveal__footer">
            {categoryLabel?.trim() || 'Synergy'}
          </p>
        </motion.div>
      </div>

      {onContinue && (
        <motion.button
          type="button"
          className="question-reveal__cta"
          onClick={onContinue}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
        >
          continuar
        </motion.button>
      )}
    </motion.div>
  )
}
