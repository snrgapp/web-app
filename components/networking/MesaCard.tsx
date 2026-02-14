'use client'

import { motion } from 'framer-motion'
import { User, Building2, Phone, CheckCircle } from 'lucide-react'
import type { Asistente } from '@/types/database.types'

interface MesaCardProps {
  asistente: Asistente
  index?: number
}

export function MesaCard({ asistente, index = 0 }: MesaCardProps) {
  const nombreCompleto =
    [asistente.nombre, asistente.apellido].filter(Boolean).join(' ') || 'Sin nombre'
  const empresa = asistente.empresa || 'Sin empresa'
  const telefono = asistente.telefono || null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      className="relative rounded-[24px] border border-[#E0E0E0] bg-[#F8F7F5] px-4 py-3 shadow-none"
    >
      {/* Icono verificado - esquina superior derecha */}
      <div className="absolute right-3 top-3">
        <CheckCircle className="h-5 w-5 text-[#262626]" strokeWidth={1.5} fill="none" />
      </div>

      {/* Contenido principal */}
      <div className="space-y-2 pr-6">
        {/* Nombre con icono */}
        <div className="flex items-start gap-2">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-[#262626]" strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[#262626] text-sm md:text-base leading-tight truncate">
              {nombreCompleto}
            </p>
            <div className="mt-1 h-px w-2/3 bg-[#A0A0A0]" />
          </div>
        </div>

        {/* Empresa con icono */}
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-[#262626]" strokeWidth={1.5} />
          <p className="text-[#262626] text-xs md:text-sm truncate">{empresa}</p>
        </div>

        {/* Teléfono con icono - visible y destacado */}
        {telefono && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-[#262626]" strokeWidth={1.5} />
            <a
              href={`tel:${telefono}`}
              className="text-[#262626] text-xs md:text-sm hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {telefono}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}
