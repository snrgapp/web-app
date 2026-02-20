'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { RankingCard } from '@/components/miembros/RankingCard'
import { LatestConnections } from '@/components/miembros/LatestConnections'
import { ConnectionRecommendations } from '@/components/miembros/ConnectionRecommendations'
import { MiniCalendar } from '@/components/miembros/MiniCalendar'

export default function MiembrosDashboardPage() {
  const [connectionRanking, setConnectionRanking] = useState<{ id: string; nombre: string; count: number }[]>([])
  const [referralRanking, setReferralRanking] = useState<{ id: string; nombre: string; count: number }[]>([])
  const [latestConnections, setLatestConnections] = useState<
    { id: string; nombre: string; empresa: string; email?: string; phone?: string }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/miembros/connections')
      .then((r) => r.json())
      .then((data) => {
        setConnectionRanking(data.connectionRanking || [])
        setReferralRanking(data.referralRanking || [])
        setLatestConnections(data.latestConnections || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Dashboard
        </p>
        <h1 className="text-2xl font-light text-black tracking-tight">
          Bienvenido al panel de miembros
        </h1>
      </div>

      {/* Área superior: carrusel placeholder */}
      <div className="rounded-xl border border-zinc-200 bg-white p-8 flex items-center justify-between min-h-[120px]">
        <button
          type="button"
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center text-zinc-400 text-sm">
          Contenido destacado
        </div>
        <button
          type="button"
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: rankings y recomendaciones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loading ? (
              <>
                <div className="h-40 rounded-xl border border-zinc-200 bg-white animate-pulse" />
                <div className="h-40 rounded-xl border border-zinc-200 bg-white animate-pulse" />
              </>
            ) : (
              <>
                <RankingCard
                  title="Ranking de conexiones"
                  entries={connectionRanking.map((r) => ({ id: r.id, nombre: r.nombre, count: r.count }))}
                />
                <RankingCard
                  title="Ranking de referidos"
                  entries={referralRanking.map((r) => ({ id: r.id, nombre: r.nombre, count: r.count }))}
                />
              </>
            )}
          </div>

          <ConnectionRecommendations />
        </div>

        {/* Columna derecha: calendario y últimas conexiones */}
        <div className="space-y-6">
          <MiniCalendar />
          {loading ? (
            <div className="h-48 rounded-xl border border-zinc-200 bg-white animate-pulse" />
          ) : (
            <LatestConnections connections={latestConnections} />
          )}
        </div>
      </div>
    </div>
  )
}
