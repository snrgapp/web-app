'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ChevronDown, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/panel', label: 'Dashboard' },
  { href: '/panel/finanzas', label: 'Finanzas' },
  { href: '/panel/base-datos', label: 'Base de Datos' },
]

export function DashboardTopNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
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
            <button
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Modo oscuro"
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
