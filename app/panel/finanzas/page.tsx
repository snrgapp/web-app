'use client'

import { motion } from 'framer-motion'

export default function FinanzasPage() {
  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          FINANZAS
        </p>
        <h1 className="text-2xl sm:text-3xl font-hero text-black">
          Finanzas
        </h1>
        <p className="mt-4 text-zinc-500">
          Sección de finanzas. Se conectará con la base de datos próximamente.
        </p>
      </motion.div>
    </div>
  )
}
