'use client'

import { useState, useEffect } from 'react'
import { EventCard } from '@/components/miembros/EventCard'
import { MiniCalendar } from '@/components/miembros/MiniCalendar'

interface MemberEvent {
  id: string
  titulo: string
  descripcion?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  lugar?: string | null
  image_url?: string | null
}

export default function EventosPage() {
  const [events, setEvents] = useState<MemberEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/miembros/events')
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
              Eventos
            </p>
            <h1 className="text-2xl font-light text-black tracking-tight">
              Próximos eventos
            </h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl border border-zinc-200 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-zinc-500">No hay eventos programados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-64 flex-shrink-0">
          <MiniCalendar events={events} />
        </div>
      </div>
    </div>
  )
}
