'use client'

import { Menu, LayoutDashboard, Calendar, Clock, Globe, Sun, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-16 min-h-screen bg-pure-dark items-center py-4 gap-6">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Menú"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      <nav className="flex flex-col gap-2">
        <motion.a
          href="/panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-10 h-10 rounded-full bg-red-500 border-2 border-red-500 flex items-center justify-center text-white"
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
        </motion.a>
        <motion.a
          href="/panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="w-10 h-10 rounded-full bg-pure-dark border border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          aria-label="Calendario"
        >
          <Calendar className="w-5 h-5" />
        </motion.a>
        <motion.a
          href="/panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-10 h-10 rounded-full bg-pure-dark border border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          aria-label="Reloj"
        >
          <Clock className="w-5 h-5" />
        </motion.a>
        <motion.a
          href="/panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="w-10 h-10 rounded-full bg-pure-dark border border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          aria-label="Globo"
        >
          <Globe className="w-5 h-5" />
        </motion.a>
        <motion.a
          href="/panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="w-10 h-10 rounded-full bg-pure-dark border border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          aria-label="Sol"
        >
          <Sun className="w-5 h-5" />
        </motion.a>
      </nav>

      <div className="mt-auto">
        <motion.a
          href="/panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="w-10 h-10 rounded-full bg-pure-dark border border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          aria-label="Chat"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.a>
      </div>
    </aside>
  )
}
