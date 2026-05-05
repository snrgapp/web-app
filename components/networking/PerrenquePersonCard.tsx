'use client'

import { motion } from 'framer-motion'
import { User, Sparkles, Phone, CheckCircle } from 'lucide-react'
import type { PerrenqueConectaSubmission } from '@/types/database.types'

/** Dígitos para api.whatsapp.com; Colombia 57 si no viene en el valor guardado. */
function whatsappPhoneParam(raw: string | null | undefined): string | null {
  if (!raw) return null
  const d = raw.replace(/\D/g, '')
  if (d.length < 7) return null
  return d.startsWith('57') ? d : `57${d}`
}

interface PerrenquePersonCardProps {
  submission: PerrenqueConectaSubmission
  index?: number
}

export function PerrenquePersonCard({ submission, index = 0 }: PerrenquePersonCardProps) {
  const telefono = submission.telefono || null
  const waParam = whatsappPhoneParam(telefono)
  const whatsappHref = waParam ? `https://api.whatsapp.com/send?phone=${waParam}` : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      className="relative rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-[#FFD600] px-4 py-3 shadow-[3px_3px_0_#1a1a1a]"
    >
      <div className="absolute right-3 top-3">
        <CheckCircle className="h-5 w-5 text-[#1a1a1a]" strokeWidth={1.5} fill="none" />
      </div>

      <div className="space-y-2 pr-6">
        <div className="flex items-start gap-2">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-[#1a1a1a] text-sm md:text-base leading-tight truncate">
              {submission.nombre_completo}
            </p>
            <div className="mt-1 h-px w-2/3 bg-[#1a1a1a]/30" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-[#1a9fd4]" strokeWidth={2} />
          <p className="text-[#1a1a1a] text-xs md:text-sm truncate">{submission.identidad}</p>
        </div>

        {telefono && whatsappHref && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-[#1a1a1a]" strokeWidth={2} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] text-xs md:text-sm hover:underline truncate font-bold"
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
