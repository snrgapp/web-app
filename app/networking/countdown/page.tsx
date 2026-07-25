'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipCountdown } from '@/components/networking/FlipCountdown'
import { QuestionRevealDeck } from '@/components/networking/QuestionRevealDeck'
import { getRandomQuestions } from '@/app/actions/questions'

type Phase = 'countdown' | 'loading' | 'reveal'

export default function NetworkingCountdownPage() {
  const router = useRouter()
  const [ronda, setRonda] = useState('1')
  const [phase, setPhase] = useState<Phase>('countdown')
  const [question, setQuestion] = useState('')
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null)

  useEffect(() => {
    const stored =
      sessionStorage.getItem('networking_ronda_actual') ??
      localStorage.getItem('networking_ronda_actual') ??
      '1'
    setRonda(stored)
  }, [])

  const handleComplete = useCallback(async () => {
    setPhase('loading')
    const questions = await getRandomQuestions(10)
    if (questions.length === 0) {
      router.push(`/networking/questions?ronda=${ronda}`)
      return
    }
    const pick = questions[Math.floor(Math.random() * questions.length)]
    setQuestion(pick.content)
    setCategoryLabel(pick.category?.name ?? null)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('networking_reveal_done', '1')
    }
    setPhase('reveal')
  }, [ronda, router])

  function handleContinue() {
    router.push(`/networking/questions?ronda=${ronda}`)
  }

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
            style={{
              minHeight: '100vh',
              background: '#09090b',
            }}
          />
        )}

        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, filter: 'blur(18px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuestionRevealDeck
              question={question}
              categoryLabel={categoryLabel}
              onContinue={handleContinue}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
