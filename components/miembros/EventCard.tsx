'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

interface MemberEvent {
  id: string
  titulo: string
  descripcion?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  lugar?: string | null
  image_url?: string | null
}

interface EventCardProps {
  event: MemberEvent
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('es', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function EventCard({ event }: EventCardProps) {
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch(`/api/miembros/events/${event.id}/attendance`)
      .then((r) => r.json())
      .then((data) => setRegistered(data.registered))
      .catch(() => setRegistered(false))
      .finally(() => setChecking(false))
  }, [event.id])

  async function handleRegister() {
    if (registered || loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/miembros/events/${event.id}/register`, {
        method: 'POST',
      })
      if (res.ok) setRegistered(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      {event.image_url && (
        <div className="relative h-40 bg-zinc-200 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image_url}
            alt={event.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <h3 className="font-semibold text-zinc-800">{event.titulo}</h3>
        {event.fecha_inicio && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Calendar className="w-4 h-4" />
            {formatDate(event.fecha_inicio)}
          </div>
        )}
        {event.lugar && (
          <p className="text-sm text-zinc-500">{event.lugar}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {event.descripcion && (
          <p className="text-sm text-zinc-600 line-clamp-2">{event.descripcion}</p>
        )}
        {!checking && (
          <Button
            onClick={handleRegister}
            disabled={registered || loading}
            variant={registered ? 'secondary' : 'default'}
          >
            {registered ? 'Registrado' : loading ? 'Registrando...' : 'Registrarme'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
