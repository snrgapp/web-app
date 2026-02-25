'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const eventosLinks = [
  { href: '/eventos', label: 'Calendario de eventos' },
  { href: '/postula-tu-ciudad', label: 'Postula a tu ciudad' },
]

const contactoLinks = [
  { href: '/contacto', label: 'Dudas y preguntas' },
  { href: '/contacto', label: 'Proponer alianza' },
]

const legalLinks = [
  { href: '/politica-privacidad', label: 'Políticas de Privacidad' },
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/politica-cookies', label: 'Política de cookies' },
  { href: '/uso-datos', label: 'Uso de datos y comunidades' },
]

function LinkItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm font-light text-white/90 hover:text-white transition-colors group"
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 shrink-0" />
    </Link>
  )
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-bold text-white uppercase tracking-wide">{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Taza como separador: centrada, grande, desbordando a la sección clara */}
      <div className="flex justify-center -mt-[72px] sm:-mt-24 lg:-mt-28 relative z-10">
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
          <Image
            src="/images/coffee-login.png"
            alt="Synergy"
            fill
            className="object-contain drop-shadow-xl"
            sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 224px"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* 4 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Columna 1: Logo */}
          <div className="flex flex-col gap-3">
            <Link href="/inicio" className="block w-fit">
              <Image
                src="/logo.png"
                alt="Synergy"
                width={40}
                height={40}
                className="object-contain brightness-0 invert w-10 h-10"
              />
            </Link>
          </div>

          {/* Columna 2: Eventos & Networking */}
          <Column title="Eventos & Networking">
            {eventosLinks.map((link) => (
              <LinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </Column>

          {/* Columna 3: Contacto */}
          <Column title="Contacto">
            {contactoLinks.map((link) => (
              <LinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </Column>

          {/* Columna 4: Legal & Confianza */}
          <Column title="Legal & Confianza">
            {legalLinks.map((link) => (
              <LinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </Column>
        </div>

        {/* Derechos reservados */}
        <div className="mt-10 pt-6 border-t border-white/20 text-center">
          <p className="text-xs sm:text-sm text-white/80">
            Derechos reservados Synergy Founders & Makers community
          </p>
        </div>
      </div>
    </footer>
  )
}
