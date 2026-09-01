'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

type Step = {
  id: string
  title: string
  detail?: string
  done: boolean
  href?: string
}

const STEPS: Step[] = [
  { id: 'workspace', title: 'Crea tu espacio', done: true },
  {
    id: 'people',
    title: 'Conecta con founders',
    detail: 'Busca perfiles o deja que el asistente te proponga matches',
    done: false,
    href: '/lets-connect',
  },
  { id: 'account', title: 'Activa tu cuenta', done: true },
  {
    id: 'session',
    title: 'Agenda tu primer café',
    detail: 'Programa un 1:1 o súmate a un Coffee & Meet',
    done: false,
    href: '/coffee-meets',
  },
  {
    id: 'profile',
    title: 'Completa tu perfil',
    detail: 'Agrega bio y expertise para que otros te encuentren',
    done: false,
    href: '/configuracion',
  },
]

export function OnboardingProgressCard({ to }: { to: (href: string) => string }) {
  const doneCount = STEPS.filter((step) => step.done).length

  return (
    <section className="mb-10 rounded-xl border border-members-border bg-members-surface p-5 sm:p-6 md:mb-12">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <h1 className="text-xl text-members-on-surface">Para empezar, revisa esto:</h1>
        <span className="font-mono text-sm text-members-on-surface-variant">
          {doneCount}/{STEPS.length}
        </span>
      </div>
      <p className="mb-4 text-sm text-members-on-surface-variant sm:mb-6">
        Completa estas acciones para aprovechar Synergy al máximo.
      </p>

      <div className="mb-6 flex gap-2 sm:mb-8">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`h-2 flex-1 rounded-full ${
              step.done ? 'bg-[#10B981]' : 'bg-members-surface-variant'
            }`}
          />
        ))}
      </div>

      <div className="relative flex flex-col gap-5 sm:gap-6">
        <div className="absolute bottom-4 left-[11px] top-4 w-px bg-members-outline-variant" />
        {STEPS.map((step) => (
          <div key={step.id} className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {step.done ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-members-primary bg-members-surface">
                  <div className="h-2 w-2 rounded-full bg-members-primary" />
                </div>
              )}
              <div>
                <p className={step.done ? 'font-medium text-[#10B981]' : 'font-medium text-members-on-surface'}>
                  {step.title}
                </p>
                {step.detail && !step.done ? (
                  <p className="text-xs text-members-on-surface-variant">{step.detail}</p>
                ) : null}
              </div>
            </div>
            {step.href && !step.done ? (
              <Link
                href={to(step.href)}
                className="shrink-0 rounded-lg bg-members-primary-container p-2 text-white transition-all hover:brightness-110"
                aria-label={step.title}
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
