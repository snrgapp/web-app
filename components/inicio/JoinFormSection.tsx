'use client'

import { useState } from 'react'
import { Manrope } from 'next/font/google'
import { ArrowRight, ChevronDown, Clock, Shield, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createContactoAction } from '@/app/actions/contactos'

const manrope = Manrope({ subsets: ['latin'] })

const inputClass =
  'w-full rounded-xl border border-[#1a1a1a]/15 bg-white/90 px-3.5 py-2.5 text-[13px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#E5B318]/70 focus:ring-2 focus:ring-[#E5B318]/25'

const labelClass = cn('text-[12px] font-semibold text-[#1a1a1a]/80', manrope.className)

function DividerLabel({ children }: { children: string }) {
  return (
    <div className="col-span-full my-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#1a1a1a]/10" />
      <span
        className={cn(
          'whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-neutral-400',
          manrope.className
        )}
      >
        {children}
      </span>
      <div className="h-px flex-1 bg-[#1a1a1a]/10" />
    </div>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, 'cursor-pointer appearance-none pr-10')}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
      </div>
    </div>
  )
}

export default function JoinFormSection() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [problema, setProblema] = useState('')
  const [desafio, setDesafio] = useState('')
  const [canal, setCanal] = useState('')
  const [equipo, setEquipo] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError('Indica tu correo electrónico.')
      return
    }
    const bloques = [
      'Solicitud: unirme a la red (formulario inicio)',
      `Nombre: ${nombre.trim() || '—'}`,
      `Empresa: ${empresa.trim() || '—'}`,
      `WhatsApp: ${whatsapp.trim() || '—'}`,
      `Qué problema soluciona: ${problema.trim() || '—'}`,
      `Desafío actual: ${desafio.trim() || '—'}`,
      `Canal de ventas: ${canal || '—'}`,
      `Tamaño del equipo: ${equipo || '—'}`,
      `LinkedIn: ${linkedin.trim() || '—'}`,
    ]
    const mensaje = bloques.join('\n')

    setLoading(true)
    const res = await createContactoAction({
      nombre: nombre.trim() || null,
      correo: email.trim(),
      whatsapp: whatsapp.trim() || null,
      mensaje,
    })
    setLoading(false)
    if (!res.success) {
      setError(res.error ?? 'No se pudo enviar.')
      return
    }
    setSuccess(true)
    setNombre('')
    setEmail('')
    setWhatsapp('')
    setEmpresa('')
    setProblema('')
    setDesafio('')
    setCanal('')
    setEquipo('')
    setLinkedin('')
  }

  return (
    <>
      <style>{`
        @keyframes jf-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jf-a1, .jf-a2 { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
        .jf-a1 { animation: jf-up 0.55s 0.05s both; }
        .jf-a2 { animation: jf-up 0.55s 0.18s both; }
      `}</style>

      <section
        id="unete-red"
        className="scroll-mt-24 py-16 lg:py-24 w-full"
        aria-labelledby="join-form-heading"
      >
        <div className="mx-auto grid max-w-[1060px] grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          {/* Columna izquierda */}
          <div className="jf-a1">
            <div
              className={cn(
                'mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15',
                'bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/80',
                'backdrop-blur-sm',
                manrope.className
              )}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E5B318]" aria-hidden />
              únete a la red
            </div>

            <h2
              id="join-form-heading"
              className="mb-4 text-2xl font-bold lowercase leading-tight tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl"
            >
              <span className="block">tu próxima conexión</span>
              <span className="block">clave te está</span>
              <span className="mt-1 block font-[family-name:var(--font-playfair-display)] normal-case italic text-[#E5B318]">
                esperando
              </span>
            </h2>

            <p className="mb-9 max-w-[420px] text-[15px] leading-relaxed text-neutral-600 lowercase">
              completa tu perfil y deja que la ia haga el trabajo. en menos de 48 horas tendrás tus primeras
              recomendaciones de founders con alta compatibilidad directo en tu whatsapp.
            </p>

            <div className="mb-10 flex flex-col gap-3.5">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E5B318]/18">
                  <Shield className="h-4 w-4 text-[#1a1a1a]" strokeWidth={1.75} aria-hidden />
                </div>
                <div>
                  <p className={cn('text-[13px] font-bold text-[#1a1a1a]', manrope.className)}>
                    Perfil 100% privado
                  </p>
                  <p className="text-[12px] leading-snug text-neutral-500">
                    Tu información solo se usa para el matching. Nunca se comparte sin tu consentimiento.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E5B318]/18">
                  <Clock className="h-4 w-4 text-[#1a1a1a]" strokeWidth={1.75} aria-hidden />
                </div>
                <div>
                  <p className={cn('text-[13px] font-bold text-[#1a1a1a]', manrope.className)}>
                    Primeras conexiones en 48 h
                  </p>
                  <p className="text-[12px] leading-snug text-neutral-500">
                    La IA procesa tu perfil de inmediato y envía tu primera ronda de matches por WhatsApp.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E5B318]/18">
                  <Users className="h-4 w-4 text-[#1a1a1a]" strokeWidth={1.75} aria-hidden />
                </div>
                <div>
                  <p className={cn('text-[13px] font-bold text-[#1a1a1a]', manrope.className)}>
                    Red de +700 founders activos
                  </p>
                  <p className="text-[12px] leading-snug text-neutral-500">
                    Barranquilla, Cartagena y Santa Marta. Founders reales con negocios en marcha.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1a1a1a]/10 bg-white/70 px-4 py-3.5 backdrop-blur-sm">
              <div className="flex">
                {[
                  { bg: '#fef3c7', color: '#92400e', t: 'SV' },
                  { bg: '#d1fae5', color: '#065f46', t: 'JM' },
                  { bg: '#ffedd5', color: '#9a3412', t: 'LC' },
                  { bg: '#e0f2fe', color: '#075985', t: 'PG' },
                  { bg: '#f3e8ff', color: '#6b21a8', t: 'AR' },
                ].map((a, i) => (
                  <div
                    key={a.t}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold',
                      manrope.className,
                      i > 0 && '-ml-2'
                    )}
                    style={{ background: a.bg, color: a.color }}
                    aria-hidden
                  >
                    {a.t}
                  </div>
                ))}
              </div>
              <div>
                <p className={cn('text-xs font-semibold text-[#1a1a1a]', manrope.className)}>
                  700+ founders ya están dentro
                </p>
                <p className="text-[11px] text-neutral-500">Únete a la red que conecta el Caribe</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div
            className={cn(
              'jf-a2 rounded-[20px] border border-[#1a1a1a]/15 bg-white/85 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:p-8'
            )}
          >
            <p className={cn('text-base font-bold text-[#1a1a1a]', manrope.className)}>
              Crea tu perfil de founder
            </p>
            <p className="mb-6 text-[13px] text-neutral-500">
              Tarda menos de 3 minutos · Sin tarjeta de crédito
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-x-3.5 md:gap-y-4">
              <DividerLabel>Información básica</DividerLabel>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="jf-nombre" className={labelClass}>
                  Nombre completo
                </label>
                <input
                  id="jf-nombre"
                  className={inputClass}
                  type="text"
                  autoComplete="name"
                  placeholder="Carlos Ramírez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="jf-email" className={labelClass}>
                  Correo electrónico
                </label>
                <input
                  id="jf-email"
                  className={inputClass}
                  type="email"
                  autoComplete="email"
                  placeholder="carlos@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="jf-wa" className={labelClass}>
                  WhatsApp
                </label>
                <input
                  id="jf-wa"
                  className={inputClass}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+57 300 000 0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="jf-empresa" className={labelClass}>
                  Empresa
                </label>
                <input
                  id="jf-empresa"
                  className={inputClass}
                  type="text"
                  autoComplete="organization"
                  placeholder="Nombre de tu empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />
              </div>

              <DividerLabel>Tu negocio</DividerLabel>

              <div className="col-span-full flex flex-col gap-1.5">
                <label htmlFor="jf-problema" className={labelClass}>
                  ¿Qué problema soluciona tu empresa?
                </label>
                <textarea
                  id="jf-problema"
                  className={cn(inputClass, 'min-h-[72px] resize-none leading-snug')}
                  rows={2}
                  placeholder="Ej: Ayudamos a restaurantes a reducir el desperdicio de alimentos con IA..."
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                />
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <label htmlFor="jf-desafio" className={labelClass}>
                  ¿Qué desafío estás enfrentando hoy?
                </label>
                <textarea
                  id="jf-desafio"
                  className={cn(inputClass, 'min-h-[72px] resize-none leading-snug')}
                  rows={2}
                  placeholder="Ej: Necesito escalar ventas fuera de Barranquilla sin contratar un equipo grande..."
                  value={desafio}
                  onChange={(e) => setDesafio(e.target.value)}
                />
              </div>

              <SelectField id="jf-canal" label="Canal de ventas actual" value={canal} onChange={setCanal}>
                <option value="" disabled>
                  Selecciona uno
                </option>
                <option value="Venta directa / outbound">Venta directa / outbound</option>
                <option value="Referidos / boca a boca">Referidos / boca a boca</option>
                <option value="Redes sociales">Redes sociales</option>
                <option value="Marketplace / plataformas">Marketplace / plataformas</option>
                <option value="Alianzas estratégicas">Alianzas estratégicas</option>
                <option value="E-commerce propio">E-commerce propio</option>
                <option value="Otro">Otro</option>
              </SelectField>

              <SelectField id="jf-equipo" label="Tamaño del equipo" value={equipo} onChange={setEquipo}>
                <option value="" disabled>
                  Selecciona uno
                </option>
                <option value="Solo founder">Solo founder</option>
                <option value="2 – 5 personas">2 – 5 personas</option>
                <option value="6 – 15 personas">6 – 15 personas</option>
                <option value="16 – 50 personas">16 – 50 personas</option>
                <option value="+50 personas">+50 personas</option>
              </SelectField>

              <DividerLabel>Presencia online</DividerLabel>

              <div className="col-span-full flex flex-col gap-1.5">
                <label htmlFor="jf-li" className={labelClass}>
                  LinkedIn
                </label>
                <input
                  id="jf-li"
                  className={inputClass}
                  type="url"
                  autoComplete="url"
                  placeholder="linkedin.com/in/tu-perfil"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>

              {error && (
                <p className="col-span-full text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              {success && (
                <p className="col-span-full text-sm text-emerald-700" role="status">
                  ¡Listo! Revisa tu correo; pronto te contactamos.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'col-span-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] px-4 py-3.5',
                  'text-[15px] font-semibold text-white transition-colors hover:bg-[#2d2d2d] disabled:opacity-60',
                  manrope.className
                )}
              >
                {loading ? 'Enviando…' : 'Unirme a la red'}
                {!loading && <ArrowRight className="h-4 w-4" aria-hidden />}
              </button>
            </form>

            <p className="mt-3 text-center text-[11px] text-neutral-500">
              Al enviar aceptas que usemos tu información para conectarte con otros founders.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
