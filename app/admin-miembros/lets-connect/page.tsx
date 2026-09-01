'use client'

import { useEffect, useMemo, useState } from 'react'
import { Handshake, Repeat } from 'lucide-react'
import { adminFetch, useBusy } from '@/components/admin-miembros/admin-ui'
import {
  DUMMY_ADMIN_PAIRING_CARDS,
  DUMMY_ADMIN_PAIRINGS,
} from '@/lib/admin-miembros/coffee-dummy'
import type { CmsMemberPairingCard, CmsPairing } from '@/lib/cms/types'

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function pairingWhen(value: string) {
  const date = new Date(value)
  const today = new Date()
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Hoy'
  }
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

export default function AdminLetsConnectPage() {
  const [cards, setCards] = useState<CmsMemberPairingCard[]>(DUMMY_ADMIN_PAIRING_CARDS)
  const [pairings, setPairings] = useState<CmsPairing[]>(DUMMY_ADMIN_PAIRINGS)
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro'>('all')
  const [interestFilter, setInterestFilter] = useState('all')
  const { error, run } = useBusy()

  async function load() {
    try {
      const result = await adminFetch<{ cards: CmsMemberPairingCard[]; pairings: CmsPairing[] }>(
        '/api/admin-miembros/pairings'
      )
      setCards(result.cards?.length ? result.cards : DUMMY_ADMIN_PAIRING_CARDS)
      setPairings(result.pairings?.length ? result.pairings : DUMMY_ADMIN_PAIRINGS)
    } catch {
      setCards(DUMMY_ADMIN_PAIRING_CARDS)
      setPairings(DUMMY_ADMIN_PAIRINGS)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const interests = useMemo(() => {
    const values = new Set(cards.map((card) => card.member.empresa).filter(Boolean))
    return [...values]
  }, [cards])

  const visibleCards = useMemo(() => {
    return cards.filter((card) => {
      const planOk = planFilter === 'all' || card.member.plan === planFilter
      const interestOk = interestFilter === 'all' || card.member.empresa === interestFilter
      return planOk && interestOk
    })
  }, [cards, planFilter, interestFilter])

  const confirmed = pairings.filter((item) => item.status === 'confirmed')
  const pending = pairings.filter((item) => item.status === 'requested')

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="admin-display mb-2 text-members-on-surface">Let&apos;s Connect Monitor</h1>
          <p className="admin-editor-body text-members-on-surface-variant">
            Auditoría de emparejamientos y cupos por plan.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="admin-table-cell rounded-md border border-members-outline-variant bg-members-surface-container px-3 py-2 text-members-on-surface outline-none focus:border-members-primary focus:ring-1 focus:ring-members-primary"
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value as 'all' | 'free' | 'pro')}
          >
            <option value="all">Todos los planes</option>
            <option value="free">Plan Free</option>
            <option value="pro">Plan Pro</option>
          </select>
          <select
            className="admin-table-cell rounded-md border border-members-outline-variant bg-members-surface-container px-3 py-2 text-members-on-surface outline-none focus:border-members-primary focus:ring-1 focus:ring-members-primary"
            value={interestFilter}
            onChange={(event) => setInterestFilter(event.target.value)}
          >
            <option value="all">Todos los intereses</option>
            {interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-members-outline-variant bg-members-surface-container-low px-3 py-2 text-sm text-members-on-surface-variant">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <h1 className="admin-label-caps mb-4 border-b border-members-outline-variant pb-2 text-members-on-surface-variant">
            Cupos activos de emprendedores
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleCards.map((card) => {
              const percent = Math.min(100, Math.round((card.monthUsed / card.monthLimit) * 100))
              return (
                <article
                  key={card.member.id}
                  className="rounded-lg border border-members-outline-variant bg-members-surface-container p-5 transition-colors hover:bg-members-surface-container-high"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="admin-label-caps flex h-10 w-10 items-center justify-center rounded bg-members-surface-container-highest text-members-on-surface">
                        {initials(card.member.nombre)}
                      </div>
                      <div>
                        <h1 className="admin-table-cell font-semibold text-members-on-surface">
                          {card.member.nombre}
                        </h1>
                        <span
                          className={
                            card.member.plan === 'pro'
                              ? 'admin-label-caps mt-1 inline-block rounded bg-members-primary/20 px-2 py-0.5 text-members-primary'
                              : 'admin-label-caps mt-1 inline-block rounded bg-members-surface-variant px-2 py-0.5 text-members-on-surface-variant'
                          }
                        >
                          Plan {card.member.plan === 'pro' ? 'Pro' : 'Free'}
                        </span>
                      </div>
                    </div>
                    <span className="admin-label-caps rounded bg-members-success/10 px-2 py-1 text-members-success">
                      Activo
                    </span>
                  </div>
                  <p className="mb-3 admin-meta text-members-on-surface-variant">
                    {card.member.empresa || 'Sin empresa'}
                  </p>
                  <div className="mt-4">
                    <div className="admin-table-cell mb-1 flex justify-between text-members-on-surface-variant">
                      <span>Emparejamientos este mes</span>
                      <span>
                        {card.monthUsed} / {card.monthLimit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-members-surface-container-highest">
                      <div
                        className="h-1.5 rounded-full bg-members-primary"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="flex h-full flex-col rounded-xl border border-members-outline-variant bg-members-surface-container">
          <div className="sticky top-0 rounded-t-xl border-b border-members-outline-variant bg-members-admin-surface-container p-4">
            <h1 className="admin-label-caps flex items-center gap-2 text-members-on-surface">
              <Handshake className="h-[18px] w-[18px] text-members-primary" />
              Conexiones confirmadas
            </h1>
          </div>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {[...confirmed, ...pending].map((pairing) => (
              <article
                key={pairing.id}
                className="flex items-center justify-between rounded-lg border border-members-outline-variant bg-members-surface-container-high p-3"
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="admin-table-cell text-members-on-surface">{pairing.requester_nombre}</span>
                    <Repeat className="h-4 w-4 shrink-0 text-members-on-surface-variant" />
                    <span className="admin-table-cell text-members-on-surface">{pairing.target_nombre}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="admin-label-caps text-members-on-surface-variant">
                      Match: {pairingWhen(pairing.created_at)}
                    </span>
                    {pairing.status === 'confirmed' ? (
                      <span className="admin-label-caps rounded bg-members-success/10 px-1.5 py-0.5 text-members-success">
                        Aceptado
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="admin-label-caps rounded bg-members-pending/10 px-1.5 py-0.5 text-members-pending"
                        onClick={() =>
                          void run(async () => {
                            if (pairing.id.startsWith('pair-')) {
                              setPairings((current) =>
                                current.map((item) =>
                                  item.id === pairing.id ? { ...item, status: 'confirmed' } : item
                                )
                              )
                              return
                            }
                            await adminFetch('/api/admin-miembros/pairings', {
                              method: 'POST',
                              body: JSON.stringify({ id: pairing.id }),
                            })
                            await load()
                          })
                        }
                      >
                        Pendiente
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
