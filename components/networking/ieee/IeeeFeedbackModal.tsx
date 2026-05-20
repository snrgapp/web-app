'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Star, X } from 'lucide-react'
import { guardarFeedbackIeeeNetworking } from '@/app/actions/ieee-networking'

type Props = {
  isOpen: boolean
  submissionId: string
  /** Teléfono verificado (solo dígitos); evita FK si `submissionId` del storage no coincide con la BD */
  telefonoDigits?: string | null
  onClose: () => void
  onComplete: () => void
}

export function IeeeFeedbackModal({
  isOpen,
  submissionId,
  telefonoDigits,
  onClose,
  onComplete,
}: Props) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setRating(0)
      setHoverRating(0)
      setComment('')
      setError('')
      setLoading(false)
    }
  }, [isOpen])

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  async function handleEnviar() {
    if (rating < 1 || rating > 5) return
    setLoading(true)
    setError('')
    const result = await guardarFeedbackIeeeNetworking(submissionId, rating, comment || null, telefonoDigits)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'No se pudo enviar. Intenta de nuevo.')
      return
    }
    onComplete()
  }

  const displayRating = hoverRating || rating

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/65 p-4"
          style={{ minHeight: '100dvh' }}
          onClick={handleBackdrop}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md rounded-[22px] border border-white/12 bg-[#252525] p-8 shadow-[8px_8px_0_#00629B]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-2 text-white/45 transition hover:bg-white/8 hover:text-white"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <p
              className="text-center text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/55"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              IEEE · Networking
            </p>
            <h2
              className="mt-3 text-center text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: 'var(--font-fraunces-ieee), serif' }}
            >
              ¿Qué te pareció la dinámica?
            </h2>
            <p className="mt-2 text-center text-sm font-light text-white">
              Tu opinión nos ayuda a mejorar las conexiones en el evento.
            </p>

            <div className="mt-8 flex justify-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Star
                    size={44}
                    className={`transition-colors sm:h-12 sm:w-12 ${
                      star <= displayRating
                        ? 'fill-[#00629B] text-[#00629B]'
                        : 'fill-transparent text-white/22'
                    }`}
                    strokeWidth={1.35}
                  />
                </motion.button>
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-white/45">
              {rating > 0 ? `${rating} de 5 estrellas` : 'Toca las estrellas para calificar'}
            </p>

            <label className="mt-6 block">
              <span
                className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white/50"
                style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                Comentario (opcional)
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos qué funcionó o qué mejorarías…"
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder:text-white/28 focus:border-[#00629B]/55 focus:outline-none focus:ring-2 focus:ring-[#00629B]/25"
              />
            </label>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleEnviar}
              disabled={rating < 1 || loading}
              className="mt-6 h-12 w-full rounded-xl border-2 border-[#161616] bg-white text-sm font-medium uppercase tracking-wide text-[#161616] shadow-[6px_6px_0_#00629B] transition hover:bg-white/95 disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#161616]" /> : 'Enviar'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body)
  }
  return modal
}
