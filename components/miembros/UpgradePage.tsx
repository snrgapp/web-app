'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, CheckCircle2, ChevronDown } from 'lucide-react'
import {
  CURRENCIES,
  formatPlanPrice,
  type BillingPeriod,
  type Currency,
} from '@/lib/miembros/plans'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'

export function UpgradePage() {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const [billing, setBilling] = useState<BillingPeriod>('mensual')
  const [currency, setCurrency] = useState<Currency>('USD')
  const period = billing === 'anual' ? '/mes anual' : '/mes'

  return (
    <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center px-4 py-5 sm:px-6 md:px-8 md:py-6">
      <div className="mb-4 max-w-lg text-center">
        <h1 className="beneficios-title mb-1 text-members-on-surface">
          Planes diseñados para tu crecimiento
        </h1>
        <p className="beneficios-subtitle text-members-on-surface-variant">
          Escala tu red y potencia tu empresa con el plan que mejor se adapte a tu etapa.
        </p>
      </div>

      <div className="mb-5 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <div className="flex items-center gap-1 rounded-full border border-members-outline-variant bg-members-surface-container p-0.5">
          <button
            type="button"
            onClick={() => setBilling('mensual')}
            className={
              billing === 'mensual'
                ? 'rounded-full bg-members-primary-container px-4 py-1 text-xs text-white shadow-sm'
                : 'rounded-full bg-transparent px-4 py-1 text-xs text-members-on-surface-variant hover:text-members-on-surface'
            }
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setBilling('anual')}
            className={
              billing === 'anual'
                ? 'flex items-center gap-1.5 rounded-full bg-members-primary-container px-4 py-1 text-xs text-white shadow-sm'
                : 'flex items-center gap-1.5 rounded-full bg-transparent px-4 py-1 text-xs text-members-on-surface-variant hover:text-members-on-surface'
            }
          >
            Anual
            <span className="rounded-full bg-[#00a572] px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-[#00311f]">
              -15%
            </span>
          </button>
        </div>
        <label className="relative">
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
            className="appearance-none rounded-lg border border-members-outline-variant bg-members-surface-container py-1 pl-3 pr-8 text-xs text-members-on-surface outline-none transition-colors focus:border-members-primary-container"
          >
            {CURRENCIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-members-on-surface-variant" />
        </label>
      </div>

      <div className="mx-auto grid w-full grid-cols-1 items-stretch gap-5 md:grid-cols-3">
        <article className="flex flex-col rounded-2xl border border-members-border bg-members-surface p-6 transition-colors hover:border-members-hover-border hover:bg-members-hover">
          <h1 className="text-base font-semibold text-members-on-surface">Freemium (30 días)</h1>
          <p className="mt-1 text-sm text-members-on-surface-variant">
            Acceso limitado a la red básica para comenzar.
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="plan-price text-members-on-surface">
              {formatPlanPrice('free', currency, billing)}
            </span>
            <span className="text-sm text-members-on-surface-variant">{period}</span>
          </div>
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-members-on-surface-variant">
            {[
              '1 café grupal al mes',
              '2 sugerencias de match',
              'Beneficios de marcas aliadas',
              'Acceso a 2 cursos',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-members-on-surface" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <button
              type="button"
              className="w-full rounded-lg border border-members-border py-2.5 text-xs text-white transition-colors hover:brightness-110"
            >
              Plan actual
            </button>
          </div>
        </article>

        <article className="relative flex flex-col rounded-2xl border-2 border-members-primary-container bg-members-surface p-6 shadow-[0_0_18px_rgba(79,70,229,0.12)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-members-primary-container px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Más elegido
          </div>
          <h1 className="text-base font-semibold text-members-on-surface">Pro</h1>
          <p className="mt-1 text-sm text-members-on-surface-variant">
            Para founders que buscan crecimiento acelerado.
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="plan-price text-members-on-surface">
              {formatPlanPrice('pro', currency, billing)}
            </span>
            <span className="text-sm text-members-on-surface-variant">{period}</span>
          </div>
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-members-on-surface">
            {[
              'Todos los cursos',
              '1 café grupal al mes',
              'Todos los beneficios de marcas',
              'Emparejamiento avanzado',
              '10% off en eventos',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-members-primary-container" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <button
              type="button"
              className="w-full rounded-lg bg-members-primary-container py-2.5 text-xs font-semibold text-white transition-colors hover:brightness-110"
            >
              Upgrade a Pro
            </button>
          </div>
        </article>

        <article className="flex flex-col rounded-2xl border border-members-border bg-members-surface p-6 transition-colors hover:border-members-hover-border hover:bg-members-hover">
          <h1 className="text-base font-semibold text-members-on-surface">Marca Aliada</h1>
          <p className="mt-1 text-sm text-members-on-surface-variant">
            Alianzas para potenciar tu marca en la red.
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="plan-price text-members-on-surface">
              {formatPlanPrice('teams', currency, billing)}
            </span>
            <span className="text-sm text-members-on-surface-variant">{period}</span>
          </div>
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-members-on-surface-variant">
            {[
              'Presencia de marca en la comunidad',
              'Directorio por nicho',
              'Publicación de beneficios',
              'Marca en eventos',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-members-on-surface" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Link
              href={membersHref('/upgrade/agendar', basePath)}
              className="block w-full rounded-lg border border-members-outline-variant bg-members-surface-container py-2.5 text-center text-xs text-members-on-surface transition-colors hover:bg-members-surface-variant"
            >
              Agendar llamada
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
