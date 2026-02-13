'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Founder } from '@/types/database.types'
import { StarRating } from './StarRating'
import { guardarVoto } from '@/app/actions/spotlight'
import { Button } from '@/components/ui/button'

interface VoteFormProps {
  founder: Founder
  votanteId: string
  onBack: () => void
  onVoted: (founderId: string) => void
}

const CRITERIOS = [
  {
    key: 'score_innovacion' as const,
    label: '¿Qué tan disruptiva es la solución?',
    tag: 'Innovación',
  },
  {
    key: 'score_claridad' as const,
    label: '¿Se entendió el problema y el modelo de negocio?',
    tag: 'Claridad',
  },
  {
    key: 'score_qa' as const,
    label: '¿Las respuestas fueron sólidas y directas?',
    tag: 'Q&A',
  },
]

export function VoteForm({ founder, votanteId, onBack, onVoted }: VoteFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({
    score_innovacion: 0,
    score_claridad: 0,
    score_qa: 0,
  })
  const [loading, setLoading] = useState(false)
  const [showGracias, setShowGracias] = useState(false)
  const [error, setError] = useState('')

  const allRated = scores.score_innovacion > 0 && scores.score_claridad > 0 && scores.score_qa > 0

  async function handleSubmit() {
    if (!allRated) return
    setLoading(true)
    setError('')

    const result = await guardarVoto(votanteId, founder.id, {
      score_innovacion: scores.score_innovacion,
      score_claridad: scores.score_claridad,
      score_qa: scores.score_qa,
    })

    setLoading(false)

    if (!result.ok) {
      setError(result.error ?? 'Error al guardar el voto.')
      return
    }

    setShowGracias(true)
    setTimeout(() => {
      onVoted(founder.id)
    }, 2500)
  }

  if (showGracias) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-xl font-bold text-black text-center">¡Gracias por votar!</h2>
        <p className="text-sm text-zinc-500 text-center">Sigue disfrutando del evento</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col min-h-screen bg-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-zinc-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <span className="font-semibold text-black text-sm">Evaluar Pitch</span>
      </div>

      <div className="flex-1 px-5 py-6 space-y-6 max-w-lg mx-auto w-full">
        {/* Founder info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
            {founder.image_url ? (
              <Image
                src={founder.image_url}
                alt={founder.nombre}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-400">
                {founder.nombre.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-black">{founder.nombre}</p>
            <p className="text-sm text-zinc-500">{founder.startup_nombre}</p>
          </div>
        </div>

        {/* Criterios */}
        <div className="space-y-5">
          {CRITERIOS.map((criterio) => (
            <div key={criterio.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                  {criterio.tag}
                </span>
              </div>
              <p className="text-sm font-medium text-black">{criterio.label}</p>
              <StarRating
                value={scores[criterio.key]}
                onChange={(val) => setScores((prev) => ({ ...prev, [criterio.key]: val }))}
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!allRated || loading}
          className="w-full h-12 text-base font-semibold rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Guardar Voto'
          )}
        </Button>
      </div>
    </motion.div>
  )
}
