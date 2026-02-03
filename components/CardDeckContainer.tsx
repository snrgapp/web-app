'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QuestionWithCategory } from '@/types/database.types'
import QuestionCard from './QuestionCard'
import Timer from './Timer'
import TimeUpNotification from './TimeUpNotification'
import { Coffee, Rocket, Zap, Lightbulb, ArrowLeft } from 'lucide-react'

interface CardDeckContainerProps {
  questions: QuestionWithCategory[]
  categorySlug?: string
}

export default function CardDeckContainer({ questions, categorySlug }: CardDeckContainerProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState<number | null>(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [backgroundColor, setBackgroundColor] = useState<'yellow' | 'dark'>('yellow')
  const [showTimeUpNotification, setShowTimeUpNotification] = useState(false)
  
  // Seleccionar una pregunta aleatoria
  const selectedQuestion = useMemo(() => {
    if (questions.length === 0) return null
    if (selectedCardIndex === null) return null
    return questions[selectedCardIndex]
  }, [questions, selectedCardIndex])
  
  // Conteo regresivo de 3 segundos; fondo y tarjetas según categoría elegida
  useEffect(() => {
    setCountdown(3)
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null
        
        setBackgroundColor((currentColor) => 
          currentColor === 'yellow' ? 'dark' : 'yellow'
        )
        
        if (prev <= 1) {
          const randomIndex = Math.floor(Math.random() * questions.length)
          setSelectedCardIndex(randomIndex)
          setBackgroundColor(categorySlug === 'founder' ? 'yellow' : 'dark')
          clearInterval(interval)
          return null
        }
        
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [questions.length, categorySlug])
  
  // Si no hay preguntas suficientes, mostrar mensaje
  if (questions.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-12">
        <p>No hay preguntas disponibles para mostrar.</p>
      </div>
    )
  }
  
  const handleGirar = () => {
    // Solo mostrar otra pregunta aleatoria, sin conteo ni cambiar la ventana
    if (questions.length === 0) return
    let newIndex = Math.floor(Math.random() * questions.length)
    if (questions.length > 1 && selectedCardIndex !== null && newIndex === selectedCardIndex) {
      newIndex = (newIndex + 1) % questions.length
    }
    setSelectedCardIndex(newIndex)
  }
  
  const bgColorClass = backgroundColor === 'yellow' ? 'bg-[#FFE100]' : 'bg-[#1a1a1a]'

  return (
    <motion.div 
      className={`min-h-screen flex flex-col transition-colors duration-300 ${bgColorClass}`}
      animate={{ backgroundColor: backgroundColor === 'yellow' ? '#FFE100' : '#1a1a1a' }}
    >
      {/* Header */}
      <div className="w-full p-4 sm:p-6 flex items-center justify-between z-30">
        <button
          onClick={() => router.push('/categories')}
          className={backgroundColor === 'yellow' ? 'text-black' : 'text-white'}
        >
          <ArrowLeft size={24} className="sm:w-6 sm:h-6" />
        </button>
        
        <button
          onClick={() => router.push('/feedback')}
          className={`text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full border shadow-sm hover:shadow-md transition-shadow ${
            backgroundColor === 'yellow' 
              ? 'text-black bg-white border-black/10' 
              : 'text-white bg-[#1a1a1a] border-white/20'
          }`}
        >
          finalizar
        </button>
      </div>

      <div className="relative w-full flex-1 flex flex-col min-h-0 px-4 sm:px-6 pb-20 sm:pb-28">
        {/* Header: iconos y frase más pegados a las tarjetas */}
        <div className="w-full flex-shrink-0 flex flex-col items-center gap-1 sm:gap-2 z-30 pt-2 sm:pt-3">
          <div className="flex justify-center gap-6 sm:gap-10 opacity-10">
            <Coffee size={28} className={`sm:w-[42px] sm:h-[42px] ${backgroundColor === 'yellow' ? 'text-black' : 'text-white'}`} />
            <Rocket size={28} className={`sm:w-[42px] sm:h-[42px] ${backgroundColor === 'yellow' ? 'text-black' : 'text-white'}`} />
            <Zap size={28} className={`sm:w-[42px] sm:h-[42px] ${backgroundColor === 'yellow' ? 'text-black' : 'text-white'}`} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Lightbulb size={20} className={`sm:w-6 sm:h-6 ${backgroundColor === 'yellow' ? 'text-black' : 'text-white'}`} />
            <span className={`text-lg sm:text-2xl font-normal tracking-tight ${
              backgroundColor === 'yellow' ? 'text-gray-900' : 'text-white'
            }`}>
              {selectedCardIndex !== null ? 'responde la pregunta' : 'estamos escogiendo la pregunta'}
            </span>
          </div>
        </div>

        {/* Contador regresivo o tarjeta: centrado en el resto de la pantalla */}
        <div className="relative w-full flex-1 flex justify-center items-center min-h-0 z-10 px-2 sm:px-6 py-2">
          {countdown !== null ? (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-9xl sm:text-[12rem] md:text-[15rem] font-black ${
                backgroundColor === 'yellow' ? 'text-black' : 'text-white'
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
                variant={categorySlug === 'founder' ? 'dark' : 'yellow'}
              />
            </motion.div>
          ) : null}
        </div>

        {/* "tienes 3 min", timer y girar: más pegados a la tarjeta */}
        {selectedCardIndex !== null && (
          <div className="-mt-8 sm:-mt-12 w-full max-w-xl mx-auto px-4 flex flex-col items-center">
            <div className={`flex items-center justify-center gap-2 mb-2 sm:mb-3 font-timer-label ${backgroundColor === 'dark' ? 'text-white' : 'text-black'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
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
                  className={`flex-shrink-0 w-20 h-20 rounded-full border-2 font-timer-label flex items-center justify-center ${
                    backgroundColor === 'yellow'
                      ? 'border-[#FFE100]/30 bg-[#1a1a1a] text-[#FFE100]'
                      : 'border-black/20 bg-[#FFE100] text-black'
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
