'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface TimeUpNotificationProps {
  isOpen: boolean
  onClose: () => void
}

async function playAlarmSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    const audioContext = new AudioContextClass()
    if (audioContext.state === 'suspended') await audioContext.resume()

    const playBeep = (freq: number, startTime: number, duration: number) => {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.25, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }

    const t = audioContext.currentTime
    playBeep(880, t, 0.15)
    playBeep(880, t + 0.2, 0.15)
    playBeep(880, t + 0.4, 0.3)
  } catch {
    // Fallback silencioso si el navegador no soporta AudioContext
  }
}

export default function TimeUpNotification({ isOpen, onClose }: TimeUpNotificationProps) {
  useEffect(() => {
    if (isOpen) {
      playAlarmSound().catch(() => {})
    }
  }, [isOpen])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} className="text-gray-500" />
            </button>
            <p className="text-xl font-semibold text-center text-gray-900 pt-2">
              se acabo el tiempo
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
