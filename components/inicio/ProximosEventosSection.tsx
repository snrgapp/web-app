'use client'

import { motion } from 'framer-motion'

export default function ProximosEventosSection() {
  return (
    <section className="px-4 lg:px-20 py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] lowercase">
          próximos eventos
        </h2>
        {/* Placeholder para futuros eventos */}
        <div className="mt-8 text-[#1a1a1a]/60 text-sm">
          Próximamente
        </div>
      </motion.div>
    </section>
  )
}
