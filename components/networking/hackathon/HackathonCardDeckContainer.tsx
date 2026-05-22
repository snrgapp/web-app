'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { QuestionWithCategory } from '@/types/database.types'
import QuestionCard from '@/components/QuestionCard'
import Timer from '@/components/Timer'
import TimeUpNotification from '@/components/TimeUpNotification'
import { HackathonTechBackdrop } from '@/components/networking/hackathon/HackathonTechBackdrop'

const STORAGE_ID = 'hackathon_submission_id'

type Props = {
  questions: QuestionWithCategory[]
  ronda: 1 | 2
}

export default function HackathonCardDeckContainer({ questions, ronda }: Props) {
  const router = useRouter()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [pulse, setPulse] = useState(false)
  const [showTimeUpNotification, setShowTimeUpNotification] = useState(false)

  useEffect(() => {
    const sid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_ID) ?? localStorage.getItem(STORAGE_ID)
        : null
    if (!sid) {
      router.replace('/networking/hackathon/verify')
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
      router.push('/networking/hackathon?momento=tarde')
      return
    }
    router.push('/networking/hackathon')
  }

  const handleVolver = () => {
    router.push('/networking/hackathon')
  }

  const handleGirar = () => {
    if (questions.length === 0) return
    let newIndex = Math.floor(Math.random() * questions.length)
    if (questions.length > 1 && selectedCardIndex !== null && newIndex === selectedCardIndex) {
      newIndex = (newIndex + 1) % questions.length
    }
    setSelectedCardIndex(newIndex)
  }

  if (!submissionId) {
    return (
      <div className="hackathon-app-root flex min-h-dvh items-center justify-center bg-[#08080C]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#7B35FF]" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="hackathon-app-root flex min-h-dvh flex-col items-center justify-center bg-[#08080C] px-6 text-center text-white/65">
        <p className="text-sm">No hay preguntas disponibles.</p>
      </div>
    )
  }

  const accentClass = pulse ? 'text-[#7B35FF]' : 'text-white'

  return (
    <motion.div
      className="hackathon-app-root relative flex min-h-dvh flex-col overflow-hidden bg-[#08080C] transition-colors duration-300"
      animate={{ backgroundColor: '#08080C' }}
    >
      <HackathonTechBackdrop />

      <header className="relative z-30 flex w-full items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={handleVolver}
          className="-ml-2 rounded-lg p-2 text-white/60 transition hover:bg-white/6 hover:text-white"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          type="button"
          onClick={handleFinalizar}
          className="rounded-full border border-[#7B35FF]/40 bg-[#141418] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[4px_4px_0_rgba(123,53,255,0.45)] transition hover:border-[#7B35FF]/60"
          style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
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
              className={`font-black tracking-tighter sm:tracking-normal ${accentClass} text-[5.5rem] leading-none sm:text-[9rem] md:text-[11rem]`}
              style={{
                fontFamily: 'system-ui, "Inter", sans-serif',
                textShadow: pulse ? '0 0 40px rgba(123,53,255,0.55)' : 'none',
              }}
            >
              {countdown}
            </motion.div>
          ) : selectedQuestion ? (
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 40 }}
              animate={{ scale: 1.32, opacity: 1, y: -10 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative"
            >
              <QuestionCard
                content={selectedQuestion.content}
                category={selectedQuestion.category}
                variant="hackathon"
              />
            </motion.div>
          ) : null}
        </div>

        {selectedCardIndex !== null && (
          <div className="mx-auto mt-8 flex w-full max-w-xl flex-col items-center px-4 sm:-mt-10 sm:mt-0">
            <div className="mb-2 flex items-center justify-center gap-2 text-sm text-[#c9b4ff]/90 sm:mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-[#7B35FF]"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-semibold">Tienes 3 min</span>
            </div>
            <div className="flex items-start justify-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center pt-2">
                <Timer
                  initialMinutes={3}
                  hackathon
                  hideLabel
                  onComplete={() => setShowTimeUpNotification(true)}
                />
              </div>
              <div className="flex flex-col items-center pt-2">
                <motion.button
                  type="button"
                  onClick={handleGirar}
                  className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#7B35FF] bg-[#111116] text-xs font-bold uppercase tracking-wider text-white shadow-[4px_4px_0_rgba(123,53,255,0.42)]"
                  style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Girar
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <TimeUpNotification
          isOpen={showTimeUpNotification}
          onClose={() => setShowTimeUpNotification(false)}
          hackathon
        />
      </div>
    </motion.div>
  )
}
