'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Star } from 'lucide-react'
import { guardarHackathonNetworkingFeedback } from '@/app/actions/hackathon-networking'

const STORAGE_KEY = 'hackathon_submission_id'

function clearHackathonNetworkingSession(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_KEY)
}

function HackathonFeedbackContent() {
  const router = useRouter()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const sid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY)
        : null
    if (!sid) {
      router.replace('/networking/hackathon/verify')
      return
    }
    setSubmissionId(sid)
  }, [router])

  async function handleEnviar() {
    if (rating < 1 || rating > 5 || !submissionId) return
    setLoading(true)
    setError('')
    const c = comment.trim()
    const res = await guardarHackathonNetworkingFeedback(submissionId, rating, c ? c : null)
    setLoading(false)
    if (!res.ok) {
      setError(res.error ?? 'No se pudo enviar.')
      return
    }
    clearHackathonNetworkingSession()
    router.replace('/networking/hackathon/verify')
  }

  const displayRating = hoverRating || rating

  if (!submissionId) {
    return (
      <div className="hackathon-app-root flex min-h-dvh items-center justify-center bg-[#08080C]">
        <Loader2 className="h-8 w-8 animate-spin text-[#A87CFF]" />
      </div>
    )
  }

  return (
    <div className="hackathon-app-root role-purple min-h-dvh bg-[#08080C] text-white">
      <div className="ha-noise" />
      <header className="relative z-20 flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          type="button"
          className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
          aria-label="Volver"
          onClick={() => router.push('/networking/hackathon')}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
          Feedback
        </span>
      </header>

      <div className="relative z-10 mx-auto flex max-w-md flex-col px-6 pb-32 pt-4">
        <p className="text-center text-lg font-black tracking-tight text-white">
          ¿Qué tal el meet &amp; greet?
        </p>
        <p className="mx-auto mt-2 max-w-sm text-center text-xs leading-relaxed text-white/45">
          Tu nota nos ayuda a mejorar la dinámica. Al enviar cerrarás esta sesión y podrás verificar otro acceso si
          hace falta.
        </p>

        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B35FF]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${star} de 5 estrellas`}
            >
              <Star
                size={44}
                className={`transition-colors ${
                  star <= displayRating
                    ? 'fill-[#FFD60A] text-[#FFD60A]'
                    : 'fill-transparent text-white/20'
                }`}
                strokeWidth={1.4}
              />
            </motion.button>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-white/40">
          {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona una calificación'}
        </p>

        <label className="mt-8">
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
            Comentario (opcional)
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="¿Algo que destacarías?"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white placeholder:text-white/22 focus:border-[#7B35FF]/50 focus:outline-none focus:ring-1 focus:ring-[#7B35FF]/30"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}

        <motion.button
          type="button"
          onClick={() => void handleEnviar()}
          disabled={rating < 1 || loading}
          className="mx-auto mt-8 flex h-12 w-full max-w-xs items-center justify-center rounded-xl bg-[#7B35FF] text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_32px_rgba(123,53,255,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          whileTap={{ scale: rating < 1 || loading ? 1 : 0.98 }}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar y salir'}
        </motion.button>
      </div>
    </div>
  )
}

export default function HackathonNetworkingFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#08080C]">
          <Loader2 className="h-9 w-9 animate-spin text-[#A87CFF]" />
        </div>
      }
    >
      <HackathonFeedbackContent />
    </Suspense>
  )
}
