'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { BENEFIT_CATEGORIES, BENEFITS, type Benefit, type BenefitCategory } from '@/lib/miembros/benefits'
import { mapCmsBenefit } from '@/lib/cms/mappers'
import type { CmsBenefit } from '@/lib/cms/types'

export function BeneficiosPage() {
  const [category, setCategory] = useState<BenefitCategory>('Todos')
  const [claimedIds, setClaimedIds] = useState<string[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>(BENEFITS)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/miembros/cms/benefits')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.benefits?.length) {
          setBenefits(payload.benefits.map((item: CmsBenefit) => mapCmsBenefit(item)))
          setClaimedIds(payload.claimed || [])
        }
      })
      .catch(() => undefined)
  }, [])

  const visibleBenefits = useMemo(() => {
    if (category === 'Todos') return benefits
    return benefits.filter((benefit) => benefit.category === category)
  }, [category, benefits])

  async function claim(id: string) {
    if (claimedIds.includes(id)) return
    setBusyId(id)
    try {
      const response = await fetch('/api/miembros/cms/benefits/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ benefitId: id }),
      })
      if (response.ok) setClaimedIds((current) => [...current, id])
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-10">
      <div className="mb-10">
        <h1 className="beneficios-title mb-2 text-members-on-surface">Beneficios de partners</h1>
        <p className="beneficios-subtitle max-w-2xl text-members-on-surface-variant">
          Descuentos y créditos curados para la red Synergy. Acelera el crecimiento y baja el burn
          de tu operación.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {BENEFIT_CATEGORIES.map((item) => {
          const active = item === category
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                active
                  ? 'rounded-full border border-members-primary/30 bg-members-primary-container/20 px-4 py-1.5 text-xs text-members-primary'
                  : 'rounded-full border border-members-outline-variant bg-[#1A1A1A] px-4 py-1.5 text-xs text-members-on-surface-variant transition-colors hover:border-members-outline hover:text-members-on-surface'
              }
            >
              {item}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleBenefits.map((benefit) => {
          const isClaimed = claimedIds.includes(benefit.id)
          return (
            <article
              key={benefit.id}
              className="group flex flex-col rounded-xl border border-[#262626] bg-[#121212] p-6 transition-all duration-300 hover:border-[#333333] hover:bg-[#1A1A1A]"
            >
              <div className="mb-6 flex items-start justify-between">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-lg p-3 text-xl font-semibold"
                  style={{ backgroundColor: benefit.logo.bg, color: benefit.logo.color }}
                >
                  {benefit.logo.label}
                </div>
                {benefit.featured ? (
                  <span className="rounded bg-members-secondary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-members-secondary">
                    Top tier
                  </span>
                ) : null}
              </div>
              <h1 className="course-card-title mb-2 text-members-on-surface">{benefit.name}</h1>
              <p className="mb-6 line-clamp-3 flex-1 text-sm text-members-on-surface-variant">
                {benefit.description}
              </p>
              <div className="flex items-center justify-between border-t border-[#262626] pt-4">
                <div className="text-sm font-semibold text-members-on-surface">{benefit.offer}</div>
                <button
                  type="button"
                  disabled={isClaimed || busyId === benefit.id}
                  onClick={() => void claim(benefit.id)}
                  className={
                    benefit.featured
                      ? 'rounded-lg bg-members-primary-container px-4 py-2 text-xs text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all hover:brightness-110'
                      : 'rounded-lg border border-[#262626] px-4 py-2 text-xs text-white transition-all hover:bg-white/5'
                  }
                >
                  {isClaimed ? 'Solicitado' : busyId === benefit.id ? 'Enviando...' : 'Reclamar beneficio'}
                </button>
              </div>
            </article>
          )
        })}

        {category === 'Todos' ? (
          <article className="group relative flex flex-col items-start justify-center overflow-hidden rounded-xl border border-members-outline-variant bg-gradient-to-br from-members-surface-container-high to-members-surface p-8 md:col-span-2 lg:col-span-1">
            <div
              className="pointer-events-none absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 100% 100%, #4f46e5 0%, transparent 50%)',
              }}
            />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-members-primary-container/20 text-members-primary">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <h1 className="course-card-title mb-2 text-members-on-surface">¿Quieres ser partner?</h1>
            <p className="mb-6 text-sm text-members-on-surface-variant">
              Ofrece tu producto o servicio a founders de alto crecimiento en la red Synergy.
            </p>
            <button
              type="button"
              className="flex items-center gap-2 text-xs text-members-primary transition-all group-hover:gap-3"
            >
              Enviar una oferta
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ) : null}
      </div>
    </div>
  )
}
