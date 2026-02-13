'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, MessageCircle, Database, Search, ChevronDown, FileText, Trophy } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/panel', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/panel/eventos', icon: Calendar, label: 'Eventos', exact: false },
  { href: '/panel/formularios', icon: FileText, label: 'Formularios', exact: false },
  { href: '/panel/base-datos', icon: Database, label: 'Base de Datos', exact: false },
  { href: '/panel/contacto', icon: MessageCircle, label: 'Mensajes', exact: false },
  { href: '/panel/spotlight', icon: Trophy, label: 'Spotlight', exact: false },
]

export function DashboardTopNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  'relative p-2 rounded-lg transition-colors',
                  isActive ? 'text-black bg-zinc-100' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                )}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm font-medium text-black">
              Jesus Prieto
            </span>
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-medium text-zinc-600">
              JP
            </div>
            <button
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Menú usuario"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
