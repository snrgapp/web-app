'use client'

import { motion } from 'framer-motion'
import { Sparkles, Phone } from 'lucide-react'
import type { IeeeConexionUsuario } from '@/app/actions/ieee-networking'

function whatsappPhoneParam(raw: string | null | undefined): string | null {
  if (!raw) return null
  const d = raw.replace(/\D/g, '')
  if (d.length < 7) return null
  return d.startsWith('57') ? d : `57${d}`
}

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length <= 6) return d
  if (d.length <= 10) return `${d.slice(0, 3)} ${d.slice(3)}`
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
}

interface IeeePersonCardProps {
  person: IeeeConexionUsuario
  index?: number
}

export function IeeePersonCard({ person, index = 0 }: IeeePersonCardProps) {
  const waParam = whatsappPhoneParam(person.telefono)
  const whatsappHref = waParam ? `https://api.whatsapp.com/send?phone=${waParam}` : null
  const interesLabel =
    person.areasInteres.length > 0 ? person.areasInteres.join(', ') : '—'

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      className="rounded-[22px] border border-white/10 bg-[#252525] px-4 py-4 text-center shadow-[6px_6px_0_#00629B] sm:text-left"
    >
      <div className="flex flex-col gap-3">
        <div>
          <h3
            className="text-lg font-black leading-tight text-white"
            style={{ fontFamily: 'var(--font-fraunces-ieee), serif' }}
          >
            {person.nombreCompleto}
          </h3>
          <div className="mx-auto mt-2 h-px w-3/5 bg-white/18 sm:mx-0" />
        </div>

        <div className="flex items-start justify-center gap-2 sm:justify-start">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#00629B]" strokeWidth={2} />
          <p className="min-w-0 text-sm font-medium leading-snug text-white/88">
            <span className="text-white/55">Interés: </span>
            {interesLabel}
          </p>
        </div>

        {whatsappHref ? (
          <div className="flex flex-col items-center gap-1 pt-1 sm:items-start">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Phone className="h-4 w-4 shrink-0 text-white/55" strokeWidth={2} />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white underline decoration-[#00629B]/90 underline-offset-2 hover:text-white/85"
                onClick={(e) => e.stopPropagation()}
              >
                {formatPhoneDisplay(person.telefono)}
              </a>
            </div>
            <p className="text-[0.65rem] uppercase tracking-wider text-white/40">Toca el número para chatear en WhatsApp</p>
          </div>
        ) : null}

        <p
          className="text-center text-[0.68rem] uppercase tracking-[0.15em] text-white/35 sm:text-left"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Conexión sugerida (esta ronda)
        </p>
      </div>
    </motion.article>
  )
}
