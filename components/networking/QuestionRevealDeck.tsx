'use client'

import Image from 'next/image'
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
  onContinue?: () => void
}

/**
 * Pantalla post-countdown: mazo de cartas + tarjeta blanca con la pregunta.
 * Entrada: blur suave (sin stagger/flash por carta).
 */
export function QuestionRevealDeck({
  question,
  categoryLabel,
  onContinue,
}: QuestionRevealDeckProps) {
  return (
    <div className="question-reveal">
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
            {/* public/logowhite.png */}
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

      {onContinue && (
        <button
          type="button"
          className="question-reveal__cta"
          onClick={onContinue}
        >
          continuar
        </button>
      )}
    </div>
  )
}
