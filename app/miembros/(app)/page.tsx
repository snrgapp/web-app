'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LatestConnections } from '@/components/miembros/LatestConnections'
import { ConnectionRecommendations } from '@/components/miembros/ConnectionRecommendations'
import { MiniCalendar } from '@/components/miembros/MiniCalendar'

export default function MiembrosDashboardPage() {
  const [latestConnections, setLatestConnections] = useState<
    { id: string; nombre: string; empresa: string; email?: string; phone?: string }[]
  >([])
  const [events, setEvents] = useState<{ fecha_inicio?: string | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/miembros/connections')
      .then((r) => r.json())
      .then((data) => {
        setLatestConnections(data.latestConnections || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/miembros/events')
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => {})
  }, [])

  return (
    <div className="p-4 lg:p-6 pt-2 lg:pt-4 max-w-7xl mx-auto">
      {/* Fila superior: carrusel + calendario */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white p-6 flex items-center justify-between min-h-[120px]">
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
        <div className="lg:w-80 flex-shrink-0">
          <MiniCalendar events={events} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recomendaciones de conexión (elevada, más espacio) */}
        <div className="lg:col-span-2">
          <ConnectionRecommendations />
        </div>

        {/* Últimas conexiones */}
        <div>
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
