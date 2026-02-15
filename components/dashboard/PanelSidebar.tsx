'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  Database,
  FileText,
  Trophy,
  Star,
  ChevronDown,
  Menu,
  X,
  Settings,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Image from 'next/image'

const navItems = [
  { href: '/panel', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/panel/eventos', icon: Calendar, label: 'Eventos', exact: false },
  { href: '/panel/formularios', icon: FileText, label: 'Formularios', exact: false },
  { href: '/panel/base-datos', icon: Database, label: 'Base de Datos', exact: false },
  { href: '/panel/contacto', icon: MessageCircle, label: 'Mensajes', exact: false },
  { href: '/panel/spotlight', icon: Trophy, label: 'Spotlight', exact: false },
  { href: '/panel/networking-feedback', icon: Star, label: 'Feedback Networking', exact: false },
]

const footerItems = [
  { href: '/panel', icon: Settings, label: 'Configuración' },
  { href: '/contacto', icon: HelpCircle, label: 'Centro de ayuda' },
]

const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_PANEL_EMAIL ?? 'admin@snrg.lat'

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
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors',
        isActive
          ? 'bg-zinc-100 text-black'
          : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0 text-zinc-500" />
      {label}
    </Link>
  )
}

export function PanelSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
          <Image src="/logo.png" alt="Synergy" width={28} height={28} />
          <span className="font-semibold text-black">Panel</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Mobile: Drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-zinc-50 border-r border-zinc-200 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="" width={28} height={28} />
                  <span className="font-semibold text-black">Synergy</span>
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
              <div className="flex-shrink-0 p-4 border-t border-zinc-200 bg-white space-y-1">
                {footerItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-black"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2">
                  <LogoutButton variant="sidebar" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop: Sidebar fijo */}
      <aside className="hidden lg:flex lg:flex-col lg:w-52 lg:flex-shrink-0 lg:border-r lg:border-zinc-200 lg:bg-zinc-50/80">
        <div className="flex flex-col min-h-0 flex-1">
          {/* Cuenta */}
          <div className="p-3 pl-3 pr-4 border-b border-zinc-200 overflow-visible">
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0 overflow-visible">
                <Image src="/logo.png" alt="" width={20} height={20} className="brightness-0 invert" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-xs truncate">Synergy</p>
                <p className="text-[10px] text-zinc-500 truncate">{DEFAULT_EMAIL}</p>
              </div>
              <button
                className="p-0.5 rounded text-zinc-400 hover:bg-zinc-200"
                aria-label="Opciones de cuenta"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navegación principal */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-2 px-2.5">
              Menú
            </p>
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          {/* Tarjeta promocional (opcional) */}
          <div className="mx-3 mb-3 rounded-lg border border-zinc-200 bg-white p-3 relative">
            <span className="absolute top-1.5 right-1.5 text-[9px] font-medium px-1 py-0.5 rounded bg-green-100 text-green-700">
              Nuevo
            </span>
            <p className="font-semibold text-black text-xs mb-0.5">Networking multi-eventos</p>
            <p className="text-[10px] text-zinc-500 mb-2">
              Gestiona varios eventos con QR y check-in independiente.
            </p>
            <Link
              href="/panel/eventos"
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-zinc-700 hover:text-black"
            >
              Ver eventos
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Footer */}
          <div className="p-3 pt-0 space-y-0.5 border-t border-zinc-200">
            {footerItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-black hover:bg-zinc-100"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <div className="mt-2">
              <LogoutButton variant="sidebar" />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
