'use client'

import { useState, useEffect, useRef } from 'react'

interface TimerProps {
  initialMinutes?: number
  onComplete?: () => void
  /** Cuando true, texto e icono en blanco y círculo oscuro (fondo gris) */
  dark?: boolean
  /** Si true, no muestra la fila "tienes 3 min" (se usa en el padre centrada sobre ambos círculos) */
  hideLabel?: boolean
}

export default function Timer({ initialMinutes = 3, onComplete, dark = false, hideLabel = false }: TimerProps) {
  const totalSeconds = initialMinutes * 60
  const [seconds, setSeconds] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!isRunning) return
    if (seconds <= 0) {
      setIsRunning(false)
      requestAnimationFrame(() => onCompleteRef.current?.())
      return
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setTimeout(() => onCompleteRef.current?.(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`

  const handleStart = () => {
    setIsRunning(true)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {!hideLabel && (
        <div className={`flex items-center gap-2 ${dark ? 'text-white' : 'text-black'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-sm">tienes 3 min</span>
        </div>
      )}
      
      <button
        type="button"
        onClick={!isRunning ? handleStart : undefined}
        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center cursor-pointer select-none transition-opacity ${
          dark ? 'border-white bg-[#1a1a1a]' : 'border-black bg-white'
        } ${!isRunning ? 'hover:opacity-90 active:opacity-80 cursor-pointer' : 'cursor-default'}`}
      >
        <span className={`font-bold text-lg ${dark ? 'text-white' : 'text-black'}`}>
          {isRunning ? formattedTime : 'iniciar'}
        </span>
      </button>
    </div>
  )
}
