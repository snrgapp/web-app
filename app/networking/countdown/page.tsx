'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
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
      // Sin preguntas: ir directo al flujo de questions (muestra el empty state)
      router.push(`/networking/questions?ronda=${ronda}`)
      return
    }
    const pick = questions[Math.floor(Math.random() * questions.length)]
    setQuestion(pick.content)
    setCategoryLabel(pick.category?.name ?? null)
    // Guardar el pool para la pantalla de questions (opcional, evita sorpresa)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('networking_reveal_done', '1')
    }
    setPhase('reveal')
  }, [ronda, router])

  function handleContinue() {
    router.push(`/networking/questions?ronda=${ronda}`)
  }

  if (phase === 'countdown') {
    return <FlipCountdown startFrom={3} onComplete={handleComplete} />
  }

  if (phase === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#09090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    )
  }

  return (
    <QuestionRevealDeck
      question={question}
      categoryLabel={categoryLabel}
      onContinue={handleContinue}
    />
  )
}
