'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipCountdown } from '@/components/networking/FlipCountdown'
import { QuestionRevealDeck } from '@/components/networking/QuestionRevealDeck'
import { getRandomQuestions } from '@/app/actions/questions'
import type { QuestionWithCategory } from '@/types/database.types'

type Phase = 'countdown' | 'loading' | 'reveal'

function CountdownContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ronda, setRonda] = useState(1 as 1 | 2)
  const [phase, setPhase] = useState<Phase>('countdown')
  const [questions, setQuestions] = useState<QuestionWithCategory[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

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
    const list = await getRandomQuestions(10)
    if (list.length === 0) {
      setQuestions([])
      setPhase('reveal')
      return
    }
    const start = Math.floor(Math.random() * list.length)
    setQuestions(list)
    setSelectedIndex(start)
    setPhase('reveal')
  }, [])

  function handleGirar() {
    if (questions.length <= 1) return
    let next = Math.floor(Math.random() * questions.length)
    if (next === selectedIndex) {
      next = (next + 1) % questions.length
    }
    setSelectedIndex(next)
  }

  function handleFinalizar() {
    if (ronda === 1) {
      router.push('/networking/mesa?ronda=2')
    } else {
      router.push('/networking/feedback')
    }
  }

  const current = questions[selectedIndex]

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
