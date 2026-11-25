'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SNRG_SHOW_PUBLIC_EVENTOS_NAV } from '@/lib/snrg-public-flags'
import { useI18n } from '@/components/i18n/LanguageProvider'


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
  const { t } = useI18n()
  const eventosLinksRaw = [
    { href: '/eventos', label: t.footer.calendar },
    { href: '/postula-tu-ciudad', label: t.footer.applyCity },
    { href: '/ia', label: t.footer.ia },
  ]
  const eventosLinks = SNRG_SHOW_PUBLIC_EVENTOS_NAV
    ? eventosLinksRaw
    : eventosLinksRaw.filter((link) => link.href !== '/eventos')
  const contactoLinks = [
    { href: '/contacto', label: t.footer.questions },
    { href: '/contacto', label: t.footer.partnership },
  ]
  const legalLinks = [
    { href: '/politica-privacidad', label: t.footer.privacy },
    { href: '/terminos', label: t.footer.terms },
    { href: '/politica-cookies', label: t.footer.cookies },
    { href: '/uso-datos', label: t.footer.data },
  ]

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
          <Column title={t.footer.eventsTitle}>
            {eventosLinks.map((link) => (
              <LinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </Column>

          {/* Columna 3: Contacto */}
          <Column title={t.footer.contactTitle}>
            {contactoLinks.map((link) => (
              <LinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </Column>

          {/* Columna 4: Legal & Confianza */}
          <Column title={t.footer.legalTitle}>
            {legalLinks.map((link) => (
              <LinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </Column>
        </div>

        {/* Derechos reservados */}
        <div className="mt-10 pt-6 border-t border-white/20 text-center">
          <p className="text-xs sm:text-sm text-white/80">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
