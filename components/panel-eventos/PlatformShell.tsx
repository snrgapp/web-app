'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  FileText,
  Plus,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { LogoutButton } from '@/components/dashboard/LogoutButton'

const NAV = [
  { href: '/panel', label: 'Eventos', icon: LayoutDashboard, exact: true },
  { href: '/panel/eventos', label: 'Crear / listar', icon: Calendar, exact: false },
  { href: '/panel/asistentes', label: 'Asistentes', icon: Users, exact: false },
  { href: '/panel/formularios', label: 'Formularios', icon: FileText, exact: false },
  { href: '/panel/analiticas', label: 'Analíticas', icon: BarChart3, exact: false },
  { href: '/panel/pagos', label: 'Pagos', icon: CreditCard, exact: false },
  { href: '/panel/notificaciones', label: 'Notificaciones', icon: Bell, exact: false },
  { href: '/panel/ajustes', label: 'Ajustes', icon: Settings, exact: false },
]

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[var(--ep-sidebar-muted)]">
        Ticketing Live
      </p>
      {NAV.map((item) => {
        const Icon = item.icon
        const active = isActive(pathname, item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm ${
              active ? 'ep-nav-active' : 'text-[var(--ep-sidebar-muted)] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="ep min-h-dvh flex">
      <aside className="hidden md:flex w-56 lg:w-60 flex-col bg-[var(--ep-sidebar)] text-[var(--ep-sidebar-fg)] shrink-0">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <Image src="/logowhite.png" alt="Synergy" width={32} height={32} className="object-contain" />
          <div>
            <p className="text-sm font-semibold">Synergy</p>
            <p className="text-[10px] text-[var(--ep-sidebar-muted)]">Gestión de eventos</p>
          </div>
        </div>
        {nav}
        <div className="p-4 border-t border-white/10">
          <Link href="/panel/eventos" className="ep-btn ep-btn-accent w-full">
            <Plus className="w-4 h-4" />
            Crear evento
          </Link>
            <div className="mt-3 [&_button]:text-white/70 [&_button:hover]:text-white [&_button:hover]:bg-white/10">
            <LogoutButton variant="sidebar" />
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[var(--ep-sidebar)] text-white">
          <button type="button" onClick={() => setOpen(true)} aria-label="Menú">
            <Menu className="w-6 h-6" />
          </button>
          <Image src="/logowhite.png" alt="Synergy" width={28} height={28} />
          <Link href="/panel/eventos" aria-label="Crear evento">
            <Plus className="w-6 h-6" />
          </Link>
        </header>
        {open && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="relative z-10 w-[min(18rem,86vw)] max-h-dvh bg-[var(--ep-sidebar)] text-white flex flex-col">
              <div className="flex items-center justify-between px-4 h-14 shrink-0">
                <Image src="/logowhite.png" alt="Synergy" width={28} height={28} />
                <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {nav}
              <div className="p-4 border-t border-white/10 space-y-2">
                <Link href="/panel/eventos" onClick={() => setOpen(false)} className="ep-btn ep-btn-accent w-full">
                  <Plus className="w-4 h-4" />
                  Crear evento
                </Link>
                <div className="[&_button]:text-white/70">
                  <LogoutButton variant="sidebar" />
                </div>
              </div>
            </aside>
          </div>
        )}
        <div className="flex-1 min-w-0 overflow-x-clip overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
