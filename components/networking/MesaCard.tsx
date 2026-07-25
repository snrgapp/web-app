'use client'

import { motion } from 'framer-motion'
import { Building2, Phone } from 'lucide-react'
import type { Asistente } from '@/types/database.types'
import './MesaCard.css'

interface MesaCardProps {
  asistente: Asistente
  index?: number
}

function whatsappHref(telefono: string): string {
  const digits = telefono.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}

/**
 * Tarjeta de contacto horizontal para asistentes de mesa.
 * Nombre dominante a la izquierda; empresa + WhatsApp a la derecha.
 */
export function MesaCard({ asistente, index = 0 }: MesaCardProps) {
  const nombre = asistente.nombre?.trim() || 'Sin nombre'
  const apellido = asistente.apellido?.trim() || ''
  const empresa = asistente.empresa || 'Sin empresa'
  const telefono = asistente.telefono || null

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      className="mesa-contact-card"
    >
      {/* Columna izquierda — nombre (40–45%) */}
      <div className="mesa-contact-card__name">
        <span className="mesa-contact-card__name-line">{nombre}</span>
        {apellido ? (
          <span className="mesa-contact-card__name-line">{apellido}</span>
        ) : null}
      </div>

      {/* Columna derecha — empresa + teléfono (55–60%) */}
      <div className="mesa-contact-card__meta">
        <div className="mesa-contact-card__row">
          <Building2
            className="mesa-contact-card__icon"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="mesa-contact-card__text">{empresa}</span>
        </div>

        {telefono && (
          <a
            href={whatsappHref(telefono)}
            target="_blank"
            rel="noopener noreferrer"
            className="mesa-contact-card__row mesa-contact-card__row--link"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone
              className="mesa-contact-card__icon"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="mesa-contact-card__text">{telefono}</span>
          </a>
        )}
      </div>
    </motion.article>
  )
}
