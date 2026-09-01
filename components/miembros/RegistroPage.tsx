'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Link2, Loader2, Users } from 'lucide-react'
import {
  CHANNELS,
  COMPANY_CATEGORIES,
  CONNECTION_INTERESTS,
  EMPLOYEE_RANGES,
  REGISTRO_HERO_IMAGE,
  REGISTRO_STEPS,
  REVENUE_RANGES,
} from '@/lib/miembros/registro'

const fieldClass =
  'w-full rounded-lg border border-[#262626] bg-[#080808] px-4 py-3 text-members-on-surface outline-none transition-colors placeholder:text-members-outline-variant focus:border-members-primary-container'

function ChoiceCard({
  checked,
  label,
  onSelect,
}: {
  checked: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        checked
          ? 'rounded-lg border border-members-primary-container bg-members-primary-container/10 p-4 text-center text-members-on-surface transition-colors'
          : 'rounded-lg border border-[#262626] bg-[#080808] p-4 text-center text-members-on-surface transition-colors hover:border-[#333333]'
      }
    >
      {label}
    </button>
  )
}

export function RegistroPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [category, setCategory] = useState('')
  const [website, setWebsite] = useState('')
  const [employees, setEmployees] = useState('')
  const [revenue, setRevenue] = useState('')
  const [solutions, setSolutions] = useState('')
  const [challenges, setChallenges] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [channel, setChannel] = useState('email')

  const progress = (step / REGISTRO_STEPS.length) * 100

  function toggleInterest(id: string) {
    setInterests((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  function goNext() {
    setError('')
    if (step === 1 && (!fullName.trim() || !companyName.trim() || !category)) {
      setError('Completa nombre, empresa y categoría para continuar.')
      return
    }
    if (step === 2 && (!employees || !revenue)) {
      setError('Elige el tamaño del equipo y la facturación para continuar.')
      return
    }
    setStep((current) => Math.min(current + 1, REGISTRO_STEPS.length))
  }

  function goBack() {
    setError('')
    setStep((current) => Math.max(current - 1, 1))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 1200)
  }

  return (
    <div className="registro-page flex min-h-screen items-center justify-center bg-black p-4 text-members-on-surface antialiased md:p-8">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-[1280px] grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="relative hidden flex-col justify-between overflow-hidden rounded-2xl border border-members-border bg-members-surface p-12 lg:col-span-5 lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
            style={{ backgroundImage: `url('${REGISTRO_HERO_IMAGE}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-members-primary-container">
                <Image
                  src="/logo.png"
                  alt="Synergy"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain brightness-0 invert"
                />
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight">Synergy</p>
                <p className="text-xs uppercase tracking-wider text-members-on-surface-variant">
                  Founders & Makers
                </p>
              </div>
            </div>
            <h1 className="registro-brand mb-4">Únete a la red</h1>
            <p className="max-w-sm text-members-on-surface-variant">
              Conecta, escala y transforma tu negocio con founders y makers de Latam.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <Users className="h-8 w-8 fill-members-success text-members-success" />
            <div>
              <div className="registro-stat">5,000+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-members-on-surface-variant">
                Líderes activos
              </div>
            </div>
          </div>
        </aside>

        <section className="relative col-span-1 flex flex-col overflow-hidden rounded-2xl border border-members-border bg-members-surface p-8 md:p-12 lg:col-span-7">
          {done ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-members-success" />
              <h1 className="registro-step-title mb-2">Cuenta lista</h1>
              <p className="mb-6 max-w-sm text-members-on-surface-variant">
                Recibimos tu registro. Entra al panel con tu teléfono cuando activemos tu acceso.
              </p>
              <Link
                href="/miembros/login"
                className="inline-flex items-center gap-2 rounded-lg bg-members-primary-container px-8 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
              >
                Ir al login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 w-full">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h1 className="registro-step-title">{REGISTRO_STEPS[step - 1]}</h1>
                  <span className="rounded-full border border-members-border bg-[#1A1A1A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-members-on-surface-variant">
                    Paso {step} de {REGISTRO_STEPS.length}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-members-border">
                  <div
                    className="h-full bg-members-primary-container transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
                {step === 1 ? (
                  <div key="step-1" className="registro-step flex flex-1 flex-col gap-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Nombre completo
                        </span>
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          placeholder="Ej. Ana García"
                          className={fieldClass}
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Nombre de la empresa
                        </span>
                        <input
                          required
                          type="text"
                          value={companyName}
                          onChange={(event) => setCompanyName(event.target.value)}
                          placeholder="Tu startup"
                          className={fieldClass}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Categoría de la empresa
                        </span>
                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          className={`${fieldClass} appearance-none`}
                        >
                          <option value="" disabled>
                            Selecciona una industria
                          </option>
                          {COMPANY_CATEGORIES.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Redes sociales o web
                        </span>
                        <div className="relative">
                          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-members-on-surface-variant" />
                          <input
                            type="text"
                            value={website}
                            onChange={(event) => setWebsite(event.target.value)}
                            placeholder="https://..."
                            className={`${fieldClass} pl-10`}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div key="step-2" className="registro-step flex flex-1 flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Número de empleados
                      </span>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {EMPLOYEE_RANGES.map((range) => (
                          <ChoiceCard
                            key={range}
                            checked={employees === range}
                            label={range}
                            onSelect={() => setEmployees(range)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Facturación promedio al año (USD)
                      </span>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {REVENUE_RANGES.map((item) => (
                          <ChoiceCard
                            key={item.id}
                            checked={revenue === item.id}
                            label={item.label}
                            onSelect={() => setRevenue(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div key="step-3" className="registro-step flex flex-1 flex-col gap-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Soluciones que ofrece la empresa
                        </span>
                        <textarea
                          rows={3}
                          value={solutions}
                          onChange={(event) => setSolutions(event.target.value)}
                          placeholder="Breve descripción..."
                          className={`${fieldClass} resize-none`}
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Principales desafíos actuales
                        </span>
                        <textarea
                          rows={3}
                          value={challenges}
                          onChange={(event) => setChallenges(event.target.value)}
                          placeholder="Escalabilidad, ventas, etc."
                          className={`${fieldClass} resize-none`}
                        />
                      </label>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Intereses de conexión
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {CONNECTION_INTERESTS.map((item) => {
                          const checked = interests.includes(item.id)
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleInterest(item.id)}
                              className={
                                checked
                                  ? 'rounded-full border border-members-primary-container bg-members-primary-container px-4 py-2 text-sm text-white'
                                  : 'rounded-full border border-[#262626] bg-[#080808] px-4 py-2 text-sm text-members-on-surface'
                              }
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <label className="mt-2 flex w-full flex-col gap-2 md:w-1/2">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Canal de comunicación preferido
                      </span>
                      <select
                        value={channel}
                        onChange={(event) => setChannel(event.target.value)}
                        className={`${fieldClass} appearance-none`}
                      >
                        {CHANNELS.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}

                {error ? <p className="mt-4 text-sm text-[#ffb4ab]">{error}</p> : null}

                <div className="mt-12 flex items-center justify-between border-t border-[#262626] pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 text-sm text-members-on-surface transition-colors hover:text-members-primary"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Atrás
                    </button>
                  ) : (
                    <Link
                      href="/miembros/login"
                      className="inline-flex items-center gap-2 text-sm text-members-on-surface-variant hover:text-members-on-surface"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Ya tengo cuenta
                    </Link>
                  )}
                  {step < REGISTRO_STEPS.length ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="ml-auto inline-flex items-center gap-2 rounded-lg bg-members-primary-container px-8 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="ml-auto inline-flex items-center gap-2 rounded-lg bg-members-primary-container px-8 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
