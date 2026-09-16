'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  CircleDot,
  Globe,
  Handshake,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Target,
  User,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitListaEsperaAction } from '@/app/actions/lista-espera'
import {
  ARCHETYPES,
  CAMARA_OPTIONS,
  COMPANY_TYPES,
  EMPLOYEE_OPTIONS,
  LAUNCH_CITIES,
  SALES_CHANNELS,
  SEEKING_OPTIONS,
  WAITLIST_REVIEWS,
  type ArchetypeName,
} from '@/lib/lista-espera-data'

const TOTAL_TRACKED = 9
const LAST_STEP = 14

const INSTAGRAM_URL =
  'https://www.instagram.com/_____synergy?igsh=MjhocGI0eWp3dDJr&utm_source=qr'
const LINKEDIN_URL = 'https://www.linkedin.com/company/synergy-founders-makers'

type FormState = {
  name: string
  email: string
  phone: string
  companyName: string
  companyType: string
  companyTypeOther: string
  instagram: string
  linkedin: string
  website: string
  archetype: ArchetypeName | ''
  seeking: string[]
  camara: string
  city: string
  salesChannels: string[]
  employees: string
}

const emptyState: FormState = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  companyType: '',
  companyTypeOther: '',
  instagram: '',
  linkedin: '',
  website: '',
  archetype: '',
  seeking: [],
  camara: '',
  city: '',
  salesChannels: [],
  employees: '',
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10
}

function isLaunchCity(city: string) {
  const n = city.trim().toLowerCase()
  return LAUNCH_CITIES.some((c) => c.toLowerCase() === n)
}

const selectCard = 'border-black bg-[#FFE100]/25'
const idleCard = 'border-black/10 bg-white hover:border-black/25'

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-base font-semibold text-white transition active:scale-[0.98] hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/30"
    >
      {children}
    </button>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-black/50">
      {children}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  prefix,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  icon?: React.ReactNode
  prefix?: string
}) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35">
          {icon}
        </span>
      ) : null}
      {prefix ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-black/35">
          {prefix}
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-2xl border border-black/10 bg-white py-3.5 pr-4 text-sm text-[#1a1a1a] placeholder:text-black/30 focus:border-black focus:outline-none focus:ring-2 focus:ring-[#FFE100]',
          icon || prefix ? 'pl-11' : 'px-4'
        )}
      />
    </div>
  )
}

export default function CityWaitlistFlow() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(emptyState)
  const [nameError, setNameError] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Calibrando tu perfil...')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const trackedStep = Math.min(step, TOTAL_TRACKED)
  const progressPct =
    step >= 10 ? 100 : Math.round((trackedStep / TOTAL_TRACKED) * 100)
  const showBack = step > 1 && step < 13
  const showProgress = step < 13

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const step1Valid =
    wordCount(form.name) >= 2 && isEmail(form.email) && isPhone(form.phone)

  const step2Valid = useMemo(() => {
    const nameOk = form.companyName.trim().length > 1
    if (!form.companyType) return false
    if (form.companyType === 'Otro') return nameOk && form.companyTypeOther.trim().length > 1
    return nameOk
  }, [form.companyName, form.companyType, form.companyTypeOther])

  function go(next: number) {
    if (next < 1 || next > LAST_STEP) return
    setStep(next)
  }

  function patch(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }))
  }

  function toggleSeeking(value: string) {
    setForm((prev) => {
      const has = prev.seeking.includes(value)
      if (has) return { ...prev, seeking: prev.seeking.filter((s) => s !== value) }
      if (prev.seeking.length >= 3) return prev
      return { ...prev, seeking: [...prev.seeking, value] }
    })
  }

  function toggleSales(value: string) {
    setForm((prev) => {
      const has = prev.salesChannels.includes(value)
      return {
        ...prev,
        salesChannels: has
          ? prev.salesChannels.filter((s) => s !== value)
          : [...prev.salesChannels, value],
      }
    })
  }

  async function startLoading() {
    if (submitting) return
    setSubmitError('')
    setSubmitting(true)
    go(13)
    const msgs = [
      'Analizando sinergias para tu sector...',
      `Cruzando matching de ${form.seeking[0] || 'founders'}...`,
      'Reservando prioridad en la lista de espera...',
      '¡Perfil listo!',
    ]
    let i = 0
    setLoadingMsg(msgs[0])
    const interval = window.setInterval(() => {
      i += 1
      if (i < msgs.length) setLoadingMsg(msgs[i])
    }, 700)

    const result = await submitListaEsperaAction({
      nombre: form.name,
      email: form.email,
      telefono: form.phone,
      empresa: form.companyName,
      tipoEmpresa: form.companyType,
      tipoEmpresaOther: form.companyTypeOther,
      instagram: form.instagram,
      linkedin: form.linkedin,
      website: form.website,
      arquetipo: form.archetype || 'El Conector',
      buscando: form.seeking,
      camara: form.camara,
      ciudad: form.city,
      canalesVenta: form.salesChannels,
      empleados: form.employees,
    })

    window.clearInterval(interval)
    setSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error || 'No se pudo guardar. Intenta de nuevo.')
      go(12)
      return
    }
    go(14)
  }

  const firstName = form.name.trim().split(/\s+/)[0] || 'founder'
  const archetype: ArchetypeName = form.archetype || 'El Conector'
  const arch = ARCHETYPES[archetype]

  return (
    <main className="synergy-page-dots relative flex min-h-screen items-center justify-center px-0 py-0 text-[#1a1a1a] md:px-6 md:py-8">
      <div className="flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-[#f2f2f2] md:min-h-[720px] md:rounded-[32px] md:border md:border-black/10 md:bg-white md:shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
        <header className="shrink-0 px-5 pb-3 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              aria-label="Volver"
              onClick={() => go(step - 1)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#1a1a1a] transition active:scale-90',
                showBack ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Synergy" width={28} height={28} className="h-7 w-7 object-contain" />
              <span className="font-[family-name:var(--font-playfair-display)] text-lg font-bold tracking-wide">
                SYNERGY
              </span>
              <span className="rounded bg-[#FFE100] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Caribe
              </span>
            </div>
            <div
              className={cn(
                'rounded-full border border-black/10 bg-white px-2.5 py-1 font-mono text-xs text-black/50',
                showProgress ? 'opacity-100' : 'opacity-0'
              )}
            >
              <span className="font-bold text-black">{Math.min(step, 9)}</span>/9
            </div>
          </div>
          {showProgress ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-black/10 bg-black/5">
              <div
                className="h-full rounded-full bg-[#FFE100] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          ) : null}
        </header>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-6 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col justify-between"
            >
              {step === 1 && (
                <StepShell
                  pill="Primer contacto"
                  title={
                    <>
                      Antes de todo,
                      <br />
                      <span className="font-[family-name:var(--font-playfair-display)]">
                        ¿cómo te llamas?
                      </span>
                    </>
                  }
                  subtitle="Queremos hablarte por tu nombre y avisarte cuando abramos tu ciudad."
                  action={
                    <PrimaryButton
                      disabled={!step1Valid}
                      onClick={() => {
                        if (wordCount(form.name) < 2) {
                          setNameError(true)
                          return
                        }
                        setNameError(false)
                        go(2)
                      }}
                    >
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Tu nombre completo</FieldLabel>
                      <TextInput
                        value={form.name}
                        onChange={(v) => {
                          patch({ name: v })
                          if (nameError && wordCount(v) >= 2) setNameError(false)
                        }}
                        placeholder="Jesús Prieto"
                        icon={<User className="h-4 w-4" />}
                      />
                      {nameError ? (
                        <p className="text-xs text-red-600">Escribe al menos nombre y apellido.</p>
                      ) : null}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Correo</FieldLabel>
                      <TextInput
                        type="email"
                        value={form.email}
                        onChange={(v) => patch({ email: v })}
                        placeholder="tu@empresa.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>WhatsApp</FieldLabel>
                      <TextInput
                        type="tel"
                        value={form.phone}
                        onChange={(v) => patch({ phone: v })}
                        placeholder="300 000 0000"
                      />
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  pill="Tu proyecto"
                  title="Cuéntanos de qué se trata lo que estás construyendo"
                  subtitle="Ubicar tu negocio nos permite conectarte con el ecosistema adecuado."
                  action={
                    <PrimaryButton disabled={!step2Valid} onClick={() => go(3)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Nombre de tu empresa o proyecto *</FieldLabel>
                      <TextInput
                        value={form.companyName}
                        onChange={(v) => patch({ companyName: v })}
                        placeholder="Ej. Soluciones Caribe"
                        icon={<Building2 className="h-4 w-4" />}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Tipo de empresa *</FieldLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {COMPANY_TYPES.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => patch({ companyType: opt.value })}
                            className={cn(
                              'rounded-xl border p-3 text-left transition',
                              form.companyType === opt.value ? selectCard : idleCard
                            )}
                          >
                            <div className="text-xs font-semibold">{opt.title}</div>
                            <div className="text-[11px] text-black/45">{opt.hint}</div>
                          </button>
                        ))}
                      </div>
                      {form.companyType === 'Otro' ? (
                        <TextInput
                          value={form.companyTypeOther}
                          onChange={(v) => patch({ companyTypeOther: v })}
                          placeholder="Escribe el sector de tu negocio"
                        />
                      ) : null}
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  pill="Presencia digital"
                  title="¿Dónde te podemos seguir?"
                  subtitle="Opcional, pero nos ayuda a conocerte mejor y darte visibilidad."
                  action={
                    <PrimaryButton onClick={() => go(4)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <FieldLabel>Instagram</FieldLabel>
                      <TextInput
                        value={form.instagram}
                        onChange={(v) => patch({ instagram: v })}
                        placeholder="usuario o empresa"
                        prefix="@"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel>LinkedIn</FieldLabel>
                      <TextInput
                        value={form.linkedin}
                        onChange={(v) => patch({ linkedin: v })}
                        placeholder="linkedin.com/in/tu-perfil"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel>Sitio web</FieldLabel>
                      <TextInput
                        value={form.website}
                        onChange={(v) => patch({ website: v })}
                        placeholder="https://tuempresa.com"
                        icon={<Globe className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  title={
                    <>
                      El networking correcto no se trata de conocer a más personas — se trata de{' '}
                      <span className="bg-[#FFE100] px-1">conocer a las correctas</span>.
                    </>
                  }
                  subtitle="Founders que construyen relaciones con intención crecen más rápido: encuentran clientes, socios y mentores en conversaciones que de otra forma nunca habrían pasado."
                  action={
                    <PrimaryButton onClick={() => go(5)}>
                      Entendido, continuemos <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-3.5">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-xs leading-relaxed text-black/55">
                      Las siguientes preguntas calibran tu perfil para conectarte con las personas
                      correctas desde el primer encuentro.
                    </p>
                  </div>
                </StepShell>
              )}

              {step === 5 && (
                <StepShell
                  pill="Mini test de arquetipo"
                  title="¿Cómo te describes construyendo tu negocio?"
                  subtitle="Elige el estilo que mejor representa tu instinto como founder."
                  action={
                    <PrimaryButton disabled={!form.archetype} onClick={() => go(6)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-2.5">
                    {(Object.keys(ARCHETYPES) as ArchetypeName[]).map((key) => {
                      const item = ARCHETYPES[key]
                      const Icon =
                        key === 'El Visionario'
                          ? Sparkles
                          : key === 'El Ejecutor'
                            ? Zap
                            : key === 'El Conector'
                              ? Handshake
                              : Target
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => patch({ archetype: key })}
                          className={cn(
                            'flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition',
                            form.archetype === key ? selectCard : idleCard
                          )}
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 text-sm font-bold">
                              {key}
                              <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                                {item.tag}
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-black/45">{item.blurb}</div>
                          </div>
                          <span
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full border',
                              form.archetype === key ? 'border-black bg-black' : 'border-black/20'
                            )}
                          >
                            {form.archetype === key ? (
                              <Check className="h-3 w-3 text-[#FFE100]" />
                            ) : null}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </StepShell>
              )}

              {step === 6 && (
                <StepShell
                  pill="Matching clave"
                  extra={
                    <span className="font-mono text-xs font-semibold">
                      {form.seeking.length} de 3 seleccionados
                    </span>
                  }
                  title="¿Qué esperas encontrar en Synergy?"
                  subtitle="Elige hasta 3 prioridades para cruzar intereses con los asistentes."
                  action={
                    <PrimaryButton disabled={form.seeking.length === 0} onClick={() => go(7)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SEEKING_OPTIONS.map((opt) => {
                      const on = form.seeking.includes(opt.value)
                      const blocked = !on && form.seeking.length >= 3
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleSeeking(opt.value)}
                          className={cn(
                            'flex items-center justify-between rounded-xl border p-3.5 text-left transition',
                            opt.wide && 'sm:col-span-2',
                            on ? selectCard : idleCard,
                            blocked && 'opacity-50'
                          )}
                        >
                          <span className="text-sm font-medium">{opt.label}</span>
                          {on ? <Check className="h-4 w-4" /> : null}
                        </button>
                      )
                    })}
                  </div>
                </StepShell>
              )}

              {step === 7 && (
                <StepShell
                  pill="Formalidad del negocio"
                  title="¿Tu empresa está registrada ante cámara de comercio?"
                  subtitle="Todas las etapas son bienvenidas. Esto nos ayuda a segmentar dinámicas y alianzas."
                  action={
                    <PrimaryButton disabled={!form.camara} onClick={() => go(8)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-3">
                    {CAMARA_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => patch({ camara: opt.value })}
                        className={cn(
                          'flex w-full items-center justify-between rounded-2xl border p-4 text-left transition',
                          form.camara === opt.value ? selectCard : idleCard
                        )}
                      >
                        <div>
                          <div className="text-sm font-bold">{opt.title}</div>
                          <div className="text-xs text-black/45">{opt.hint}</div>
                        </div>
                        {form.camara === opt.value ? <Check className="h-5 w-5" /> : null}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 8 && (
                <StepShell
                  pill="Hub regional"
                  title="¿En qué ciudad te encuentras?"
                  subtitle="Confirma tu ubicación para avisarte de la apertura del capítulo y eventos presenciales."
                  action={
                    <PrimaryButton disabled={!form.city.trim()} onClick={() => go(9)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-3">
                    <TextInput
                      value={form.city}
                      onChange={(v) => patch({ city: v })}
                      placeholder="Busca o escribe tu ciudad..."
                      icon={<Search className="h-4 w-4" />}
                    />
                    <div>
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-black/45">
                        Ciudades con lanzamiento confirmado
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {LAUNCH_CITIES.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => patch({ city })}
                            className={cn(
                              'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition',
                              form.city === city ? selectCard : idleCard
                            )}
                          >
                            <MapPin className="h-3 w-3" />
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.city.trim() && !isLaunchCity(form.city) ? (
                      <p className="rounded-xl border border-black/10 bg-white p-3.5 text-xs leading-snug text-black/60">
                        Aún no tenemos fecha confirmada para tu ciudad, pero te avisaremos apenas
                        abramos convocatoria local.
                      </p>
                    ) : null}
                  </div>
                </StepShell>
              )}

              {step === 9 && (
                <StepShell
                  pill="Tracción comercial"
                  extra={<span className="text-[11px] font-medium text-black/45">Última pregunta clave</span>}
                  title="¿Cómo consigues clientes hoy?"
                  subtitle="Selecciona todos tus canales activos (mínimo 1)."
                  action={
                    <PrimaryButton disabled={form.salesChannels.length === 0} onClick={() => go(10)}>
                      Descubrir mi match en Synergy <Sparkles className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    {SALES_CHANNELS.map((opt) => {
                      const on = form.salesChannels.includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleSales(opt.value)}
                          className={cn(
                            'rounded-xl border p-3 text-left transition',
                            opt.wide && 'col-span-2',
                            on ? selectCard : idleCard
                          )}
                        >
                          <div className="text-xs font-semibold">{opt.title}</div>
                          <div className="text-[10px] text-black/45">{opt.hint}</div>
                        </button>
                      )
                    })}
                  </div>
                </StepShell>
              )}

              {step === 10 && (
                <StepShell
                  title="Tu ADN de founder"
                  subtitle="Perfil calibrado a partir de tus respuestas."
                  action={
                    <PrimaryButton onClick={() => go(11)}>
                      Continuar a los detalles finales <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="rounded-3xl border border-black/10 bg-white p-5">
                    <div className="mb-3 flex items-center gap-3.5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE100]">
                        <CircleDot className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="block font-mono text-xs uppercase tracking-widest text-black/40">
                          Arquetipo revelado
                        </span>
                        <h3 className="font-[family-name:var(--font-playfair-display)] text-2xl font-bold">
                          {archetype}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-black/60">{arch.desc}</p>
                    <div className="mt-4 border-t border-black/10 pt-4">
                      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
                        Así te ayudamos en Synergy
                      </div>
                      <p className="rounded-xl bg-[#f2f2f2] p-3 text-sm leading-relaxed">{arch.benefit}</p>
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 11 && (
                <StepShell
                  pill="Tamaño del equipo"
                  title="¿Cuántas personas trabajan contigo hoy?"
                  subtitle="Para segmentar círculos según el tamaño operativo de tu empresa."
                  action={
                    <PrimaryButton disabled={!form.employees} onClick={() => go(12)}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  }
                >
                  <div className="space-y-2.5">
                    {EMPLOYEE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => patch({ employees: opt.value })}
                        className={cn(
                          'flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition',
                          form.employees === opt.value ? selectCard : idleCard
                        )}
                      >
                        <div>
                          <div className="text-sm font-bold">{opt.title}</div>
                          <div className="text-xs text-black/45">{opt.hint}</div>
                        </div>
                        {form.employees === opt.value ? <Users className="h-4 w-4" /> : null}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 12 && (
                <StepShell
                  pill="Comunidad activa"
                  title="Esto dicen founders que ya son parte de Synergy"
                  subtitle="Conexiones con intención, no tarjetas al azar."
                  action={
                    <div className="space-y-2">
                      {submitError ? (
                        <p className="text-center text-xs text-red-600">{submitError}</p>
                      ) : null}
                      <PrimaryButton disabled={submitting} onClick={() => void startLoading()}>
                        Finalizar registro <BadgeCheck className="h-4 w-4" />
                      </PrimaryButton>
                    </div>
                  }
                >
                  <div className="space-y-3">
                    {WAITLIST_REVIEWS.map((r) => (
                      <div key={r.initials} className="rounded-2xl border border-black/10 bg-white p-3.5">
                        <div className="mb-2 flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE100] text-xs font-bold">
                            {r.initials}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold">{r.name}</h4>
                            <span className="text-[10px] text-black/45">{r.role}</span>
                          </div>
                        </div>
                        <p className="text-xs italic leading-snug text-black/65">“{r.quote}”</p>
                      </div>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 13 && (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-black/10 bg-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                  <h3 className="mb-2 font-[family-name:var(--font-playfair-display)] text-xl font-bold">
                    Estamos preparando tu perfil en Synergy...
                  </h3>
                  <p className="max-w-xs text-sm text-black/50">
                    Calibrando afinidades y reservando tu prioridad en la lista de espera local.
                  </p>
                  <div className="mt-8 rounded-full border border-black/10 bg-white px-4 py-2.5 font-mono text-xs">
                    {loadingMsg}
                  </div>
                </div>
              )}

              {step === 14 && (
                <div className="flex flex-1 flex-col justify-between pt-4 text-center">
                  <div className="flex flex-col items-center space-y-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFE100]">
                      <BadgeCheck className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-[family-name:var(--font-playfair-display)] text-3xl font-bold leading-tight">
                        ¡Listo, {firstName}!
                      </h2>
                      <p className="text-base font-semibold">
                        Ya haces parte de la lista de espera de Synergy en{' '}
                        <span className="bg-[#FFE100] px-1">{form.city || 'tu ciudad'}</span>.
                      </p>
                      <p className="mx-auto max-w-sm pt-1 text-xs leading-relaxed text-black/50">
                        Te escribiremos a {form.email || 'tu correo'} con los próximos pasos para el
                        evento de apertura de tu ciudad.
                      </p>
                    </div>
                    <div className="w-full space-y-3 rounded-2xl border border-black/10 bg-white p-4 text-left text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-black/45">Estado</span>
                        <span className="rounded-full bg-[#FFE100] px-2.5 py-0.5 font-semibold">
                          Confirmado
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-black/10 pt-2">
                        <span className="text-black/45">Arquetipo</span>
                        <span className="font-semibold">{archetype}</span>
                      </div>
                    </div>
                    <div className="w-full pt-1">
                      <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-black/45">
                        Mientras tanto, síguenos
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={INSTAGRAM_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-3 text-xs font-semibold hover:border-black"
                        >
                          <Instagram className="h-3.5 w-3.5" /> Instagram
                        </a>
                        <a
                          href={LINKEDIN_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-3 text-xs font-semibold hover:border-black"
                        >
                          <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyState)
                      go(1)
                    }}
                    className="pt-6 text-xs text-black/40 underline underline-offset-4 hover:text-black/70"
                  >
                    Volver a empezar
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

function StepShell({
  pill,
  extra,
  title,
  subtitle,
  children,
  action,
}: {
  pill?: string
  extra?: React.ReactNode
  title: React.ReactNode
  subtitle?: string
  children: React.ReactNode
  action: React.ReactNode
}) {
  return (
    <>
      <div className="space-y-4 pt-1">
        {(pill || extra) && (
          <div className="flex items-center justify-between">
            {pill ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold">
                <Briefcase className="h-3.5 w-3.5" />
                {pill}
              </div>
            ) : (
              <span />
            )}
            {extra}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-black/50">{subtitle}</p> : null}
        </div>
        {children}
      </div>
      <div className="pt-5">{action}</div>
    </>
  )
}
