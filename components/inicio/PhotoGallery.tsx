'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'

const manrope = Manrope({
  subsets: ['latin'],
})

export type GalleryPhoto = {
  name: string
  loc: string
  badge: string
  badgeBg: string
  badgeColor: string
  col: string
  row: string
  src: string
}

/** Fotos en `public/images/galeria/` (ej. mt-1.jpeg). Ajusta títulos y ciudades si quieres. */
const photos: GalleryPhoto[] = [
  {
    name: 'Networking abierto',
    loc: 'Synergy',
    badge: 'after office',
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
    col: '1 / span 5',
    row: '1 / span 6',
    src: '/images/galeria/mt-1.jpeg',
  },
  {
    name: 'Conexiones en vivo',
    loc: 'Synergy',
    badge: 'networking',
    badgeBg: '#f3e8ff',
    badgeColor: '#6b21a8',
    col: '6 / span 4',
    row: '1 / span 4',
    src: '/images/galeria/mt-2.jpeg',
  },
  {
    name: 'Pitch y conversación',
    loc: 'Synergy',
    badge: 'pitch',
    badgeBg: '#e0f2fe',
    badgeColor: '#075985',
    col: '10 / span 3',
    row: '1 / span 4',
    src: '/images/galeria/mt-3.jpeg',
  },
  {
    name: 'Plenaria comunidad',
    loc: 'Synergy',
    badge: 'plenaria',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
    col: '6 / span 7',
    row: '5 / span 5',
    src: '/images/galeria/mt-4.jpeg',
  },
  {
    name: 'Bienvenida al encuentro',
    loc: 'Synergy',
    badge: 'evento',
    badgeBg: '#f3e8ff',
    badgeColor: '#6b21a8',
    col: '1 / span 3',
    row: '7 / span 4',
    src: '/images/galeria/mt-5.jpeg',
  },
  {
    name: 'Workshop',
    loc: 'Synergy',
    badge: 'workshop',
    badgeBg: '#e0f2fe',
    badgeColor: '#075985',
    col: '4 / span 2',
    row: '7 / span 4',
    src: '/images/galeria/mt-6.jpeg',
  },
  {
    name: 'Noche founders',
    loc: 'Synergy',
    badge: 'comunidad',
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
    col: '1 / span 5',
    row: '11 / span 5',
    src: '/images/galeria/mt-7.jpeg',
  },
  {
    name: 'Nuevas alianzas',
    loc: 'Synergy',
    badge: 'cierre',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
    col: '6 / span 4',
    row: '10 / span 6',
    src: '/images/galeria/mt-8.jpeg',
  },
  {
    name: 'Espacio pop-up',
    loc: 'Synergy',
    badge: 'pop-up',
    badgeBg: '#f3e8ff',
    badgeColor: '#6b21a8',
    col: '10 / span 3',
    row: '5 / span 4',
    src: '/images/galeria/mt-9.jpeg',
  },
  {
    name: 'Equipo y aliados',
    loc: 'Synergy',
    badge: 'backstage',
    badgeBg: '#e0f2fe',
    badgeColor: '#075985',
    col: '10 / span 3',
    row: '9 / span 7',
    src: '/images/galeria/mt-10.jpeg',
  },
]

function GalleryCard({ p, className }: { p: GalleryPhoto; className?: string }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-neutral-200 cursor-default',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <Image
        src={p.src}
        alt={p.name}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-4 transition-colors duration-300',
          'bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent',
          'lg:group-hover:from-black/70 lg:group-hover:via-black/35 lg:group-hover:to-black/10'
        )}
      />
      <div
        className={cn(
          manrope.className,
          'absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md',
          'opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200',
          'shadow-sm'
        )}
        style={{ background: p.badgeBg, color: p.badgeColor }}
      >
        {p.badge}
      </div>
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 p-4 transition-all duration-200',
          'translate-y-0 opacity-100 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100'
        )}
      >
        <p className={cn('text-[13px] font-semibold text-white mb-1', manrope.className)}>{p.name}</p>
        <p className="text-[11px] text-white/75 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 shrink-0 opacity-90" aria-hidden />
          {p.loc}
        </p>
      </div>
    </div>
  )
}

export default function PhotoGallery() {
  return (
    <section
      className="py-16 lg:py-24 w-full"
      aria-labelledby="gallery-heading"
    >
      <div className="text-center px-6 mb-12 max-w-2xl mx-auto">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15',
            'bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider',
            'text-[#1a1a1a]/80 mb-5',
            manrope.className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B318]" aria-hidden />
          momentos
        </div>
        <h2
          id="gallery-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-tight mb-3.5"
        >
          imágenes de{' '}
          <span className="font-[family-name:var(--font-playfair-display)] normal-case italic text-[#1a1a1a]">
            quienes construyen{' '}
            <em className="text-[#E5B318] not-italic font-semibold">juntos</em>
          </span>
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed max-w-md mx-auto lowercase">
          un vistazo a encuentros, pitches y la comunidad synergy en el caribe colombiano.
        </p>
      </div>

      {/* Desktop: mosaico 12 columnas */}
      <div className="hidden lg:block px-8 max-w-[1200px] mx-auto">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gridAutoRows: '36px',
          }}
        >
          {photos.map((p, i) => (
            <div
              key={`${p.name}-d-${i}`}
              className="min-h-0"
              style={{ gridColumn: p.col, gridRow: p.row }}
            >
              <GalleryCard p={p} className="h-full w-full min-h-[140px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: columna con proporción fija */}
      <div className="lg:hidden px-4 sm:px-6 flex flex-col gap-3 max-w-xl mx-auto">
        {photos.map((p, i) => (
          <div key={`${p.name}-m-${i}`} className="relative aspect-[4/3] w-full">
            <GalleryCard p={p} className="absolute inset-0 h-full w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
