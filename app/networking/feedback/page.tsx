'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Star, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { guardarFeedbackNetworking } from '@/app/actions/networking'

export default function NetworkingFeedbackPage() {
  const router = useRouter()
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const asistenteId = sessionStorage.getItem('asistente_id') ?? localStorage.getItem('asistente_id')
    if (!asistenteId) {
      router.replace('/networking/verify')
    }
  }, [router])

  async function handleEnviar() {
    if (rating < 1 || rating > 5) return

    const asistenteId = typeof window !== 'undefined' ? (sessionStorage.getItem('asistente_id') ?? localStorage.getItem('asistente_id')) : null
    if (!asistenteId) {
      router.replace('/networking/verify')
      return
    }

    setLoading(true)
    const result = await guardarFeedbackNetworking(asistenteId, rating)
    setLoading(false)

    if (!result.ok) {
      return
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('asistente_id')
      sessionStorage.removeItem('asistente_telefono')
      sessionStorage.removeItem('asistente_nombre')
      sessionStorage.removeItem('evento_id')
      sessionStorage.removeItem('networking_ronda_actual')
      localStorage.removeItem('asistente_id')
      localStorage.removeItem('asistente_telefono')
      localStorage.removeItem('asistente_nombre')
      localStorage.removeItem('networking_ronda_actual')
    }
    router.push('/networking')
  }

  const displayRating = hoverRating || rating

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft size={24} className="text-black" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image src="/logo.png" alt="" width={24} height={24} className="object-contain shrink-0" />
          <p className="text-black text-xl font-medium text-center">
            ¿Qué te pareció la dinámica?
          </p>
        </div>

        <div className="flex gap-2 mb-10">
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
                size={48}
                className={`transition-colors ${
                  star <= displayRating
                    ? 'fill-[#FFE100] text-[#FFE100]'
                    : 'fill-transparent text-zinc-300'
                }`}
                strokeWidth={1.5}
              />
            </motion.button>
          ))}
        </div>

        <p className="text-zinc-500 text-sm mb-6">
          {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona tu calificación'}
        </p>

        <motion.button
          onClick={handleEnviar}
          disabled={rating < 1 || loading}
          className="w-full max-w-xs bg-black text-white rounded-full py-3.5 px-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Enviar'
          )}
        </motion.button>

        <p className="text-gray-500 text-xs text-center max-w-xs mt-8">
          nos alegra haber ayudado en tu experiencia de conexión
        </p>
      </div>
    </div>
  )
}
