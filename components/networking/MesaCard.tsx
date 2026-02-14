'use client'

import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import type { Asistente } from '@/types/database.types'

interface MesaCardProps {
  asistente: Asistente
  index?: number
}

function getInitials(nombre: string | null, apellido: string | null): string {
  const n = (nombre ?? '').trim().charAt(0)
  const a = (apellido ?? '').trim().charAt(0)
  if (n && a) return `${n}${a}`.toUpperCase()
  if (n) return n.toUpperCase()
  if (a) return a.toUpperCase()
  return '?'
}

export function MesaCard({ asistente, index = 0 }: MesaCardProps) {
  const nombreCompleto = [asistente.nombre, asistente.apellido].filter(Boolean).join(' ') || 'Sin nombre'
  const empresa = asistente.empresa || 'Sin empresa'
  const initials = getInitials(asistente.nombre, asistente.apellido)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      className="flex w-full items-center gap-4 rounded-[24px] border border-zinc-300/80 bg-black px-4 py-3.5 shadow-md"
    >
      {/* Avatar - círculo blanco con iniciales negras */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-base font-bold text-black">
        {initials}
      </div>

      {/* Texto - nombre amarillo, empresa blanco */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-[#FFE100]">{nombreCompleto}</p>
        <p className="mt-0.5 truncate text-sm font-normal text-white">{empresa}</p>
      </div>

      {/* Icono guardar - círculo blanco con icono negro */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
        <Bookmark className="h-5 w-5 text-black" strokeWidth={2} fill="none" />
      </div>
    </motion.div>
  )
}
