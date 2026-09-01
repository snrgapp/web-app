'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, TrendingUp, Users } from 'lucide-react'
import {
  AdminButton,
  Field,
  Modal,
  adminFetch,
  inputClass,
  useBusy,
} from '@/components/admin-miembros/admin-ui'
import { BENEFIT_CATEGORIES } from '@/lib/miembros/benefits'
import {
  DUMMY_ADMIN_BENEFITS,
  DUMMY_ADMIN_CLAIMS,
  emptyBenefit,
  isDummyBenefitId,
  toAdminBenefit,
  type AdminBenefit,
  type AdminBenefitClaim,
} from '@/lib/admin-miembros/beneficios-dummy'
import type { CmsBenefit } from '@/lib/cms/types'

const CLAIM_LABEL: Record<AdminBenefitClaim['status'], string> = {
  sent: 'Reclamado',
  requested: 'En proceso',
  failed: 'Fallido',
}

const CLAIM_CLASS: Record<AdminBenefitClaim['status'], string> = {
  sent: 'bg-members-success/10 text-members-success',
  requested: 'bg-members-pending/10 text-members-pending',
  failed: 'bg-red-500/10 text-red-300',
}

function claimBrand(claim: AdminBenefitClaim, benefits: AdminBenefit[]) {
  if (claim.brand) return claim.brand
  return benefits.find((benefit) => benefit.name === claim.benefit)?.brand || '—'
}

export default function AdminBeneficiosPage() {
  const [benefits, setBenefits] = useState<AdminBenefit[]>(DUMMY_ADMIN_BENEFITS)
  const [claims, setClaims] = useState<AdminBenefitClaim[]>(DUMMY_ADMIN_CLAIMS)
  const [query, setQuery] = useState('')
  const [showAllClaims, setShowAllClaims] = useState(false)
  const [editing, setEditing] = useState<Partial<CmsBenefit> | null>(null)
  const { busy, error, setError, run } = useBusy()

  async function load() {
    try {
      const result = await adminFetch<{ benefits: CmsBenefit[]; claims: AdminBenefitClaim[] }>(
        '/api/admin-miembros/benefits'
      )
      setBenefits(result.benefits?.length ? result.benefits.map((item) => toAdminBenefit(item)) : DUMMY_ADMIN_BENEFITS)
      setClaims(result.claims?.length ? result.claims : DUMMY_ADMIN_CLAIMS)
    } catch {
      setBenefits(DUMMY_ADMIN_BENEFITS)
      setClaims(DUMMY_ADMIN_CLAIMS)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const visibleBenefits = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return benefits
    return benefits.filter(
      (benefit) =>
        benefit.name.toLowerCase().includes(text) ||
        benefit.category.toLowerCase().includes(text) ||
        benefit.offer.toLowerCase().includes(text)
    )
  }, [benefits, query])

  const activeCount = benefits.filter((benefit) => benefit.status === 'active').length
  const totalClaims = benefits.reduce((sum, benefit) => sum + benefit.claims, 0)
  const utilization = Math.min(100, Math.round((totalClaims / Math.max(activeCount * 50, 1)) * 100))
  const visibleClaims = showAllClaims ? claims : claims.slice(0, 3)

  function saveLocal(payload: Partial<CmsBenefit>) {
    const saved: AdminBenefit = {
      id: payload.id || `benefit-local-${Date.now()}`,
      slug: payload.slug || (payload.name || '').toLowerCase().replace(/\s+/g, '-'),
      name: payload.name || '',
      description: payload.description || '',
      offer: payload.offer || '',
      category: payload.category || 'Productividad',
      featured: Boolean(payload.featured),
      logo_label: payload.logo_label || (payload.name || '').slice(0, 2),
      logo_bg: payload.logo_bg || '#232F3E',
      logo_color: payload.logo_color || '#FFFFFF',
      brand_email: payload.brand_email || '',
      redeem_instructions: payload.redeem_instructions || '',
      published: payload.published !== false,
      claims: 0,
      status: payload.status || (payload.published === false ? 'paused' : 'active'),
      cover_url: payload.cover_url || '',
      brand: payload.brand || payload.name || '',
    }
    setBenefits((current) => {
      const exists = current.some((item) => item.id === saved.id)
      return exists ? current.map((item) => (item.id === saved.id ? { ...item, ...saved, claims: item.claims } : item)) : [saved, ...current]
    })
    setEditing(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label-caps mb-1 text-members-on-surface-variant">Gestor de Beneficios</p>
          <h1 className="admin-display text-members-on-surface">Portafolio de partners</h1>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...emptyBenefit })}
          className="admin-label-caps flex items-center gap-2 rounded-lg bg-members-primary px-5 py-2.5 text-members-admin-surface shadow-sm transition-colors hover:bg-[#e2dfff]"
        >
          <Plus className="h-4 w-4" />
          Nuevo beneficio
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-members-outline-variant bg-members-surface-container-low px-3 py-2 text-sm text-members-on-surface-variant">
          {error}
        </p>
      ) : null}

      <div className="mb-2 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="flex flex-col justify-between rounded-xl border border-members-outline-variant bg-members-surface-container p-6">
          <div>
            <h1 className="admin-label-caps mb-4 text-members-on-surface-variant">Beneficios activos</h1>
            <p className="mb-2 text-4xl font-bold text-members-primary">{activeCount}</p>
            <p className="admin-table-cell flex items-center gap-1 text-members-success">
              <TrendingUp className="h-4 w-4" />
              +3 este mes
            </p>
          </div>
          <div className="mt-6 border-t border-members-outline-variant/50 pt-4">
            <h1 className="admin-label-caps mb-2 text-members-on-surface-variant">Uso de la plataforma</h1>
            <div className="h-2.5 w-full rounded-full bg-members-surface-container-highest">
              <div className="h-2.5 rounded-full bg-members-primary" style={{ width: `${utilization}%` }} />
            </div>
          </div>
        </section>

        <section className="flex flex-col overflow-hidden rounded-xl border border-members-outline-variant bg-members-surface-container lg:col-span-2">
          <div className="flex items-center justify-between border-b border-members-outline-variant bg-members-surface-container-low px-6 py-4">
            <h1 className="admin-label-caps text-members-on-surface">Solicitudes recientes</h1>
            <button
              type="button"
              className="admin-table-cell text-members-primary hover:underline"
              onClick={() => setShowAllClaims((current) => !current)}
            >
              {showAllClaims ? 'Ver menos' : 'Ver todas'}
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-members-surface-variant bg-members-admin-surface-container">
                  <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Emprendedor</th>
                  <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Beneficio</th>
                  <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Marca</th>
                  <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visibleClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="h-14 border-b border-members-surface-variant transition-colors last:border-0 hover:bg-members-surface-container-high"
                  >
                    <td className="px-6 py-2">
                      <div className="admin-table-cell font-medium text-members-on-surface">{claim.nombre}</div>
                      <div className="text-xs text-members-on-surface-variant">{claim.email}</div>
                    </td>
                    <td className="admin-table-cell px-6 py-2 text-members-on-surface">{claim.benefit}</td>
                    <td className="admin-table-cell px-6 py-2 text-members-on-surface-variant">
                      {claimBrand(claim, benefits)}
                    </td>
                    <td className="px-6 py-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${CLAIM_CLASS[claim.status] || CLAIM_CLASS.requested}`}
                      >
                        {CLAIM_LABEL[claim.status] || claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!visibleClaims.length ? (
                  <tr>
                    <td className="admin-table-cell px-6 py-6 text-members-on-surface-variant" colSpan={4}>
                      Aún no hay solicitudes.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mb-0 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-lg font-semibold text-members-on-surface">Tarjetas de beneficios</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-members-on-surface-variant" />
          <input
            className="admin-table-cell w-full rounded-lg border border-members-outline-variant bg-members-surface-container-highest py-2 pl-9 pr-4 text-members-on-surface outline-none focus:border-members-primary focus:ring-1 focus:ring-members-primary md:w-64"
            placeholder="Buscar beneficios..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleBenefits.map((benefit) => (
          <article
            key={benefit.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-members-outline-variant bg-members-surface-container transition-colors hover:border-members-primary/50"
          >
            <div className="relative h-32 bg-members-surface-container-highest">
              {benefit.cover_url ? (
                <img src={benefit.cover_url} alt="" className="h-full w-full object-cover opacity-60 mix-blend-overlay" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: benefit.logo_bg, color: benefit.logo_color }}
                >
                  {benefit.logo_label}
                </div>
              )}
              <div className="absolute right-4 top-4 rounded border border-members-outline-variant bg-members-admin-surface/80 px-2 py-1 text-xs font-bold text-members-on-surface backdrop-blur-sm">
                {benefit.category}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h1 className="text-lg font-semibold text-members-on-surface">{benefit.name}</h1>
                <span
                  className={
                    benefit.status === 'active'
                      ? 'admin-label-caps shrink-0 rounded bg-members-success/10 px-2 py-0.5 text-members-success'
                      : 'admin-label-caps shrink-0 rounded bg-members-outline/20 px-2 py-0.5 text-members-outline'
                  }
                >
                  {benefit.status === 'active' ? 'Activo' : 'Pausado'}
                </span>
              </div>
              <p className="admin-table-cell mb-2 flex-1 text-members-on-surface-variant">{benefit.description}</p>
              <p className="mb-4 text-sm font-semibold text-members-primary">{benefit.offer}</p>
              <div className="flex items-center justify-between border-t border-members-outline-variant/50 pt-4">
                <div className="flex items-center gap-2 text-members-on-surface-variant">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">{benefit.claims} reclamos</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded bg-members-surface-container-highest p-1.5 text-members-on-surface-variant transition-colors hover:text-members-primary"
                    title="Editar"
                    onClick={() => setEditing(benefit)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded bg-members-surface-container-highest p-1.5 text-members-on-surface-variant transition-colors hover:text-red-300"
                    title="Borrar"
                    onClick={() =>
                      void run(async () => {
                        if (isDummyBenefitId(benefit.id)) {
                          setBenefits((current) => current.filter((item) => item.id !== benefit.id))
                          return
                        }
                        await adminFetch('/api/admin-miembros/benefits', {
                          method: 'DELETE',
                          body: JSON.stringify({ id: benefit.id }),
                        })
                        await load()
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing ? (
        <Modal title={editing.id ? 'Editar beneficio' : 'Nuevo beneficio'} onClose={() => setEditing(null)}>
          <div className="grid gap-4">
            <Field label="Nombre">
              <input className={inputClass} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Oferta">
              <input className={inputClass} value={editing.offer || ''} onChange={(e) => setEditing({ ...editing, offer: e.target.value })} />
            </Field>
            <Field label="Descripción">
              <textarea className={inputClass} rows={4} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Cómo redimirlo (correo al emprendedor)">
              <textarea className={inputClass} rows={3} value={editing.redeem_instructions || ''} onChange={(e) => setEditing({ ...editing, redeem_instructions: e.target.value })} />
            </Field>
            <Field label="Correo de la marca">
              <input className={inputClass} value={editing.brand_email || ''} onChange={(e) => setEditing({ ...editing, brand_email: e.target.value })} />
            </Field>
            <Field label="Categoría">
              <select className={inputClass} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {BENEFIT_CATEGORIES.filter((item) => item !== 'Todos').map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Logo">
                <input className={inputClass} value={editing.logo_label || ''} onChange={(e) => setEditing({ ...editing, logo_label: e.target.value })} />
              </Field>
              <Field label="Fondo">
                <input className={inputClass} value={editing.logo_bg || ''} onChange={(e) => setEditing({ ...editing, logo_bg: e.target.value })} />
              </Field>
              <Field label="Color">
                <input className={inputClass} value={editing.logo_color || ''} onChange={(e) => setEditing({ ...editing, logo_color: e.target.value })} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(editing.featured)} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.published !== false}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              Activo (si no, queda pausado)
            </label>
            <AdminButton
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  if (!editing.name?.trim()) {
                    setError('El nombre es obligatorio')
                    return
                  }
                  if (!editing.id || isDummyBenefitId(editing.id)) {
                    saveLocal(editing)
                    return
                  }
                  try {
                    await adminFetch('/api/admin-miembros/benefits', { method: 'POST', body: JSON.stringify(editing) })
                    setEditing(null)
                    await load()
                  } catch {
                    saveLocal(editing)
                  }
                })
              }
            >
              Guardar
            </AdminButton>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
