'use client'

import { motion } from 'framer-motion'
import { User, Building2, Phone, CheckCircle } from 'lucide-react'
import type { Asistente } from '@/types/database.types'

interface MesaCardProps {
  asistente: Asistente
  index?: number
}

function whatsappHref(telefono: string): string {
  const digits = telefono.replace(/\D/g, '')
  return `https://wa.me/${digits}`
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
      className="relative w-full rounded-2xl border border-white/10 bg-[#1a1a1c] px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="absolute right-4 top-4">
        <CheckCircle className="h-5 w-5 text-zinc-400" strokeWidth={1.5} fill="none" />
      </div>

      <div className="flex flex-row items-center gap-4 pr-9 sm:gap-8 sm:pr-10">
        <div className="flex min-w-0 flex-[1.2] items-start gap-2">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-white sm:text-base">
              {nombreCompleto}
            </p>
            <div className="mt-1.5 h-px w-14 bg-zinc-600" />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-zinc-300" strokeWidth={1.5} />
          <p className="truncate text-xs text-zinc-300 sm:text-sm">{empresa}</p>
        </div>

        {telefono && (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-zinc-300" strokeWidth={1.5} />
            <a
              href={whatsappHref(telefono)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-xs text-zinc-200 underline-offset-2 hover:text-white hover:underline sm:text-sm"
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
