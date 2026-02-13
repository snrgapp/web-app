'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Founder } from '@/types/database.types'
import { getFoundersActivos, getVotosDeVotante } from '@/app/actions/spotlight'
import { FounderCard } from '@/components/pitch/FounderCard'
import { VoteForm } from '@/components/pitch/VoteForm'

export default function VotarPage() {
  const router = useRouter()
  const [votanteId, setVotanteId] = useState<string | null>(null)
  const [founders, setFounders] = useState<Founder[]>([])
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null)

  const loadData = useCallback(async (vId: string) => {
    setLoading(true)
    const [foundersData, votosData] = await Promise.all([
      getFoundersActivos(),
      getVotosDeVotante(vId),
    ])
    setFounders(foundersData)
    setVotedIds(new Set(votosData.map((v) => v.founder_id)))
    setLoading(false)
  }, [])

  useEffect(() => {
    const id = localStorage.getItem('votante_id')
    if (!id) {
      router.replace('/pitch')
      return
    }
    setVotanteId(id)
    loadData(id)
  }, [router, loadData])

  function handleVoted(founderId: string) {
    setVotedIds((prev) => new Set(prev).add(founderId))
    setSelectedFounder(null)
  }

  // Vista 2: Formulario de votación
  if (selectedFounder && votanteId) {
    return (
      <VoteForm
        founder={selectedFounder}
        votanteId={votanteId}
        onBack={() => setSelectedFounder(null)}
        onVoted={handleVoted}
      />
    )
  }

  // Vista 1: Lista de founders
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/home')} className="p-1 rounded-lg hover:bg-zinc-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Synergy" width={24} height={24} className="object-contain" />
          <span className="font-bold text-black text-sm">Spotlight</span>
        </div>
      </div>

      <div className="flex-1 px-5 py-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl font-black text-black tracking-tight">Evalúa los pitches</h1>
          <p className="text-sm text-zinc-500 mt-1">Selecciona un founder para votar</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : founders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-zinc-500">No hay founders activos en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {founders.map((founder, index) => (
              <FounderCard
                key={founder.id}
                founder={founder}
                voted={votedIds.has(founder.id)}
                onClick={() => setSelectedFounder(founder)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
