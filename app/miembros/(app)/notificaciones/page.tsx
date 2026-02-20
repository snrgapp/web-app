'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Coffee, Calendar, Megaphone, ChevronRight } from 'lucide-react'

const tipoConfig = {
  cafe_invitado: { icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50' },
  evento_pronto: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  actualizacion: { icon: Megaphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
} as const

interface Notification {
  id: string
  tipo: 'cafe_invitado' | 'evento_pronto' | 'actualizacion'
  titulo: string
  mensaje: string
  link?: string
  created_at: string
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/miembros/notifications')
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Notificaciones
        </p>
        <h1 className="text-2xl font-light text-black tracking-tight">
          Todas tus notificaciones
        </h1>
      </div>

      {loading ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-sm text-zinc-400">Cargando...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-500 mb-4">No tienes notificaciones</p>
          <p className="text-sm text-zinc-400">
            Te avisaremos cuando recibas invitaciones a café, eventos próximos o actualizaciones.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <ul className="divide-y divide-zinc-100">
            {notifications.map((n) => {
              const config = tipoConfig[n.tipo] ?? tipoConfig.actualizacion
              const Icon = config.icon
              const content = (
                <div className="flex items-start gap-3 px-4 py-4 hover:bg-zinc-50 transition-colors">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-800">{n.titulo}</p>
                    <p className="text-sm text-zinc-500 mt-1">{n.mensaje}</p>
                    <p className="text-xs text-zinc-400 mt-2">
                      {new Date(n.created_at).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {n.link && <ChevronRight className="w-5 h-5 text-zinc-400 flex-shrink-0" />}
                </div>
              )
              return (
                <li key={n.id}>
                  {n.link ? (
                    <Link href={n.link}>{content}</Link>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
