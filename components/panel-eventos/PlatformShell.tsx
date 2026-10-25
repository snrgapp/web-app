'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  ExternalLink,
  FileText,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { LogoutButton } from '@/components/dashboard/LogoutButton'

const NAV = [
  { href: '/panel', label: 'Eventos', icon: CalendarDays, exact: true },
  { href: '/panel/asistentes', label: 'Asistentes', icon: Users, exact: false },
  { href: '/panel/formularios', label: 'Formularios', icon: FileText, exact: false },
  { href: '/panel/analiticas', label: 'Analíticas', icon: BarChart3, exact: false },
  { href: '/panel/pagos', label: 'Pagos', icon: CreditCard, exact: false },
  { href: '/panel/notificaciones', label: 'Notificaciones', icon: Bell, exact: false },
]

const QueryCtx = createContext<{ q: string; setQ: (v: string) => void }>({ q: '', setQ: () => {} })

export function usePanelQuery() {
  return useContext(QueryCtx)
}

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

function displayName(email: string) {
  const local = email.split('@')[0] ?? ''
  if (!local) return 'Synergy'
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export function PlatformShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [q, setQ] = useState('')
  const nombre = displayName(email)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        document.getElementById('ep-search')?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon
        const active = isActive(pathname, item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
              active ? 'ep-nav-active' : 'text-[var(--ep-muted)] hover:bg-[var(--ep-high)] hover:text-[var(--ep-ink)]'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const brand = (
    <div className="flex flex-col gap-6">
      <Link href="/panel" className="flex items-center gap-2.5 px-2" onClick={() => setOpen(false)}>
        <img src="/logo.png" alt="Synergy" className="h-7 w-auto" />
        <span className="text-[20px] font-semibold tracking-tight">Synergy</span>
      </Link>
      <div className="bg-[var(--ep-low)] rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="" className="h-6 w-6 object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight truncate">Synergy</p>
            <p className="text-[11px] text-[var(--ep-muted)] leading-tight">Eventos</p>
          </div>
        </div>
      </div>
      <Link href="/panel/eventos" onClick={() => setOpen(false)} className="ep-btn ep-btn-primary w-full">
        <Plus className="w-4 h-4" />
        Crear evento
      </Link>
      {nav}
    </div>
  )

  const foot = (
    <div className="flex items-center justify-between px-2 pt-1">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#090a0f] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
          {nombre.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold truncate">{nombre}</p>
          <p className="text-[11px] text-[var(--ep-muted)] truncate">{email || 'sesión activa'}</p>
        </div>
      </div>
      <button type="button" className="text-[var(--ep-muted)]" aria-label="Más opciones" onClick={() => setMenu((v) => !v)}>
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <QueryCtx.Provider value={{ q, setQ }}>
      <div className="ep min-h-dvh">
        <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white z-40 flex-col justify-between py-5 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          {brand}
          <div className="relative flex flex-col gap-3">
            {menu && (
              <div className="absolute bottom-14 left-0 right-0 bg-white rounded-xl shadow-lg p-1.5 z-20">
                <Link href="/panel/ajustes" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--ep-mid)]" onClick={() => setMenu(false)}>
                  <Settings className="w-4 h-4" />
                  Ajustes
                </Link>
                <LogoutButton variant="sidebar" />
              </div>
            )}
            {foot}
          </div>
        </aside>

        <div className="lg:pl-64 min-h-dvh flex flex-col">
          <header className="sticky top-0 z-30 h-16 bg-[var(--ep-bg)]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            <button type="button" className="lg:hidden" aria-label="Menú" onClick={() => setOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-sm">
              <label className="flex items-center gap-2.5 px-3 h-9 rounded-lg bg-[var(--ep-low)] text-[var(--ep-muted)]">
                <Search className="w-4 h-4 shrink-0" />
                <input
                  id="ep-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && pathname !== '/panel' && !pathname.startsWith('/panel/asistentes')) {
                      router.push('/panel/asistentes')
                    }
                  }}
                  placeholder="Buscar eventos, invitados..."
                  className="flex-1 bg-transparent outline-none text-[13px] text-[var(--ep-ink)] placeholder:text-[var(--ep-muted)] min-w-0"
                />
                <kbd className="hidden sm:inline text-[11px] font-semibold bg-[var(--ep-highest)] px-1.5 py-0.5 rounded text-[var(--ep-ink)]">
                  ⌘K
                </kbd>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/eventos"
                className="hidden sm:inline-flex h-9 px-3.5 rounded-lg bg-[var(--ep-low)] hover:bg-[var(--ep-mid)] text-[13px] font-semibold items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Vista pública
              </Link>
              <Link href="/panel/notificaciones" className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--ep-muted)] hover:bg-[var(--ep-high)]" aria-label="Notificaciones">
                <Bell className="w-5 h-5" />
              </Link>
              <Link href="/panel/ajustes" className="w-8 h-8 rounded-full bg-[#090a0f] text-white flex items-center justify-center text-[11px] font-semibold" aria-label="Ajustes">
                {nombre.slice(0, 1).toUpperCase()}
              </Link>
            </div>
          </header>
          <main className="flex-1 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>

        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <button className="absolute inset-0 bg-black/30" aria-label="Cerrar" onClick={() => setOpen(false)} />
            <aside className="relative z-10 w-[min(18rem,88vw)] h-full bg-white flex flex-col justify-between py-5 px-4">
              <div>
                <div className="flex justify-end mb-2">
                  <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {brand}
              </div>
              <div className="space-y-3">
                <Link href="/panel/ajustes" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--ep-muted)]">
                  <Settings className="w-4 h-4" />
                  Ajustes
                </Link>
                {foot}
                <LogoutButton variant="sidebar" />
              </div>
            </aside>
          </div>
        )}
      </div>
    </QueryCtx.Provider>
  )
}
