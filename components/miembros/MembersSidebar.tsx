'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  Lightbulb,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/red-contactos', icon: Users, label: 'Red', exact: false },
  { href: '/eventos', icon: Calendar, label: 'Eventos', exact: false },
  { href: '/recursos', icon: FolderOpen, label: 'Recursos', exact: false },
  { href: '/asesorias', icon: Lightbulb, label: 'Asesorías', exact: false },
  { href: '/beneficios', icon: Gift, label: 'Beneficios', exact: false },
]

const footerItems = [
  { href: '/configuracion', icon: Settings, label: 'Configuración' },
  { href: '/contacto', icon: HelpCircle, label: 'Centro de ayuda' },
]

function NavLink({
  href,
  icon: Icon,
  label,
  exact,
  onClick,
}: {
  href: string
  icon: React.ElementType
  label: string
  exact: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-light transition-colors',
        isActive
          ? 'bg-amber-100 text-amber-900'
          : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 flex-shrink-0" />
        {label}
      </div>
      {isActive && <ChevronRight className="w-4 h-4" />}
    </Link>
  )
}

async function doLogout() {
  await fetch('/api/miembros/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}

export function MembersSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [member, setMember] = useState<{ nombre?: string | null; phone?: string } | null>(null)

  useEffect(() => {
    fetch('/api/miembros/auth/session')
      .then((r) => (r.ok ? r.json() : null))
      .then(setMember)
      .catch(() => setMember(null))
  }, [])

  const fullName = member?.nombre || 'miembro'
  const firstName = fullName.split(/\s+/)[0] || 'miembro'

  return (
    <>
      {/* Mobile: Header con hamburger */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-white border-b border-zinc-200">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Snergy" width={28} height={28} />
          <span className="font-semibold text-black">Snergy</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Mobile: Drawer overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-zinc-200 flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="" width={28} height={28} />
                <span className="font-semibold text-black">Snergy</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
            <div className="p-4 border-t border-zinc-200 space-y-1">
              {footerItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-light text-zinc-600 hover:text-black hover:bg-zinc-50"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => { doLogout(); setMobileOpen(false) }}
                className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-light text-zinc-600 hover:text-black hover:bg-zinc-50"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Desktop: Sidebar fijo */}
      <aside className="hidden lg:flex lg:flex-col lg:w-44 lg:flex-shrink-0 lg:border-r lg:border-zinc-200 lg:bg-white">
        <div className="flex flex-col min-h-0 flex-1">
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-medium text-sm">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-light text-black">Hola, {firstName}</p>
                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-0.5"
                  aria-label="Editar perfil"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          <div className="p-3 pt-0 space-y-0.5 border-t border-zinc-200">
            {footerItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-light text-zinc-600 hover:text-black hover:bg-zinc-50"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={doLogout}
              className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-light text-zinc-600 hover:text-black hover:bg-zinc-50"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
