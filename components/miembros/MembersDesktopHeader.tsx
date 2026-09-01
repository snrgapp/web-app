'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Search } from 'lucide-react'
import { NotificationsBubble } from './NotificationsBubble'

export function MembersDesktopHeader() {
  const pathname = usePathname()
  const [initials, setInitials] = useState('S')
  const searchPlaceholder = pathname.includes('aprendizaje')
    ? 'Buscar cursos...'
    : pathname.includes('beneficios')
      ? 'Buscar beneficios, herramientas y recursos...'
      : pathname.includes('analitica')
        ? 'Buscar métricas, conexiones...'
        : pathname.includes('upgrade')
          ? 'Buscar en la comunidad...'
          : 'Buscar eventos, founders...'

  useEffect(() => {
    fetch('/api/miembros/auth/session')
      .then((r) => (r.ok ? r.json() : null))
      .then((member) => {
        const name = String(member?.nombre || 'Synergy').trim()
        const letters = name
          .split(/\s+/)
          .slice(0, 2)
          .map((part: string) => part[0]?.toUpperCase() ?? '')
          .join('')
        setInitials(letters || 'S')
      })
      .catch(() => setInitials('S'))
  }, [])

  return (
    <header className="sticky top-0 z-30 hidden h-16 w-full items-center justify-between border-b border-members-border bg-members-surface/90 px-10 backdrop-blur-sm md:flex">
      <div className="max-w-md flex-1">
        <label className="flex h-10 items-center rounded-lg border border-members-border bg-[#080808] px-3 transition-colors focus-within:border-members-primary-container">
          <Search className="mr-2 h-5 w-5 text-members-outline" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="w-full border-none bg-transparent text-sm text-members-on-surface outline-none placeholder:text-members-outline-variant"
          />
        </label>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <NotificationsBubble variant="dark" />
          <button
            type="button"
            className="rounded-lg p-2 text-members-on-surface-variant transition-colors hover:text-members-primary"
            aria-label="Mensajes"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-members-primary-container text-xs font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
