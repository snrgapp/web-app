'use client'

import { useEffect, useRef, useState } from 'react'
import './FlipCountdown.css'

const TOTAL_MS = 560
const HALF_MS = TOTAL_MS / 2 // 280ms cada fase — idénticas

interface FlipCountdownProps {
  startFrom?: number
  intervalMs?: number
  onComplete: () => void
}

type FlipState =
  | { phase: 'idle' }
  | { phase: 'phase1'; outgoing: number; incoming: number }
  | { phase: 'phase2'; outgoing: number; incoming: number }

/**
 * Split-flap countdown con flip simétrico en 2 fases iguales.
 *
 * FASE 1 (0 → 50%): solapa superior (número VIEJO)  rotateX(0) → rotateX(-90)
 *   — easing ease-in, transform-origin: bottom
 *
 * PUNTO 50%: currentNumber = newNumber (ambas solapas de canto / invisibles)
 *
 * FASE 2 (50 → 100%): solapa inferior (número NUEVO) rotateX(90) → rotateX(0)
 *   — easing ease-out, transform-origin: top
 */
export function FlipCountdown({
  startFrom = 3,
  intervalMs = 1000,
  onComplete,
}: FlipCountdownProps) {
  const [currentNumber, setCurrentNumber] = useState(startFrom)
  const [flip, setFlip] = useState<FlipState>({ phase: 'idle' })
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Programar el siguiente flip (o completar)
  useEffect(() => {
    if (flip.phase !== 'idle') return

    if (currentNumber <= 1) {
      const t = setTimeout(() => onCompleteRef.current(), intervalMs)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setFlip({
        phase: 'phase1',
        outgoing: currentNumber,
        incoming: currentNumber - 1,
      })
    }, intervalMs)

    return () => clearTimeout(t)
  }, [currentNumber, flip.phase, intervalMs])

  // Transición entre fases con duraciones idénticas (HALF_MS)
  useEffect(() => {
    if (flip.phase === 'idle') return

    if (flip.phase === 'phase1') {
      // Exactamente al 50%: cambiar número + pasar a fase 2
      const t = setTimeout(() => {
        setCurrentNumber(flip.incoming)
        setFlip({
          phase: 'phase2',
          outgoing: flip.outgoing,
          incoming: flip.incoming,
        })
      }, HALF_MS)
      return () => clearTimeout(t)
    }

    if (flip.phase === 'phase2') {
      // Exactamente al 100%: volver a idle (solo currentNumber visible)
      const t = setTimeout(() => {
        setFlip({ phase: 'idle' })
      }, HALF_MS)
      return () => clearTimeout(t)
    }
  }, [flip])

  const displayNumber =
    flip.phase === 'phase1' ? flip.outgoing : currentNumber

  return (
    <div className="flip-countdown">
      <p className="flip-countdown__label">comenzando en</p>

      <div className="flip-card">
        {/* Base estática: AMBAS mitades = displayNumber (misma fuente) */}
        <div className="flip-card__half flip-card__half--top">
          <span className="flip-card__digit">{displayNumber}</span>
        </div>
        <div className="flip-card__half flip-card__half--bottom">
          <span className="flip-card__digit flip-card__digit--bottom">
            {displayNumber}
          </span>
        </div>

        {/* FASE 1: solapa superior cayendo (número viejo) */}
        {flip.phase === 'phase1' && (
          <div className="flip-card__flap flip-card__flap--top-out">
            <span className="flip-card__digit">{flip.outgoing}</span>
          </div>
        )}

        {/* FASE 2: solapa inferior entrando (número nuevo) */}
        {flip.phase === 'phase2' && (
          <div className="flip-card__flap flip-card__flap--bottom-in">
            <span className="flip-card__digit flip-card__digit--bottom">
              {flip.incoming}
            </span>
          </div>
        )}

        {/* Bisagra */}
        <div className="flip-card__hinge-line" />
        <div className="flip-card__hinge flip-card__hinge--left" />
        <div className="flip-card__hinge flip-card__hinge--right" />
      </div>
    </div>
  )
}
