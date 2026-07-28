'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipCountdown } from '@/components/networking/FlipCountdown'
import { QuestionRevealDeck } from '@/components/networking/QuestionRevealDeck'
import { getRandomQuestions } from '@/app/actions/questions'
import type { QuestionWithCategory } from '@/types/database.types'

type Phase = 'countdown' | 'loading' | 'reveal'

function shuffleDeck<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function CountdownContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ronda, setRonda] = useState(1 as 1 | 2)
  const [phase, setPhase] = useState<Phase>('countdown')
  const [deck, setDeck] = useState<QuestionWithCategory[]>([])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const fromUrl = searchParams.get('ronda')
    const stored =
      fromUrl ??
      sessionStorage.getItem('networking_ronda_actual') ??
      localStorage.getItem('networking_ronda_actual') ??
      '1'
    const r = stored === '2' ? 2 : 1
    setRonda(r)
    sessionStorage.setItem('networking_ronda_actual', String(r))
    localStorage.setItem('networking_ronda_actual', String(r))

    const asistenteId =
      sessionStorage.getItem('asistente_id') ?? localStorage.getItem('asistente_id')
    if (!asistenteId) {
      router.replace('/networking/verify')
    }
  }, [router, searchParams])

  const handleComplete = useCallback(async () => {
    setPhase('loading')
    // Pool completo mezclado (sin repetir hasta agotar)
    const list = await getRandomQuestions(100, 'networking')
    if (list.length === 0) {
      // Fallback: cualquier categoría de la org
      const fallback = await getRandomQuestions(100)
      setDeck(fallback)
      setCursor(0)
      setPhase('reveal')
      return
    }
    setDeck(list)
    setCursor(0)
    setPhase('reveal')
  }, [])

  function handleGirar() {
    if (deck.length <= 1) return

    // Siguiente sin repetir hasta agotar el mazo
    if (cursor + 1 < deck.length) {
      setCursor(cursor + 1)
      return
    }

    // Mazo agotado: remezclar evitando empezar con la misma pregunta
    const current = deck[cursor]
    let reshuffled = shuffleDeck(deck)
    if (reshuffled[0]?.id === current.id && reshuffled.length > 1) {
      const swapWith = 1 + Math.floor(Math.random() * (reshuffled.length - 1))
      ;[reshuffled[0], reshuffled[swapWith]] = [reshuffled[swapWith], reshuffled[0]]
    }
    setDeck(reshuffled)
    setCursor(0)
  }

  function handleFinalizar() {
    if (ronda === 1) {
      router.push('/networking/mesa?ronda=2')
    } else {
      router.push('/networking/feedback')
    }
  }

  const current = deck[cursor]

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(16px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <FlipCountdown startFrom={3} onComplete={handleComplete} />
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, filter: 'blur(16px)' }}
            animate={{ opacity: 1, filter: 'blur(8px)' }}
            exit={{ opacity: 0, filter: 'blur(16px)' }}
            transition={{ duration: 0.35 }}
            style={{ minHeight: '100vh', background: '#09090b' }}
          />
        )}

        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, filter: 'blur(18px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {current ? (
              <QuestionRevealDeck
                question={current.content}
                categoryLabel={current.category?.name ?? null}
                onGirar={handleGirar}
                onFinalizar={handleFinalizar}
              />
            ) : (
              <div
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a1a1aa',
                  padding: 24,
                  textAlign: 'center',
                }}
              >
                No hay preguntas disponibles en la base de datos.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function NetworkingCountdownPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#09090b' }} />
      }
    >
      <CountdownContent />
    </Suspense>
  )
}
