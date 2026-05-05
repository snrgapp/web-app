'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { QuestionWithCategory } from '@/types/database.types'
import QuestionCard from './QuestionCard'
import Timer from './Timer'
import TimeUpNotification from './TimeUpNotification'
import { ArrowLeft } from 'lucide-react'

interface PerrenqueCardDeckContainerProps {
  questions: QuestionWithCategory[]
  ronda?: 1 | 2
}

/** Fondo: gris cuando la tarjeta es amarilla (contraste); negro cuando la tarjeta es oscura. */
export default function PerrenqueCardDeckContainer({
  questions,
  ronda = 1,
}: PerrenqueCardDeckContainerProps) {
  const router = useRouter()

  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window : null
    const sid = storage
      ? sessionStorage.getItem('perrenque_submission_id') ?? localStorage.getItem('perrenque_submission_id')
      : null
    if (!sid) {
      router.replace('/networking/perrenque/verify')
    }
  }, [router])

  const handleFinalizar = () => {
    if (ronda === 1) {
      router.push('/networking/perrenque/grupo?ronda=2')
    } else {
      router.push('/networking/perrenque/feedback')
    }
  }

  const handleVolver = () => {
    router.push(`/networking/perrenque/grupo?ronda=${ronda}`)
  }

  const [countdown, setCountdown] = useState<number | null>(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [backgroundColor, setBackgroundColor] = useState<'yellow' | 'dark'>('yellow')
  const [showTimeUpNotification, setShowTimeUpNotification] = useState(false)

  const selectedQuestion = useMemo(() => {
    if (questions.length === 0 || selectedCardIndex === null) return null
    return questions[selectedCardIndex]
  }, [questions, selectedCardIndex])

  useEffect(() => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null
        setBackgroundColor((c) => (c === 'yellow' ? 'dark' : 'yellow'))
        if (prev <= 1) {
          const randomIndex = Math.floor(Math.random() * questions.length)
          setSelectedCardIndex(randomIndex)
          setBackgroundColor('yellow')
          clearInterval(interval)
          return null
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [questions.length])

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a9fd4] flex items-center justify-center px-4 text-center font-semibold text-white">
        <p>No hay preguntas activas para esta ronda. Avisa a producción.</p>
      </div>
    )
  }

  const handleGirar = () => {
    if (questions.length === 0) return
    let newIndex = Math.floor(Math.random() * questions.length)
    if (questions.length > 1 && selectedCardIndex !== null && newIndex === selectedCardIndex) {
      newIndex = (newIndex + 1) % questions.length
    }
    setSelectedCardIndex(newIndex)
  }

  const bgHex = backgroundColor === 'yellow' ? '#d4d4d8' : '#1a1a1a'
  const cardVariant = backgroundColor === 'yellow' ? 'yellow' : 'dark'

  return (
    <motion.div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: bgHex }}
      animate={{ backgroundColor: bgHex }}
    >
      <div className="w-full p-4 sm:p-6 flex items-center justify-between z-30">
        <button
          onClick={handleVolver}
          className={backgroundColor === 'yellow' ? 'text-black' : 'text-white'}
          aria-label="Volver"
        >
          <ArrowLeft size={24} className="sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleFinalizar}
          className={`text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full border-[2.5px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all tracking-wide [font-family:var(--font-perrenque-bangers),cursive] ${
            backgroundColor === 'yellow'
              ? 'text-black bg-white'
              : 'text-black bg-[#FFD600]'
          }`}
        >
          finalizar
        </button>
      </div>

      <div className="relative w-full flex-1 flex flex-col min-h-0 px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative w-full flex-1 flex justify-center items-center min-h-0 z-10 px-2 sm:px-6 py-2">
          {countdown !== null ? (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-9xl sm:text-[12rem] md:text-[15rem] font-black font-['Impact','Arial_Black',sans-serif] ${
                backgroundColor === 'yellow' ? 'text-black' : 'text-[#FFD600]'
              }`}
            >
              {countdown}
            </motion.div>
          ) : selectedQuestion ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1.4, opacity: 1, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative"
            >
              <QuestionCard
                content={selectedQuestion.content}
                category={selectedQuestion.category}
                variant={cardVariant === 'yellow' ? 'yellow' : 'dark'}
                theme="perrenque"
              />
            </motion.div>
          ) : null}
        </div>

        {selectedCardIndex !== null && (
          <div className="mt-8 sm:mt-0 sm:-mt-12 w-full max-w-xl mx-auto px-4 flex flex-col items-center">
            <div
              className={`flex items-center justify-center gap-2 mb-2 sm:mb-3 font-extrabold ${
                backgroundColor === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>tienes 3 min</span>
            </div>
            <div className="flex items-start justify-center gap-6 sm:gap-8">
              <div className="flex flex-col items-center pt-2">
                <Timer initialMinutes={3} dark={backgroundColor === 'dark'} hideLabel />
              </div>
              <div className="flex flex-col items-center pt-2">
                <motion.button
                  onClick={handleGirar}
                  className={`flex-shrink-0 w-20 h-20 rounded-full border-[2.5px] border-[#1a1a1a] text-lg flex items-center justify-center shadow-[3px_3px_0_#1a1a1a] [font-family:var(--font-perrenque-bangers),cursive] ${
                    backgroundColor === 'yellow'
                      ? 'bg-[#1a1a1a] text-[#FFD600]'
                      : 'bg-[#FFD600] text-black'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  girar
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <TimeUpNotification
          isOpen={showTimeUpNotification}
          onClose={() => setShowTimeUpNotification(false)}
        />
      </div>
    </motion.div>
  )
}
