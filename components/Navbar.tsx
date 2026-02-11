'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Ticket, Mail } from 'lucide-react'

const navLinks = [
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/inicio" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Synergy"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </Link>

        {/* Desktop: enlaces horizontales */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] lowercase hover:text-black/80 transition-colors"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            )
          })}
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
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-2 py-3 px-2 text-base font-medium text-[#1a1a1a] lowercase hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
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
