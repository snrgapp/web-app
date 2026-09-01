'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Filter, MoreVertical, Plus, Search, Users, Zap } from 'lucide-react'
import {
  AdminButton,
  Field,
  Modal,
  adminFetch,
  inputClass,
  useBusy,
} from '@/components/admin-miembros/admin-ui'
import { MemberProfilePanel } from '@/components/admin-miembros/MemberProfilePanel'
import {
  DIRECTORY_INDUSTRIES,
  DUMMY_DIRECTORY,
  initials,
  toDirectoryMember,
  type DirectoryMember,
} from '@/lib/admin-miembros/inicio-dummy'
import type { CmsAnalyticsRow, CmsHomeCard } from '@/lib/cms/types'

const PAGE_SIZE = 6

const emptyCard: Partial<CmsHomeCard> = {
  kind: 'highlight',
  title: '',
  body: '',
  image_url: '',
  href: '',
  badge: '',
  published: true,
}

export default function AdminInicioPage() {
  const [directory, setDirectory] = useState<DirectoryMember[]>(DUMMY_DIRECTORY)
  const [cards, setCards] = useState<CmsHomeCard[]>([])
  const [query, setQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro'>('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [recentOnly, setRecentOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [profile, setProfile] = useState<DirectoryMember | null>(null)
  const [editing, setEditing] = useState<Partial<CmsHomeCard> | null>(null)
  const { busy, error, run } = useBusy()

  useEffect(() => {
    void run(async () => {
      try {
        const [analytics, home] = await Promise.all([
          fetch('/api/admin-miembros/analytics').then((response) => (response.ok ? response.json() : null)),
          adminFetch<{ data: CmsHomeCard[] }>('/api/admin-miembros/home').catch(() => ({ data: [] })),
        ])
        const rows = (analytics?.data as CmsAnalyticsRow[] | undefined) || []
        if (rows.length && !rows[0].member.id.startsWith('dummy-')) {
          setDirectory(
            rows.map((row) =>
              toDirectoryMember(row.member, {
                events: row.events + row.coffees,
                connections: row.pairings,
              })
            )
          )
        } else {
          setDirectory(DUMMY_DIRECTORY)
        }
        setCards(home.data || [])
      } catch {
        setDirectory(DUMMY_DIRECTORY)
      }
    })
  }, [])

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return directory.filter((item) => {
      const planOk = planFilter === 'all' || item.member.plan === planFilter
      const industryOk = industryFilter === 'all' || item.industry === industryFilter
      const recentOk = !recentOnly || item.lastActive === 'recent'
      const queryOk =
        !text ||
        item.member.nombre.toLowerCase().includes(text) ||
        item.member.empresa.toLowerCase().includes(text) ||
        item.member.email.toLowerCase().includes(text)
      return planOk && industryOk && recentOk && queryOk
    })
  }, [directory, planFilter, industryFilter, recentOnly, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const recentCount = directory.filter((item) => item.lastActive === 'recent').length

  useEffect(() => {
    setPage(1)
  }, [query, planFilter, industryFilter, recentOnly])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="admin-display mb-2 text-members-on-surface">Directorio de emprendedores</h1>
          <p className="admin-editor-body text-members-on-surface-variant">
            Gestiona y analiza a los miembros de la red Synergy.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-members-on-surface-variant" />
            <input
              className="admin-editor-body w-64 rounded-full border border-members-outline-variant bg-members-surface-container-low py-1.5 pl-10 pr-4 text-members-on-surface outline-none placeholder:text-members-on-surface-variant focus:border-members-primary focus:ring-1 focus:ring-members-primary"
              placeholder="Buscar directorio..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="admin-table-cell rounded-lg border border-members-outline-variant bg-members-surface-container px-3 py-2 text-members-on-surface outline-none focus:border-members-primary"
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value as 'all' | 'free' | 'pro')}
          >
            <option value="all">Todos los planes</option>
            <option value="pro">Pro</option>
            <option value="free">Free</option>
          </select>
          <select
            className="admin-table-cell rounded-lg border border-members-outline-variant bg-members-surface-container px-3 py-2 text-members-on-surface outline-none focus:border-members-primary"
            value={industryFilter}
            onChange={(event) => setIndustryFilter(event.target.value)}
          >
            <option value="all">Todas las industrias</option>
            {DIRECTORY_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="admin-table-cell flex items-center gap-2 rounded-lg border border-members-outline-variant bg-members-surface-container-high px-3 py-2 text-members-on-surface transition-colors hover:bg-members-surface-container-highest"
          >
            <Filter className="h-4 w-4" />
            Más filtros
          </button>
        </div>
      </div>

      <div className="relative md:hidden">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-members-on-surface-variant" />
        <input
          className="admin-table-cell w-full rounded-full border border-members-outline-variant bg-members-surface-container-low py-2 pl-10 pr-4 text-members-on-surface outline-none"
          placeholder="Buscar directorio..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {showFilters ? (
        <label className="admin-table-cell flex items-center gap-2 text-members-on-surface">
          <input type="checkbox" checked={recentOnly} onChange={(event) => setRecentOnly(event.target.checked)} />
          Solo activos recientes
        </label>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-members-outline-variant bg-members-surface-container-low px-3 py-2 text-sm text-members-on-surface-variant">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Miembros totales" value={directory.length} icon={<Users className="h-5 w-5" />} tone="primary" />
        <Stat label="Activos recientes" value={recentCount} icon={<Zap className="h-5 w-5" />} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <article
            key={item.member.id}
            className="group overflow-hidden rounded-xl border border-members-outline-variant bg-members-surface-container transition-colors hover:border-members-outline"
          >
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-members-surface-container-highest bg-members-primary-container text-sm font-bold text-white">
                    {initials(item.member.nombre)}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold leading-tight text-members-on-surface">{item.member.nombre}</h1>
                    <p className="mb-1 text-sm text-members-on-surface-variant">{item.member.empresa}</p>
                    <span
                      className={
                        item.member.plan === 'pro'
                          ? 'inline-flex items-center rounded border border-members-primary/30 bg-members-primary-container/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-members-primary'
                          : 'inline-flex items-center rounded border border-members-outline-variant bg-members-surface-variant px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-members-on-surface-variant'
                      }
                    >
                      Plan {item.member.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 text-members-on-surface-variant hover:text-members-on-surface"
                  aria-label="Más opciones"
                  onClick={() => setProfile(item)}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-members-outline-variant/50 bg-members-surface-container-low p-4">
                <div className="text-center">
                  <p className="mb-0.5 text-2xl font-semibold text-members-on-surface">{item.events}</p>
                  <p className="admin-label-caps text-members-on-surface-variant">Eventos</p>
                </div>
                <div className="border-l border-members-outline-variant/50 text-center">
                  <p className="mb-0.5 text-2xl font-semibold text-members-on-surface">{item.connections}</p>
                  <p className="admin-label-caps text-members-on-surface-variant">Conexiones</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-members-outline-variant bg-members-surface-container-low px-6 py-3">
              <div className="flex items-center gap-1.5">
                <div
                  className={
                    item.lastActive === 'recent'
                      ? 'h-2 w-2 rounded-full bg-members-success'
                      : 'h-2 w-2 rounded-full bg-members-outline'
                  }
                />
                <span className="text-xs text-members-on-surface-variant">{item.lastActiveLabel}</span>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-members-primary hover:text-[#e2dfff]"
                onClick={() => setProfile(item)}
              >
                Ver perfil
              </button>
            </div>
          </article>
        ))}
      </div>

      {pageCount > 1 ? (
        <nav aria-label="Paginación" className="flex items-center justify-center gap-1 pb-2">
          <button
            type="button"
            className="rounded-lg p-2 text-members-on-surface-variant hover:bg-members-surface-container-high disabled:opacity-50"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={
                number === safePage
                  ? 'h-8 w-8 rounded-lg border border-members-outline-variant bg-members-surface-container-high text-sm font-semibold text-members-on-surface'
                  : 'h-8 w-8 rounded-lg text-sm font-semibold text-members-on-surface-variant hover:bg-members-surface-container'
              }
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className="rounded-lg p-2 text-members-on-surface-variant hover:bg-members-surface-container-high disabled:opacity-50"
            disabled={safePage === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      ) : null}

      <section className="rounded-xl border border-members-outline-variant bg-members-surface-container p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="admin-section-title text-members-on-surface">Tarjetas del feed de Inicio</h1>
            <p className="admin-meta text-members-on-surface-variant">
              Esto es lo que ven los emprendedores en su tab Inicio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing({ ...emptyCard })}
            className="admin-table-cell flex items-center gap-2 rounded-lg bg-members-primary px-4 py-2 font-medium text-members-admin-surface"
          >
            <Plus className="h-4 w-4" />
            Nueva tarjeta
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article key={card.id} className="rounded-lg border border-members-outline-variant bg-members-surface-container-low p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-members-primary">
                {card.kind === 'highlight' ? 'Destacada' : 'Descubrir'} {card.published ? '' : '· oculta'}
              </p>
              <h1 className="mb-2 text-base font-semibold text-members-on-surface">{card.title}</h1>
              <p className="mb-4 line-clamp-3 text-sm text-members-on-surface-variant">{card.body}</p>
              <div className="flex gap-2">
                <AdminButton tone="ghost" onClick={() => setEditing(card)}>
                  Editar
                </AdminButton>
                <AdminButton
                  tone="danger"
                  onClick={() =>
                    void run(async () => {
                      await adminFetch('/api/admin-miembros/home', {
                        method: 'DELETE',
                        body: JSON.stringify({ id: card.id }),
                      })
                      const home = await adminFetch<{ data: CmsHomeCard[] }>('/api/admin-miembros/home')
                      setCards(home.data || [])
                    })
                  }
                >
                  Borrar
                </AdminButton>
              </div>
            </article>
          ))}
          {!cards.length ? (
            <p className="admin-table-cell text-members-on-surface-variant">
              Aún no hay tarjetas. Si no creas ninguna, Inicio sigue mostrando la actividad en vivo.
            </p>
          ) : null}
        </div>
      </section>

      {profile ? <MemberProfilePanel member={profile} onClose={() => setProfile(null)} /> : null}

      {editing ? (
        <Modal title={editing.id ? 'Editar tarjeta' : 'Nueva tarjeta'} onClose={() => setEditing(null)}>
          <div className="grid gap-4">
            <Field label="Tipo">
              <select
                className={inputClass}
                value={editing.kind}
                onChange={(event) => setEditing({ ...editing, kind: event.target.value as CmsHomeCard['kind'] })}
              >
                <option value="highlight">Destacada</option>
                <option value="discover">Descubrir red</option>
              </select>
            </Field>
            <Field label="Título">
              <input className={inputClass} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Texto">
              <textarea className={inputClass} rows={4} value={editing.body || ''} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </Field>
            <Field label="Imagen (URL)">
              <input className={inputClass} value={editing.image_url || ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            </Field>
            <Field label="Enlace">
              <input className={inputClass} value={editing.href || ''} onChange={(e) => setEditing({ ...editing, href: e.target.value })} />
            </Field>
            <Field label="Badge">
              <input className={inputClass} value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-members-on-surface">
              <input
                type="checkbox"
                checked={editing.published !== false}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              Publicada
            </label>
            <AdminButton
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await adminFetch('/api/admin-miembros/home', { method: 'POST', body: JSON.stringify(editing) })
                  setEditing(null)
                  const home = await adminFetch<{ data: CmsHomeCard[] }>('/api/admin-miembros/home')
                  setCards(home.data || [])
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

function Stat({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: ReactNode
  tone: 'primary' | 'success'
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-members-outline-variant bg-members-surface-container p-4">
      <div>
        <p className="admin-label-caps mb-1 text-members-on-surface-variant">{label}</p>
        <p className="text-2xl font-bold text-members-on-surface">{value}</p>
      </div>
      <div
        className={
          tone === 'primary'
            ? 'flex h-10 w-10 items-center justify-center rounded-full bg-members-primary-container/20 text-members-primary'
            : 'flex h-10 w-10 items-center justify-center rounded-full bg-members-success/20 text-members-success'
        }
      >
        {icon}
      </div>
    </div>
  )
}
