'use client'

import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'] })

const tagStyles = [
  { bg: '#fef3c7', color: '#92400e' },
  { bg: '#d1fae5', color: '#065f46' },
  { bg: '#e0f2fe', color: '#075985' },
] as const

export default function ThreeStepsSection() {
  return (
    <>
      <style>{`
        @keyframes ts-evpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-ev-dot { animation: none !important; opacity: 1 !important; }
        }
        .ts-ev-dot { animation: ts-evpulse 2s infinite; }
      `}</style>

      <section className="w-full py-16 lg:py-24" aria-labelledby="three-steps-heading">
        <div className="mb-12 px-6 text-center">
          <div
            className={cn(
              'mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15',
              'bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/80',
              'backdrop-blur-sm',
              manrope.className
            )}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E5B318]" aria-hidden />
            cómo funciona
          </div>
          <h2
            id="three-steps-heading"
            className="text-2xl font-bold lowercase leading-tight tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl"
          >
            <span className="block">lo que sucede cuando vas a </span>
            <span className="mt-1 block font-[family-name:var(--font-playfair-display)] italic text-[#E5B318]">
              nuestras reuniones presenciales
            </span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 md:gap-5">
          {/* Paso 1 */}
          <div className="flex flex-col gap-3.5">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1a1a1a] text-xs font-bold text-white',
                manrope.className
              )}
            >
              01
            </div>
            <div>
              <p className={cn('mb-2 text-sm font-bold leading-snug text-[#1a1a1a]', manrope.className)}>
                usamos los datos de tu{' '}
                <span className="font-[family-name:var(--font-playfair-display)] text-base font-normal italic text-[#E5B318]">
                  formulario
                </span>
              </p>
              <p className="text-[12.5px] leading-relaxed text-neutral-600">
                Identificamos tus intereses, desafíos y soluciones para construir tu perfil de compatibilidad
                dentro de la red.
              </p>
            </div>
            <div className="mt-auto flex flex-1 flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-sm">
              <div className="mb-2 rounded-lg border border-[#1a1a1a]/10 bg-white px-2.5 py-2">
                <p className={cn('mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-400', manrope.className)}>
                  Desafío actual
                </p>
                <p className="text-[11px] text-[#1a1a1a]/85">Escalar ventas B2B</p>
              </div>
              <div className="mb-2 rounded-lg border border-[#1a1a1a]/10 bg-white px-2.5 py-2">
                <p className={cn('mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-400', manrope.className)}>
                  Solución que ofreces
                </p>
                <p className="text-[11px] text-[#1a1a1a]/85">Automatización logística</p>
              </div>
              <div className="mb-2 rounded-lg border border-[#1a1a1a]/10 bg-white px-2.5 py-2">
                <p className={cn('mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-400', manrope.className)}>
                  Intereses
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(['Fintech', 'Growth', 'SaaS'] as const).map((t, i) => (
                    <span
                      key={t}
                      className={cn('rounded px-1.5 py-0.5 text-[9px] font-semibold', manrope.className)}
                      style={{ background: tagStyles[i].bg, color: tagStyles[i].color }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className={cn(
                  'mt-2 rounded-lg bg-[#E5B318] py-2 text-center text-[10px] font-bold text-[#1a1a1a]',
                  manrope.className
                )}
              >
                Perfil guardado ✓
              </div>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex flex-col gap-3.5">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1a1a1a] text-xs font-bold text-white',
                manrope.className
              )}
            >
              02
            </div>
            <div>
              <p className={cn('mb-2 text-sm font-bold leading-snug text-[#1a1a1a]', manrope.className)}>
                nuestro{' '}
                <span className="font-[family-name:var(--font-playfair-display)] text-base font-normal italic text-[#E5B318]">
                  algoritmo
                </span>{' '}
                calcula los mejores matches
              </p>
              <p className="text-[12.5px] leading-relaxed text-neutral-600">
                Cruzamos todos los perfiles y calculamos qué founders tienen mayor compatibilidad contigo antes
                de cada reunión.
              </p>
            </div>
            <div className="mt-auto flex flex-1 flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-sm">
              <p className={cn('mb-2.5 text-[10px] font-bold text-[#1a1a1a]', manrope.className)}>
                Calculando compatibilidades...
              </p>
              {[
                { label: 'Desafíos compartidos', w: '94%' },
                { label: 'Industria complementaria', w: '87%' },
                { label: 'Soluciones alineadas', w: '91%' },
              ].map((row) => (
                <div key={row.label} className="mb-2">
                  <div className="mb-1 flex justify-between">
                    <span className={cn('text-[9px] font-semibold text-neutral-500', manrope.className)}>
                      {row.label}
                    </span>
                    <span className={cn('text-[9px] font-semibold text-[#1a1a1a]', manrope.className)}>
                      {row.w}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full rounded-full bg-[#E5B318]" style={{ width: row.w }} />
                  </div>
                </div>
              ))}
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#1a1a1a]/10 bg-white px-2 py-1.5">
                <div
                  className={cn(
                    'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
                    manrope.className
                  )}
                  style={{ background: '#fef3c7', color: '#92400e' }}
                >
                  SV
                </div>
                <span className={cn('min-w-0 flex-1 truncate text-[10px] font-semibold text-[#1a1a1a]', manrope.className)}>
                  Sara Vargas
                </span>
                <span className={cn('shrink-0 text-[9px] font-bold text-[#b45309]', manrope.className)}>Match alto</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#1a1a1a]/10 bg-white px-2 py-1.5">
                <div
                  className={cn(
                    'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
                    manrope.className
                  )}
                  style={{ background: '#d1fae5', color: '#065f46' }}
                >
                  JM
                </div>
                <span className={cn('min-w-0 flex-1 truncate text-[10px] font-semibold text-[#1a1a1a]', manrope.className)}>
                  Juan Molina
                </span>
                <span className={cn('shrink-0 text-[9px] font-bold text-[#b45309]', manrope.className)}>Match alto</span>
              </div>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex flex-col gap-3.5">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1a1a1a] text-xs font-bold text-white',
                manrope.className
              )}
            >
              03
            </div>
            <div>
              <p className={cn('mb-2 text-sm font-bold leading-snug text-[#1a1a1a]', manrope.className)}>
                conoces en persona tus{' '}
                <span className="font-[family-name:var(--font-playfair-display)] text-base font-normal italic text-[#E5B318]">
                  conexiones clave
                </span>
              </p>
              <p className="text-[12.5px] leading-relaxed text-neutral-600">
                Durante la reunión te presentamos a los empresarios más compatibles con lo que estás buscando. Sin
                fricciones.
              </p>
            </div>
            <div className="mt-auto flex flex-1 flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-sm">
              <div className="mb-2.5 flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-2.5 py-2">
                <span className="ts-ev-dot h-2 w-2 shrink-0 rounded-full bg-[#E5B318]" aria-hidden />
                <div>
                  <p className={cn('text-[10px] font-bold text-white', manrope.className)}>Synergy · Barranquilla</p>
                  <p className="text-[9px] text-white/50">Reunión presencial · 40 asistentes</p>
                </div>
              </div>
              {[
                { initials: 'SV', bg: '#fef3c7', color: '#92400e', name: 'Sara Vargas', detail: 'Fintech · Barranquilla' },
                { initials: 'JM', bg: '#d1fae5', color: '#065f46', name: 'Juan Molina', detail: 'SaaS · Cartagena' },
                { initials: 'LC', bg: '#ffedd5', color: '#9a3412', name: 'Lina Castro', detail: 'Logística · Barranquilla' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="mb-1.5 flex items-center gap-2 rounded-lg border border-[#1a1a1a]/10 bg-white px-2 py-1.5 last:mb-0"
                >
                  <div
                    className={cn(
                      'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
                      manrope.className
                    )}
                    style={{ background: p.bg, color: p.color }}
                  >
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <p className={cn('text-[10px] font-bold text-[#1a1a1a]', manrope.className)}>{p.name}</p>
                    <p className="text-[9px] text-neutral-400">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center px-6">
          <a
            href="/inicio#unete-red"
            className={cn(
              'inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] px-7 py-3.5',
              'text-sm font-semibold text-white transition-colors hover:bg-[#2d2d2d] sm:w-auto',
              manrope.className
            )}
          >
            Quiero ir a la próxima reunión
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </a>
        </div>
      </section>
    </>
  )
}
