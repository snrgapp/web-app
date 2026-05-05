'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Star, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { guardarFeedbackPerrenque } from '@/app/actions/perrenque-networking'

export default function PerrenqueFeedbackPage() {
  const router = useRouter()
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sid =
      sessionStorage.getItem('perrenque_submission_id') ??
      localStorage.getItem('perrenque_submission_id')
    if (!sid) {
      router.replace('/networking/perrenque/verify')
    }
  }, [router])

  async function handleEnviar() {
    if (rating < 1 || rating > 5) return

    const submissionId =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('perrenque_submission_id') ??
          localStorage.getItem('perrenque_submission_id')
        : null
    if (!submissionId) {
      router.replace('/networking/perrenque/verify')
      return
    }

    setLoading(true)
    const result = await guardarFeedbackPerrenque(submissionId, rating)
    setLoading(false)

    if (!result.ok) {
      return
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('perrenque_submission_id')
      sessionStorage.removeItem('perrenque_telefono')
      sessionStorage.removeItem('perrenque_nombre')
      sessionStorage.removeItem('perrenque_ronda_actual')
      localStorage.removeItem('perrenque_submission_id')
      localStorage.removeItem('perrenque_telefono')
      localStorage.removeItem('perrenque_nombre')
      localStorage.removeItem('perrenque_ronda_actual')
    }
    router.push('/networking/perrenque')
  }

  const displayRating = hoverRating || rating

  return (
    <div className="min-h-screen bg-[#1a9fd4] flex flex-col">
      <div className="w-full p-4 border-b-2 border-[#1a1a1a] bg-[#FFD600]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-[#1a1a1a]"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-[2.5px] border-[#1a1a1a] bg-[#FFD600] px-8 py-10 shadow-[5px_5px_0_#1a1a1a] max-w-md w-full"
        >
          <div className="flex flex-col items-center gap-2 mb-8">
            <Image src="/logo.png" alt="" width={28} height={28} className="object-contain shrink-0" />
            <p className="text-[#1a1a1a] text-xl font-black text-center">
              ¿Qué te pareció la dinámica?
            </p>
          </div>

          <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star
                  size={44}
                  className={`transition-colors ${
                    star <= displayRating
                      ? 'fill-[#1a9fd4] text-[#1a9fd4]'
                      : 'fill-transparent text-[#1a1a1a]/25'
                  }`}
                  strokeWidth={1.5}
                />
              </motion.button>
            ))}
          </div>

          <p className="text-[#1a1a1a]/80 text-sm mb-6 text-center font-bold">
            {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona tu calificación'}
          </p>

          <motion.button
            type="button"
            onClick={handleEnviar}
            disabled={rating < 1 || loading}
            className="w-full bg-[#1a1a1a] text-white rounded-full py-3.5 px-6 font-black border-2 border-[#1a1a1a] shadow-[3px_3px_0_#fff] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity [font-family:var(--font-perrenque-bangers),cursive] tracking-wide"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Enviar'
            )}
          </motion.button>

          <p className="text-[#1a1a1a]/70 text-xs text-center max-w-xs mt-8 mx-auto font-semibold">
            Gracias por conectarte en Perrenque Creativo
          </p>
        </motion.div>
      </div>
    </div>
  )
}
