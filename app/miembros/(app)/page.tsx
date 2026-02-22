'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm font-light text-zinc-600">lo bueno toma tiempo</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 pt-2 lg:pt-4 max-w-7xl mx-auto">
      {/* Fila superior: carrusel + calendario */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="members-fade-in flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white p-6 flex items-center justify-between min-h-[120px] transition-all duration-300 ease-out">
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
        <div className="members-fade-in members-fade-in-delay-1 lg:w-80 flex-shrink-0 transition-all duration-300 ease-out">
          <MiniCalendar events={events} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recomendaciones de conexión (elevada, más espacio) */}
        <div className="members-fade-in members-fade-in-delay-2 lg:col-span-2 transition-all duration-300 ease-out">
          <ConnectionRecommendations />
        </div>

        {/* Últimas conexiones */}
        <div className="members-fade-in members-fade-in-delay-3 transition-all duration-300 ease-out">
          <LatestConnections connections={latestConnections} />
        </div>
      </div>
    </div>
  )
}
