'use client'

import { Archivo, Archivo_Black, Inter } from 'next/font/google'
import { User, Trophy, Phone } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})
const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: '300',
  variable: '--font-inter',
  display: 'swap',
})

const YELLOW = '#FFE033'
const DARK_TEXT = '#1a1a1a'

export type RoleOption = {
  label: React.ReactNode
  value: string
}

const DEFAULT_OPTIONS: RoleOption[] = [
  {
    label: <>Soy <span className="font-bold text-[#FFE033]">founder</span> / Dueño de <span className="font-bold text-[#FFE033]">negocio</span></>,
    value: 'Soy founder / Dueño de negocio',
  },
  {
    label: <>Busco unirme a un <span className="font-bold text-[#FFE033]">negocio</span> o <span className="font-bold text-[#FFE033]">proyecto</span></>,
    value: 'Busco unirme a un negocio o proyecto',
  },
  {
    label: <>Soy <span className="font-bold text-[#FFE033]">inversionista</span></>,
    value: 'Soy inversor',
  },
  {
    label: <>Quiero ser <span className="font-bold text-[#FFE033]">aliado estratégico</span></>,
    value: 'Quiero ser aliado estratégico',
  },
  {
    label: <>Busco un <span className="font-bold text-[#FFE033]">socio</span> o <span className="font-bold text-[#FFE033]">co-fundador</span></>,
    value: 'Busco un socio o co-fundador',
  },
]

export interface HeroOnboardingProps {
  onSelect?: (tipo: string) => void
  options?: RoleOption[]
}

export default function HeroOnboarding({ onSelect, options = DEFAULT_OPTIONS }: HeroOnboardingProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  function handleClick(value: string) {
    setSelectedValue(value)
    if (onSelect) {
      setTimeout(() => onSelect(value), 300)
    }
  }

  const ROW1_LOGO_NAMES = ['Bancolombia', 'Rappi', 'Merqueo', 'Addi', 'Habi', 'Frubana', 'Treinta', 'Siigo']
  const ROW2_LOGO_NAMES = ['LaHaus', 'Minka', 'Bold', 'Bia', 'Chiper', 'Simetrik', 'Alegra', 'Loggro']

  return (
    <div className={`min-h-screen grid grid-cols-1 md:grid-cols-2 ${archivo.variable} ${archivoBlack.variable} ${inter.variable} font-[var(--font-archivo)]`}>
      {/* LEFT COLUMN (50%): form pegado arriba en mobile */}
      <div className="min-h-0 md:min-h-screen bg-white flex flex-col justify-start md:justify-center px-4 sm:px-6 pt-2 pb-3 md:py-8">
        <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-gray-50/80 shadow-sm p-6 sm:p-8 md:p-10">
          <h1
          className="font-[var(--font-archivo-black)] font-bold text-xl sm:text-2xl md:text-3xl text-[#1a1a1a]"
          style={{ color: DARK_TEXT }}
        >
          ¡Hola! Soy Gabi, de Synergy.
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#1a1a1a]/90 leading-relaxed">
          Te conecto con clientes, aliados, inversores y socios estratégicos en{' '}
          <strong className="font-semibold text-[#1a1a1a]">Latinoamérica</strong>.
        </p>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#1a1a1a]/90">
          Cuéntame,{' '}
          <span
            className="font-bold underline px-1 rounded"
            style={{ backgroundColor: YELLOW, color: DARK_TEXT }}
          >
            ¿cómo te describes?
          </span>
        </p>

        {/* Timeline + buttons */}
        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* Línea vertical: User arriba, Trophy en mitad, Phone abajo */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white shrink-0">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" aria-hidden />
            </div>
            <div className="w-px flex-1 min-h-[1.25rem] bg-gray-300" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white shrink-0">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" aria-hidden />
            </div>
            <div className="w-px flex-1 min-h-[1.25rem] bg-gray-300" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white shrink-0">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" aria-hidden />
            </div>
          </div>

          {/* Option buttons: ancho al texto, todos del mismo largo */}
          <div className="flex flex-col gap-2 sm:gap-3 w-max max-w-full">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleClick(opt.value)}
                className={cn(
                  'w-full text-left px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white transition-all duration-200',
                  'hover:brightness-110 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FFE033] focus:ring-offset-2',
                  selectedValue === opt.value
                    ? 'ring-2 ring-[#FFE033]'
                    : ''
                )}
                style={{ backgroundColor: DARK_TEXT }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* RIGHT COLUMN (50%): título + logos más arriba en mobile */}
      <div
        className="min-h-0 md:min-h-screen bg-white flex flex-col items-center md:items-start justify-start md:justify-center px-4 sm:px-6 pt-2 pb-6 md:pt-6 md:pb-12 overflow-hidden"
      >
        <div className="w-full md:-mt-6">
        <h2
          className={cn('text-lg font-light text-[#1a1a1a] text-center md:text-left w-full mb-5 md:mb-12', inter.className)}
        >
          Ya conectamos con personas de estas empresas:
        </h2>
        <div className="logo-carousel-pause relative w-full overflow-hidden">
          {/* Row 1: scroll left */}
          <div className="overflow-hidden w-full mb-4">
            <div className="logo-carousel-track-left flex gap-4 w-max">
              {[...ROW1_LOGO_NAMES, ...ROW1_LOGO_NAMES].map((name, i) => (
                <div
                  key={`row1-${i}`}
                  className="flex-shrink-0 rounded-xl bg-white px-6 py-4 min-w-[140px] text-center font-medium text-sm text-gray-500 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
          {/* Row 2: scroll right */}
          <div className="overflow-hidden w-full">
            <div className="logo-carousel-track-right flex gap-4 w-max">
              {[...ROW2_LOGO_NAMES, ...ROW2_LOGO_NAMES].map((name, i) => (
                <div
                  key={`row2-${i}`}
                  className="flex-shrink-0 rounded-xl bg-white px-6 py-4 min-w-[140px] text-center font-medium text-sm text-gray-500 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
          {/* Overlays blur fade — zona ancha para transición imperceptible */}
          <div
            className="logo-carousel-fade-left absolute left-0 top-0 bottom-0 w-40 sm:w-56 z-10 pointer-events-none"
            aria-hidden
          />
          <div
            className="logo-carousel-fade-right absolute right-0 top-0 bottom-0 w-40 sm:w-56 z-10 pointer-events-none"
            aria-hidden
          />
        </div>
        </div>
      </div>
    </div>
  )
}
