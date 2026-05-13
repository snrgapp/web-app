'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { QuestionWithCategory } from '@/types/database.types'
import QuestionCard from '@/components/QuestionCard'
import Timer from '@/components/Timer'
import TimeUpNotification from '@/components/TimeUpNotification'
import { GeniusFeedbackModal } from '@/components/networking/genius/GeniusFeedbackModal'
import { GeniusCreativityBackdrop } from '@/components/networking/genius/GeniusCreativityBackdrop'

const STORAGE_ID = 'genius_submission_id'
const STORAGE_RONDA = 'genius_ronda_actual'

type Props = {
  questions: QuestionWithCategory[]
  ronda: 1 | 2
}

export default function GeniusCardDeckContainer({ questions, ronda }: Props) {
  const router = useRouter()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [pulse, setPulse] = useState(false)
  const [showTimeUpNotification, setShowTimeUpNotification] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    const sid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_ID) ?? localStorage.getItem(STORAGE_ID)
        : null
    if (!sid) {
      router.replace('/networking/genius/verify')
      return
    }
    setSubmissionId(sid)
  }, [router])

  useEffect(() => {
    if (!submissionId) return
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null
        setPulse((p) => !p)
        if (prev <= 1) {
          const randomIndex = Math.floor(Math.random() * questions.length)
          setSelectedCardIndex(randomIndex)
          clearInterval(interval)
          return null
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [submissionId, questions.length])

  const selectedQuestion = useMemo(() => {
    if (questions.length === 0 || selectedCardIndex === null) return null
    return questions[selectedCardIndex]
  }, [questions, selectedCardIndex])

  const handleFinalizar = () => {
    if (ronda === 1) {
      router.push('/networking/genius?momento=tarde')
      return
    }
    setShowFeedback(true)
  }

  const handleVolver = () => {
    router.push('/networking/genius')
  }

  const handleGirar = () => {
    if (questions.length === 0) return
    let newIndex = Math.floor(Math.random() * questions.length)
    if (questions.length > 1 && selectedCardIndex !== null && newIndex === selectedCardIndex) {
      newIndex = (newIndex + 1) % questions.length
    }
    setSelectedCardIndex(newIndex)
  }

  const handleFeedbackComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_ID)
      sessionStorage.removeItem(STORAGE_RONDA)
      localStorage.removeItem(STORAGE_ID)
      localStorage.removeItem(STORAGE_RONDA)
    }
    setShowFeedback(false)
    router.push('/networking/genius/verify')
  }

  if (!submissionId) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#694aff]" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-white/65">No hay preguntas disponibles para mostrar.</p>
      </div>
    )
  }

  const accentClass = pulse ? 'text-[#694aff]' : 'text-white'

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[#161616] transition-colors duration-300"
      animate={{ backgroundColor: '#161616' }}
    >
      <GeniusCreativityBackdrop />

      {submissionId ? (
        <GeniusFeedbackModal
          isOpen={showFeedback}
          submissionId={submissionId}
          onClose={() => setShowFeedback(false)}
          onComplete={handleFeedbackComplete}
        />
      ) : null}

      <header className="relative z-30 flex w-full items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={handleVolver}
          className="-ml-2 rounded-lg p-2 text-white/65 transition hover:bg-white/5 hover:text-white"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          type="button"
          onClick={handleFinalizar}
          className="rounded-full border border-white/18 bg-[#1c1c1c] px-5 py-2 text-xs font-medium uppercase tracking-wider text-white shadow-[4px_4px_0_#694aff] transition hover:border-white/28"
          style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
        >
          Finalizar
        </button>
      </header>

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 py-2 sm:px-6">
          {countdown !== null ? (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-8xl font-black sm:text-[11rem] md:text-[14rem] ${accentClass}`}
              style={{ fontFamily: 'var(--font-fraunces-genius), serif' }}
            >
              {countdown}
            </motion.div>
          ) : selectedQuestion ? (
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 40 }}
              animate={{ scale: 1.35, opacity: 1, y: -12 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative"
            >
              <QuestionCard content={selectedQuestion.content} category={selectedQuestion.category} variant="genius" />
            </motion.div>
          ) : null}
        </div>

        {selectedCardIndex !== null && (
          <div className="mx-auto mt-8 flex w-full max-w-xl flex-col items-center px-4 sm:-mt-10 sm:mt-0">
            <div
              className="mb-2 flex items-center justify-center gap-2 text-sm text-white/78 sm:mb-3"
              style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[#694aff]">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Tienes 3 min</span>
            </div>
            <div className="flex items-start justify-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center pt-2">
                <Timer
                  initialMinutes={3}
                  genius
                  hideLabel
                  onComplete={() => setShowTimeUpNotification(true)}
                />
              </div>
              <div className="flex flex-col items-center pt-2">
                <motion.button
                  type="button"
                  onClick={handleGirar}
                  className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#694aff] bg-[#141414] text-xs font-medium uppercase tracking-wider text-white shadow-[4px_4px_0_rgba(105,74,255,0.4)]"
                  style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Girar
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <TimeUpNotification isOpen={showTimeUpNotification} onClose={() => setShowTimeUpNotification(false)} genius />
      </div>
    </motion.div>
  )
}
