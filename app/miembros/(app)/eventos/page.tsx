'use client'

import { useState, useEffect } from 'react'
import { Coffee, CalendarClock, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface MemberEvent {
  id: string
  titulo: string
  descripcion?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  lugar?: string | null
  image_url?: string | null
}

interface CafeInvitation {
  id: string
  tipo: 'cafe_invitado' | 'cafe_aceptado'
  created_at: string
  direccion: 'enviada' | 'recibida'
  nombre: string
  empresa?: string
}

function formatDate(value?: string | null) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function EventosPage() {
  const [events, setEvents] = useState<MemberEvent[]>([])
  const [invitations, setInvitations] = useState<CafeInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/miembros/events').then((r) => r.json()),
      fetch('/api/miembros/cafe-invitations').then((r) => r.json()),
    ])
      .then(([eventsData, invitationsData]) => {
        setEvents(eventsData.events || [])
        setInvitations(invitationsData.invitations || [])
      })
      .catch(() => {
        setEvents([])
        setInvitations([])
      })
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const upcomingEvents = events
    .filter((e) => !e.fecha_inicio || new Date(e.fecha_inicio) >= now)
    .sort((a, b) => {
      const da = a.fecha_inicio ? new Date(a.fecha_inicio).getTime() : Number.MAX_SAFE_INTEGER
      const db = b.fecha_inicio ? new Date(b.fecha_inicio).getTime() : Number.MAX_SAFE_INTEGER
      return da - db
    })

  const shouldScrollInvitations = invitations.length > 3
  const shouldScrollEvents = upcomingEvents.length > 3

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Eventos
        </p>
        <h1 className="text-2xl font-light text-black tracking-tight">
          Tu actividad
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-200 bg-white">
          <div className="p-4 border-b border-zinc-200 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-700">
              Invitaciones de café
            </h2>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-zinc-100 animate-pulse" />
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <p className="p-4 text-zinc-500">Aún no hay invitaciones de café</p>
          ) : (
            <div className={`p-4 space-y-3 ${shouldScrollInvitations ? 'max-h-[330px] overflow-y-auto' : ''}`}>
              {invitations.map((inv) => (
                <div key={inv.id} className="rounded-lg border border-zinc-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-800">{inv.nombre}</p>
                      <p className="text-xs text-zinc-500">{inv.empresa || 'Sin empresa'}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 bg-zinc-100 text-zinc-700">
                      {inv.direccion === 'enviada' ? (
                        <>
                          <ArrowUpRight className="w-3 h-3" />
                          Enviada
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-3 h-3" />
                          Recibida
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {inv.tipo === 'cafe_aceptado' ? 'Invitación aceptada' : 'Invitación pendiente'} • {formatDate(inv.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white">
          <div className="p-4 border-b border-zinc-200 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-700">Próximos eventos</h2>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-zinc-100 animate-pulse" />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <p className="p-4 text-zinc-500">No hay eventos programados</p>
          ) : (
            <div className={`p-4 space-y-3 ${shouldScrollEvents ? 'max-h-[330px] overflow-y-auto' : ''}`}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-lg border border-zinc-200 p-3">
                  <p className="text-sm font-medium text-zinc-800">{event.titulo}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {formatDate(event.fecha_inicio)}
                    {event.lugar ? ` • ${event.lugar}` : ''}
                  </p>
                  {event.descripcion && (
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{event.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
