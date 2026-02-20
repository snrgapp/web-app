'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Bell, Coffee, Calendar, Megaphone, ChevronRight } from 'lucide-react'

const MAX_VISIBLE = 3

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

export function NotificationsBubble() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const loadNotifications = useCallback(() => {
    setLoading(true)
    fetch('/api/miembros/notifications')
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    if (open) loadNotifications()
  }, [open, loadNotifications])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  const visible = notifications.slice(0, MAX_VISIBLE)
  const hasMore = notifications.length > MAX_VISIBLE
  const restCount = notifications.length - MAX_VISIBLE

  return (
    <div className="relative" ref={bubbleRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        aria-label="Notificaciones"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-800">Notificaciones</h3>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-zinc-400">Cargando...</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-zinc-400">No hay notificaciones</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {visible.map((n) => {
                  const config = tipoConfig[n.tipo] ?? tipoConfig.actualizacion
                  const Icon = config.icon
                  const content = (
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-zinc-800">{n.titulo}</p>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                      </div>
                      {n.link && <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />}
                    </div>
                  )
                  return (
                    <li key={n.id}>
                      {n.link ? (
                        <Link href={n.link} onClick={() => setOpen(false)}>
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </li>
                  )
                })}
              </ul>
            )}

            {hasMore && (
              <Link
                href="/notificaciones"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-xs font-medium text-amber-600 hover:bg-amber-50 border-t border-zinc-100"
              >
                Más notificaciones ({restCount})
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
