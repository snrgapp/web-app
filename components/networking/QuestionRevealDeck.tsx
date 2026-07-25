'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import './QuestionRevealDeck.css'

/** Ángulos y offsets fijos (pseudo-aleatorios) para el mazo de fondo */
const BACK_CARDS = [
  { rotate: -12, x: -72, y: -28, z: 1 },
  { rotate: 10, x: 78, y: -18, z: 2 },
  { rotate: -7, x: -48, y: 36, z: 3 },
  { rotate: 14, x: 58, y: 42, z: 4 },
  { rotate: -15, x: -18, y: -52, z: 5 },
  { rotate: 8, x: 24, y: 58, z: 6 },
  { rotate: -4, x: -88, y: 8, z: 7 },
  { rotate: 6, x: 92, y: 12, z: 8 },
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
        {/* Cartas de fondo (boca abajo) */}
        {BACK_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="question-reveal__back-card"
            style={{ zIndex: card.z }}
            initial={{ opacity: 0, scale: 0.7, rotate: 0, x: 0, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: card.rotate,
              x: card.x,
              y: card.y,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08 + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/logowhite.png"
              alt=""
              width={72}
              height={72}
              className="question-reveal__back-logo"
              priority={i < 2}
            />
          </motion.div>
        ))}

        {/* Tarjeta principal */}
        <motion.div
          className="question-reveal__main-card"
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          continuar
        </motion.button>
      )}
    </motion.div>
  )
}
