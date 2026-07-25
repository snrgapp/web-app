'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Timer from '@/components/Timer'
import TimeUpNotification from '@/components/TimeUpNotification'
import { useState } from 'react'
import './QuestionRevealDeck.css'

/**
 * Mazo de fondo: offsets grandes + rotaciones fijas (-18°…+18°)
 * Distribución radial alrededor del centro (abanico).
 */
const BACK_CARDS = [
  { rotate: -15, x: -110, y: -95, z: 1 },
  { rotate: -8, x: -15, y: -120, z: 2 },
  { rotate: 12, x: 105, y: -90, z: 3 },
  { rotate: 18, x: 125, y: 8, z: 4 },
  { rotate: 6, x: 100, y: 105, z: 5 },
  { rotate: -12, x: 10, y: 125, z: 6 },
  { rotate: -18, x: -105, y: 100, z: 7 },
  { rotate: 8, x: -130, y: 5, z: 8 },
] as const

export type QuestionRevealDeckProps = {
  question: string
  categoryLabel?: string | null
  onGirar: () => void
  onFinalizar: () => void
}

/**
 * Pantalla de pregunta: mazo 3D + tarjeta blanca + timer / girar / finalizar.
 */
export function QuestionRevealDeck({
  question,
  categoryLabel,
  onGirar,
  onFinalizar,
}: QuestionRevealDeckProps) {
  const [showTimeUp, setShowTimeUp] = useState(false)

  return (
    <div className="question-reveal">
      {/* Header: finalizar */}
      <div className="question-reveal__header">
        <button
          type="button"
          className="question-reveal__finalizar"
          onClick={onFinalizar}
        >
          finalizar
        </button>
      </div>

      {/* Stage: mazo + tarjeta (tarjeta principal subida, fondo intacto) */}
      <div className="question-reveal__stage">
        {BACK_CARDS.map((card, i) => (
          <div
            key={i}
            className="question-reveal__back-card"
            style={{
              zIndex: card.z,
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${card.x}px), calc(-50% + ${card.y}px)) rotate(${card.rotate}deg)`,
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
          </div>
        ))}

        <div className="question-reveal__main-card">
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
        </div>
      </div>

      {/* Controles: tienes 3 min + iniciar + girar */}
      <div className="question-reveal__controls">
        <div className="question-reveal__timer-label">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>tienes 3 min</span>
        </div>

        <div className="question-reveal__actions">
          <Timer
            initialMinutes={3}
            dark
            hideLabel
            onComplete={() => setShowTimeUp(true)}
          />
          <motion.button
            type="button"
            onClick={onGirar}
            className="question-reveal__girar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            girar
          </motion.button>
        </div>
      </div>

      <TimeUpNotification
        isOpen={showTimeUp}
        onClose={() => setShowTimeUp(false)}
      />
    </div>
  )
}
