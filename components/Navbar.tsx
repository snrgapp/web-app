'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Ticket, Mail, UserPlus } from 'lucide-react'

const navLinks = [
  { href: '/inicio#unete-red', label: 'únete a la red', icon: UserPlus },
  { href: '/eventos', label: 'eventos', icon: Ticket },
  { href: '/contacto', label: 'contacto', icon: Mail },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#f2f2f2]/95 backdrop-blur-sm border-b border-black/5"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/inicio" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Synergy"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </Link>

          {/* Desktop: enlaces a la derecha del logo */}
          <div className="hidden min-w-0 items-center gap-6 md:flex lg:gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon
              const className =
                'flex items-center gap-2 text-sm font-light text-[#1a1a1a] lowercase tracking-wide hover:text-black/70 transition-colors'
              if (link.href.includes('#')) {
                return (
                  <a key={link.href} href={link.href} className={className}>
                    <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.35} aria-hidden />
                    {link.label}
                  </a>
                )
              }
              return (
                <Link key={link.href} href={link.href} className={className}>
                  <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.35} aria-hidden />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile: botón hamburguesa */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-2 rounded-lg text-[#1a1a1a] hover:bg-black/5 transition-colors"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile: menú desplegable */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#f2f2f2] border-t border-black/5"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const className =
                  'flex items-center gap-2 py-3 px-2 text-base font-light text-[#1a1a1a] lowercase tracking-wide hover:bg-black/5 rounded-lg transition-colors'
                if (link.href.includes('#')) {
                  return (
                    <a key={link.href} href={link.href} onClick={closeMenu} className={className}>
                      <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.35} aria-hidden />
                      {link.label}
                    </a>
                  )
                }
                return (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className={className}>
                    <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.35} aria-hidden />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
