'use client'

import { motion } from 'framer-motion'
import { Sparkles, Phone, MapPin } from 'lucide-react'
import type { GeniusConexionUsuario } from '@/app/actions/genius-networking'

function whatsappPhoneParam(raw: string | null | undefined): string | null {
  if (!raw) return null
  const d = raw.replace(/\D/g, '')
  if (d.length < 7) return null
  return d.startsWith('57') ? d : `57${d}`
}

interface GeniusPersonCardProps {
  person: GeniusConexionUsuario
  index?: number
}

export function GeniusPersonCard({ person, index = 0 }: GeniusPersonCardProps) {
  const waParam = whatsappPhoneParam(person.telefono)
  const whatsappHref = waParam ? `https://api.whatsapp.com/send?phone=${waParam}` : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      className="rounded-[22px] border border-white/[0.12] bg-white/[0.04] px-4 py-4 shadow-[6px_6px_0_#daff00]"
    >
      <div className="flex flex-col gap-3">
        <div>
          <h3
            className="text-lg font-black leading-tight text-[#694aff]"
            style={{ fontFamily: 'var(--font-fraunces-genius), serif' }}
          >
            {person.nombreCompleto}
          </h3>
          <div className="mt-2 h-px w-3/5 bg-[#694aff]/35" />
        </div>

        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#daff00]" strokeWidth={2} />
          <p className="min-w-0 text-sm font-medium text-white/85">{person.identidad}</p>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#694aff]" strokeWidth={2} />
          <p className="min-w-0 text-xs font-light leading-snug text-white/65">{person.mundo}</p>
        </div>

        <p className="border-l-2 border-[#694aff]/50 pl-3 text-xs font-light italic leading-relaxed text-white/55">
          “{person.valorHumano.length > 140 ? `${person.valorHumano.slice(0, 137)}…` : person.valorHumano}”
        </p>

        {whatsappHref ? (
          <div className="flex items-center gap-2 pt-1">
            <Phone className="h-4 w-4 shrink-0 text-[#694aff]" strokeWidth={2} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-xs font-medium text-[#694aff] underline decoration-[#daff00]/80 underline-offset-2 hover:text-[#8c74ff]"
              onClick={(e) => e.stopPropagation()}
            >
              WhatsApp
            </a>
          </div>
        ) : null}

        <p
          className="text-[0.68rem] uppercase tracking-[0.15em] text-white/35"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Conexión sugerida
        </p>
      </div>
    </motion.article>
  )
}
