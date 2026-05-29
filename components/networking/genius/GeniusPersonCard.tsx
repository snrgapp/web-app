'use client'

import { motion } from 'framer-motion'
import { Sparkles, Phone, MapPin } from 'lucide-react'
import { registrarWaClick } from '@/app/actions/genius-networking'
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
  miNombre?: string
  miSubmissionId?: string
  ronda?: 1 | 2
}

export function GeniusPersonCard({ person, index = 0, miNombre = '', miSubmissionId, ronda = 1 }: GeniusPersonCardProps) {
  const waParam = whatsappPhoneParam(person.telefono)
  const waMessage = `Hola estoy en Genius Fest y me gustaria conectar contigo. Me llamo ${miNombre || 'un asistente'}. ¿Donde te encuentas?☺️`
  const whatsappHref = waParam
    ? `https://api.whatsapp.com/send?phone=${waParam}&text=${encodeURIComponent(waMessage)}`
    : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      className="rounded-[22px] border border-white/10 bg-[#1c1c1c] px-4 py-4 text-center shadow-[6px_6px_0_#694aff] sm:text-left"
    >
      <div className="flex flex-col gap-3">
        <div>
          <h3
            className="text-lg font-black leading-tight text-white"
            style={{ fontFamily: 'var(--font-fraunces-genius), serif' }}
          >
            {person.nombreCompleto}
          </h3>
          <div className="mx-auto mt-2 h-px w-3/5 bg-white/18 sm:mx-0" />
        </div>

        <div className="flex items-start justify-center gap-2 sm:justify-start">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#694aff]" strokeWidth={2} />
          <p className="min-w-0 text-sm font-medium text-white/88">{person.identidad}</p>
        </div>

        {person.mundo && (
          <div className="flex items-start justify-center gap-2 sm:justify-start">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/55" strokeWidth={2} />
            <p className="min-w-0 text-xs font-light leading-snug text-white/62">{person.mundo}</p>
          </div>
        )}

        <p className="border-none text-center text-xs font-light italic leading-relaxed text-white/52 sm:border-l-2 sm:border-white/22 sm:pl-3 sm:text-left">
          “{person.valorHumano.length > 140 ? `${person.valorHumano.slice(0, 137)}…` : person.valorHumano}”
        </p>

        {whatsappHref ? (
          <div className="flex items-center justify-center gap-2 pt-1 sm:justify-start">
            <Phone className="h-4 w-4 shrink-0 text-white/55" strokeWidth={2} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-xs font-medium text-white underline decoration-[#694aff]/85 underline-offset-2 hover:text-white/85"
              onClick={(e) => {
                e.stopPropagation()
                if (miSubmissionId) {
                  registrarWaClick(miSubmissionId, person.id, ronda).catch(() => {})
                }
              }}
            >
              WhatsApp
            </a>
          </div>
        ) : null}

        <p
          className="text-center text-[0.68rem] uppercase tracking-[0.15em] text-white/35 sm:text-left"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Conexión sugerida
        </p>
      </div>
    </motion.article>
  )
}
