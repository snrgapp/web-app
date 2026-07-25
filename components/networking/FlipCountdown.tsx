'use client'

import { useEffect, useRef, useState } from 'react'

const W = 220
const H = 280
const HALF = H / 2        // 140px — punto de corte
const FS = 200            // font-size del dígito
const LH = H              // line-height = alto total de la tarjeta

interface FlipCountdownProps {
  startFrom?: number
  intervalMs?: number
  onComplete: () => void
}

/**
 * Flip-clock countdown (split-flap display).
 *
 * Layout de 4 piezas (como un reloj flip real):
 *   1. Panel inferior estático   → mitad inferior del número ACTUAL
 *   2. Panel superior estático   → mitad superior del número ACTUAL  (queda debajo del flap)
 *   3. Flap frontal (anima)      → mitad superior del número ACTUAL, cae hacia abajo
 *   4. Flap trasero (anima)      → mitad superior del SIGUIENTE número, sube desde abajo
 *
 * Al terminar la animación se actualiza el número y se resetean los flaps.
 */
export function FlipCountdown({
  startFrom = 5,
  intervalMs = 1000,
  onComplete,
}: FlipCountdownProps) {
  const [curr, setCurr]       = useState(startFrom)
  const [next, setNext]       = useState(startFrom - 1)
  const [flipping, setFlipping] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (curr <= 1) {
      // Mostramos el 1 durante un intervalo completo y luego completamos
      const t = setTimeout(() => onCompleteRef.current(), intervalMs)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setFlipping(true)
      // Tras la animación (500ms) actualizamos el número y reseteamos
      const done = setTimeout(() => {
        setCurr(c => c - 1)
        setNext(c => Math.max(0, c - 1))
        setFlipping(false)
      }, 520)
      return () => clearTimeout(done)
    }, intervalMs)

    return () => clearTimeout(t)
  }, [curr, intervalMs])

  // ─── helpers de estilo ────────────────────────────────────────────────────

  /** Panel (top o bottom) que recorta el dígito a su mitad */
  function panel(half: 'top' | 'bottom'): React.CSSProperties {
    return {
      position: 'absolute',
      left: 0, right: 0,
      height: HALF,
      top: half === 'top' ? 0 : HALF,
      overflow: 'hidden',
      borderRadius: half === 'top' ? '20px 20px 0 0' : '0 0 20px 20px',
      background: half === 'top'
        ? 'linear-gradient(180deg,#2a2a2a 0%,#1e1e1e 100%)'
        : 'linear-gradient(180deg,#1e1e1e 0%,#141414 100%)',
      boxShadow: half === 'top'
        ? 'inset 0 4px 12px rgba(0,0,0,0.4)'
        : 'inset 0 -6px 14px rgba(0,0,0,0.6)',
    }
  }

  /**
   * El dígito ocupa toda la altura de la tarjeta (LH = 280px).
   * - En el panel superior, lo anclamos en top:0 → se ve la mitad de arriba.
   * - En el panel inferior, lo desplazamos -HALF para que la mitad de abajo
   *   quede dentro del contenedor (que empieza en y=HALF).
   */
  function digit(half: 'top' | 'bottom'): React.CSSProperties {
    return {
      position: 'absolute',
      left: 0, right: 0,
      top: half === 'top' ? 0 : -HALF,
      textAlign: 'center',
      fontSize: FS,
      lineHeight: `${LH}px`,
      fontWeight: 900,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em',
      userSelect: 'none',
    }
  }

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
      {/* Label */}
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

      {/* Tarjeta flip */}
      <div style={{ position: 'relative', width: W, height: H }}>

        {/* 1 ── Panel inferior estático (mitad baja del número ACTUAL) */}
        <div style={panel('bottom')}>
          <span style={digit('bottom')}>{curr}</span>
        </div>

        {/* 2 ── Panel superior estático (mitad alta del número ACTUAL)
               queda visible solo cuando el flap ya ha caído */}
        <div style={panel('top')}>
          <span style={digit('top')}>{next < 1 ? '' : next}</span>
        </div>

        {/* 3 ── Flap frontal: mitad superior del número ACTUAL, cae hacia abajo */}
        <div
          style={{
            ...panel('top'),
            transformOrigin: 'bottom center',
            transform: flipping
              ? 'perspective(600px) rotateX(-180deg)'
              : 'perspective(600px) rotateX(0deg)',
            transition: flipping
              ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
              : 'none',
            zIndex: 10,
            // Sombra que se intensifica al caer
            boxShadow: flipping
              ? 'inset 0 -16px 32px rgba(0,0,0,0.95)'
              : 'inset 0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <span style={digit('top')}>{curr}</span>
        </div>

        {/* 4 ── Flap trasero: mitad superior del SIGUIENTE número, surge al completar el giro */}
        <div
          style={{
            ...panel('top'),
            transformOrigin: 'bottom center',
            transform: flipping
              ? 'perspective(600px) rotateX(0deg)'
              : 'perspective(600px) rotateX(180deg)',
            transition: flipping
              ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
              : 'none',
            zIndex: 9,
          }}
        >
          <span style={digit('top')}>{next < 1 ? '' : next}</span>
        </div>

        {/* Línea divisoria central */}
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            top: HALF - 1,
            height: 3,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />

        {/* Goznes laterales */}
        {(['left', 'right'] as const).map(side => (
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
              zIndex: 30,
            }}
          />
        ))}

        {/* Sombra exterior de la tarjeta */}
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
