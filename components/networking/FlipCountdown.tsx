'use client'

import { useEffect, useRef, useState } from 'react'

const W = 220
const H = 280
const HALF = H / 2
const FONT_SIZE = 200

interface FlipCountdownProps {
  startFrom?: number
  intervalMs?: number
  onComplete: () => void
}

type FlipPhase = {
  /** Número que sale (mitad superior cayendo) */
  outgoing: number
  /** Número que entra (se revela debajo) */
  incoming: number
}

/**
 * Split-flap countdown.
 *
 * Estado estático:
 *   - Una sola fuente de verdad: `currentNumber`
 *   - Mitad superior e inferior renderizan el MISMO dígito, solo recortado
 *
 * Durante la transición:
 *   - Se monta un par de solapas animadas (outgoing cayendo / incoming revelándose)
 *   - Al terminar: se desmontan, currentNumber = incoming
 */
export function FlipCountdown({
  startFrom = 5,
  intervalMs = 1000,
  onComplete,
}: FlipCountdownProps) {
  const [currentNumber, setCurrentNumber] = useState(startFrom)
  const [flip, setFlip] = useState<FlipPhase | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // No iniciar otro flip mientras anima
    if (flip) return

    if (currentNumber <= 1) {
      const t = setTimeout(() => onCompleteRef.current(), intervalMs)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      // Definir saliente / entrante al iniciar el flip
      setFlip({
        outgoing: currentNumber,
        incoming: currentNumber - 1,
      })
    }, intervalMs)

    return () => clearTimeout(t)
  }, [currentNumber, flip, intervalMs])

  // Cuando termina la animación CSS → comprometer el nuevo número y desmontar solapas
  useEffect(() => {
    if (!flip) return
    const t = setTimeout(() => {
      setCurrentNumber(flip.incoming)
      setFlip(null)
    }, 520)
    return () => clearTimeout(t)
  }, [flip])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#09090b',
      }}
    >
      <p
        style={{
          color: '#52525b',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 40,
          userSelect: 'none',
        }}
      >
        comenzando en
      </p>

      <div
        style={{
          position: 'relative',
          width: W,
          height: H,
          perspective: 800,
        }}
      >
        {/* ── Base estática: AMBAS mitades usan currentNumber ── */}
        <StaticHalf half="top" number={currentNumber} />
        <StaticHalf half="bottom" number={currentNumber} />

        {/* ── Solapas de animación: solo montadas durante el flip ── */}
        {flip && (
          <>
            {/* Capa revelada debajo: mitad superior del número entrante */}
            <StaticHalf half="top" number={flip.incoming} zIndex={5} />

            {/* Solapa que cae: mitad superior del número saliente */}
            <FlippingFlap number={flip.outgoing} />
          </>
        )}

        {/* Línea divisoria */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: HALF - 1,
            height: 3,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 30,
            pointerEvents: 'none',
          }}
        />

        {/* Goznes */}
        {(['left', 'right'] as const).map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              top: HALF - 9,
              [side]: -11,
              width: 22,
              height: 18,
              borderRadius: 5,
              background:
                'linear-gradient(135deg,#999 0%,#666 35%,#333 65%,#777 100%)',
              boxShadow:
                '0 3px 8px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,255,255,0.2)',
              zIndex: 40,
            }}
          />
        ))}

        {/* Sombra exterior */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            pointerEvents: 'none',
            boxShadow:
              '0 40px 100px rgba(0,0,0,0.8), 0 12px 32px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Mitad estática: recorta un dígito al top o bottom ─── */

function StaticHalf({
  half,
  number,
  zIndex = 1,
}: {
  half: 'top' | 'bottom'
  number: number
  zIndex?: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: half === 'top' ? 0 : HALF,
        height: HALF,
        overflow: 'hidden',
        borderRadius: half === 'top' ? '20px 20px 0 0' : '0 0 20px 20px',
        background:
          half === 'top'
            ? 'linear-gradient(180deg,#2a2a2a 0%,#1e1e1e 100%)'
            : 'linear-gradient(180deg,#1e1e1e 0%,#141414 100%)',
        boxShadow:
          half === 'top'
            ? 'inset 0 4px 12px rgba(0,0,0,0.4)'
            : 'inset 0 -6px 14px rgba(0,0,0,0.6)',
        zIndex,
      }}
    >
      {/*
        El glifo ocupa toda la altura H.
        - top: anclado en 0 → overflow oculta la mitad inferior
        - bottom: desplazado -HALF → overflow oculta la mitad superior
      */}
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: half === 'top' ? 0 : -HALF,
          height: H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: FONT_SIZE,
          fontWeight: 900,
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {number}
      </span>
    </div>
  )
}

/* ─── Solapa animada: mitad superior del número saliente, cae con rotateX ─── */

function FlippingFlap({ number }: { number: number }) {
  const [rotated, setRotated] = useState(false)

  // Disparar el flip en el siguiente frame (para que el browser pinte el estado inicial)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRotated(true))
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: HALF,
        overflow: 'hidden',
        borderRadius: '20px 20px 0 0',
        background: 'linear-gradient(180deg,#2a2a2a 0%,#1e1e1e 100%)',
        transformOrigin: 'bottom center',
        transform: rotated
          ? 'rotateX(-180deg)'
          : 'rotateX(0deg)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        backfaceVisibility: 'hidden',
        boxShadow: rotated
          ? 'inset 0 -16px 32px rgba(0,0,0,0.95)'
          : 'inset 0 4px 12px rgba(0,0,0,0.4)',
        zIndex: 20,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: FONT_SIZE,
          fontWeight: 900,
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {number}
      </span>
    </div>
  )
}
