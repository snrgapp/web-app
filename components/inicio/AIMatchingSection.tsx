'use client'

import { cn } from '@/lib/utils'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'] })

export default function AIMatchingSection() {
  return (
    <>
      <style>{`
        @keyframes aim-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aim-a1, .aim-a2, .aim-a3, .aim-a4 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
        .aim-a1 { animation: aim-fade-up 0.5s 0.1s both; }
        .aim-a2 { animation: aim-fade-up 0.5s 0.25s both; }
        .aim-a3 { animation: aim-fade-up 0.5s 0.4s both; }
        .aim-a4 { animation: aim-fade-up 0.5s 0.55s both; }
      `}</style>

      <section className="py-16 lg:py-24 w-full" aria-labelledby="aim-matching-heading">
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
            ia de matching
          </div>
          <h2
            id="aim-matching-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-tight mb-3.5"
          >
            <span className="block">conexiones que no ocurren</span>
            <span className="mt-1 block font-[family-name:var(--font-playfair-display)] normal-case italic text-[#E5B318]">
              por casualidad
            </span>
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed max-w-md mx-auto lowercase">
            nuestra{' '}
            <strong className="font-semibold normal-case">IA</strong> analiza tus{' '}
            <strong className="font-semibold">soluciones,</strong>{' '}
            <strong className="font-semibold">desafíos</strong> e{' '}
            <strong className="font-semibold">intereses</strong> para conectarte con los{' '}
            <strong className="font-semibold">founders correctos</strong> — ya sea en nuestros{' '}
            <strong className="font-semibold">eventos presenciales</strong> o directamente en tu{' '}
            <strong className="font-semibold">whatsapp</strong>, sin importar dónde estés.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1060px] mx-auto px-4 sm:px-6 lg:items-stretch">
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                'aim-a1 group flex gap-3.5 items-start rounded-2xl border border-[#1a1a1a]/15',
                'bg-white/80 backdrop-blur-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
                'transition-colors hover:border-[#E5B318]/45'
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E5B318]/18">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div>
                <p className={cn('text-[13.5px] font-bold text-[#1a1a1a] mb-1', manrope.className)}>
                  Tu perfil es el punto de partida
                </p>
                <p className="text-[12.5px] text-neutral-600 leading-snug">
                  Registras tus retos actuales, soluciones que ofreces e intereses. La IA construye tu grafo
                  de afinidad con toda la red.
                </p>
              </div>
            </div>

            <div
              className={cn(
                'aim-a2 group flex gap-3.5 items-start rounded-2xl border border-[#1a1a1a]/15',
                'bg-white/80 backdrop-blur-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
                'transition-colors hover:border-[#E5B318]/45'
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E5B318]/18">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <circle cx="19" cy="19" r="2" />
                  <line x1="7" y1="11" x2="17" y2="6" />
                  <line x1="7" y1="13" x2="17" y2="18" />
                </svg>
              </div>
              <div>
                <p className={cn('text-[13.5px] font-bold text-[#1a1a1a] mb-1', manrope.className)}>
                  La IA calcula compatibilidades
                </p>
                <p className="text-[12.5px] text-neutral-600 leading-snug">
                  Cruza perfiles en tiempo real: quién resuelve lo que necesitas, comparte industria o está en
                  tu misma ciudad.
                </p>
              </div>
            </div>

            <div
              className={cn(
                'aim-a3 group flex gap-3.5 items-start rounded-2xl border border-[#1a1a1a]/15',
                'bg-white/80 backdrop-blur-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
                'transition-colors hover:border-[#E5B318]/45'
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E5B318]/18">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <p className={cn('text-[13.5px] font-bold text-[#1a1a1a] mb-1', manrope.className)}>
                  Te conectamos donde estés
                </p>
                <p className="text-[12.5px] text-neutral-600 leading-snug">
                  Recibe tus recomendaciones semanales por WhatsApp aunque no asistas a ningún evento. Y si
                  visitas uno de nuestros espacios, la conexión ocurre en persona.
                </p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'aim-a4 flex min-h-[320px] flex-col overflow-hidden rounded-[20px] bg-[#1a1a1a] p-5 text-white',
              'shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5'
            )}
          >
            <div className="mb-3.5 flex shrink-0 items-center gap-2.5 border-b border-white/[0.08] pb-3.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#25d366]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.997l6.306-1.453A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.017-1.366l-.36-.214-3.733.859.882-3.63-.235-.374A9.854 9.854 0 012.118 12c0-5.448 4.434-9.882 9.882-9.882 5.449 0 9.882 4.434 9.882 9.882 0 5.449-4.433 9.882-9.882 9.882z" />
                </svg>
              </div>
              <div>
                <p className={cn('text-[13px] font-semibold text-white', manrope.className)}>Synergy</p>
                <p className="text-[11px] text-[#25d366]">● activo ahora</p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <div className="shrink-0 rounded-[12px] rounded-bl-sm bg-white/[0.08] px-3 py-2.5">
                <p className="text-[12.5px] leading-relaxed text-white/[0.88]">
                  Hola <b className="font-semibold text-white">Carlos</b>, esta semana encontramos{' '}
                  <b className="font-semibold text-white">4 perfiles</b> con alta compatibilidad contigo:
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-white/[0.08] bg-[#252525] px-3 py-2.5">
                <div className="mb-1.5 flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#1a1a1a]"
                    style={{ background: '#E5B318' }}
                  >
                    SV
                  </div>
                  <div>
                    <p className={cn('text-[12.5px] font-semibold text-[#fafafa]', manrope.className)}>
                      Sara Vargas
                    </p>
                    <p className="text-[11px] text-white/40">Fintech · Barranquilla</p>
                  </div>
                </div>
                <p className="mb-2 text-[11.5px] leading-snug text-white/55">
                  Resuelve tu reto de pagos B2B y busca aliados en expansión regional.
                </p>
                <div className="flex flex-col border-t border-white/[0.08] pt-1.5">
                  <button
                    type="button"
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[12.5px] font-semibold text-[#25d366]',
                      'transition-colors hover:bg-white/[0.05]',
                      manrope.className
                    )}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="9 14 4 9 9 4" />
                      <path d="M20 20v-7a4 4 0 00-4-4H4" />
                    </svg>
                    Aceptar
                  </button>
                  <div className="my-0.5 h-px bg-white/[0.07]" />
                  <button
                    type="button"
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[12.5px] font-semibold text-[#25d366]',
                      'transition-colors hover:bg-white/[0.05]',
                      manrope.className
                    )}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="9 14 4 9 9 4" />
                      <path d="M20 20v-7a4 4 0 00-4-4H4" />
                    </svg>
                    Omitir
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-auto shrink-0 pt-2.5 text-right text-[10px] text-white/25">hoy · 8:47 am · ✓✓</p>
          </div>
        </div>
      </section>
    </>
  )
}
