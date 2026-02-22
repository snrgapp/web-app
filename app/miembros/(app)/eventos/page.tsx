'use client'

import { useState, useEffect } from 'react'
import { Coffee, CalendarClock, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface UpcomingOrgEvent {
  id: string
  titulo?: string | null
  fecha?: string | null
  ciudad?: string | null
  checkin_slug?: string | null
  link?: string | null
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

function formatEventDate(value?: string | null) {
  if (!value) return 'Sin fecha'
  const d = new Date(`${value}T12:00:00`)
  return d.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventosPage() {
  const [upcomingOrgEvents, setUpcomingOrgEvents] = useState<UpcomingOrgEvent[]>([])
  const [invitations, setInvitations] = useState<CafeInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/miembros/upcoming-eventos').then((r) => {
        if (r.status === 401) window.location.href = '/login'
        return r.json()
      }),
      fetch('/api/miembros/cafe-invitations').then((r) => {
        if (r.status === 401) window.location.href = '/login'
        return r.json()
      }),
    ])
      .then(([upcomingEventsData, invitationsData]) => {
        setUpcomingOrgEvents(upcomingEventsData?.events || [])
        setInvitations(invitationsData?.invitations || [])
      })
      .catch(() => {
        setUpcomingOrgEvents([])
        setInvitations([])
      })
      .finally(() => setLoading(false))
  }, [])

  const shouldScrollInvitations = invitations.length > 3
  const shouldScrollEvents = upcomingOrgEvents.length > 3

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-3">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Eventos
        </p>
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
          ) : upcomingOrgEvents.length === 0 ? (
            <p className="p-4 text-zinc-500">No hay eventos programados</p>
          ) : (
            <div className={`p-4 space-y-3 ${shouldScrollEvents ? 'max-h-[330px] overflow-y-auto' : ''}`}>
              {upcomingOrgEvents.map((event) => (
                <div key={event.id} className="rounded-lg border border-zinc-200 p-3">
                  <p className="text-sm font-medium text-zinc-800">{event.titulo || 'Evento'}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {formatEventDate(event.fecha)}
                    {event.ciudad ? ` • ${event.ciudad}` : ''}
                  </p>
                  {(event.checkin_slug || event.link) && (
                    <a
                      href={event.checkin_slug ? `/evento/${event.checkin_slug}` : (event.link || '#')}
                      target={event.checkin_slug ? '_self' : '_blank'}
                      rel={event.checkin_slug ? undefined : 'noopener noreferrer'}
                      className="mt-2 inline-block text-xs text-zinc-700 underline hover:text-black"
                    >
                      Ver evento
                    </a>
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
