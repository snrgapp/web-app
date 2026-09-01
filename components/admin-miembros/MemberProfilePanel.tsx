'use client'

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Coffee,
  Gift,
  Handshake,
  MessageCircle,
  Network,
  Pencil,
  Ticket,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { getMemberProfile, initials, type DirectoryMember } from '@/lib/admin-miembros/inicio-dummy'

const CLAIM_LABEL: Record<string, string> = {
  sent: 'Reclamado',
  requested: 'En proceso',
  failed: 'Fallido',
}

const CLAIM_CLASS: Record<string, string> = {
  sent: 'text-members-success bg-members-success/10 border-members-success/20',
  requested: 'text-members-pending bg-members-pending/10 border-members-pending/20',
  failed: 'text-members-outline bg-members-outline/10 border-members-outline/20',
}

const PAIR_LABEL: Record<string, string> = {
  confirmed: 'Activo',
  requested: 'Pendiente',
  declined: 'Rechazado',
}

const PAIR_CLASS: Record<string, string> = {
  confirmed: 'text-members-success bg-members-success/10 border-members-success/20',
  requested: 'text-members-pending bg-members-pending/10 border-members-pending/20',
  declined: 'text-members-outline bg-members-outline/10 border-members-outline/20',
}

export function MemberProfilePanel({
  member,
  onClose,
}: {
  member: DirectoryMember
  onClose: () => void
}) {
  const profile = getMemberProfile(member)

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-members-admin-surface">
      <div className="flex items-center justify-between border-b border-members-outline-variant px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={onClose}
          className="admin-table-cell flex items-center gap-2 text-members-on-surface-variant hover:text-members-on-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al directorio
        </button>
        <p className="admin-label-caps text-members-on-surface-variant">Perfil de miembro</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="relative overflow-hidden rounded-xl border border-members-outline-variant/30 bg-members-surface-container p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-members-primary-container/10 to-transparent" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-members-primary bg-members-primary-container text-xl font-bold text-white">
                    {initials(profile.member.nombre)}
                  </div>
                  <span
                    className={
                      profile.lastActive === 'recent'
                        ? 'absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-members-surface-container bg-members-success'
                        : 'absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-members-surface-container bg-members-outline'
                    }
                    title={profile.lastActiveLabel}
                  />
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-members-on-surface">{profile.member.nombre}</h1>
                    <span
                      className={
                        profile.member.plan === 'pro'
                          ? 'admin-label-caps rounded-full border border-[#ffb695]/30 bg-[#a44100] px-2 py-0.5 text-[#ffd2be]'
                          : 'admin-label-caps rounded-full border border-members-outline-variant bg-members-surface-variant px-2 py-0.5 text-members-on-surface-variant'
                      }
                    >
                      {profile.member.plan === 'pro' ? 'PRO' : 'FREE'}
                    </span>
                  </div>
                  <p className="admin-table-cell mb-3 text-members-on-surface-variant">
                    {profile.member.empresa} · {profile.company.role}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.company.tags.map((tag) => (
                      <span
                        key={tag}
                        className="admin-label-caps rounded-full border border-members-outline-variant/50 bg-members-surface-container-high px-3 py-1 text-members-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row gap-3 md:w-auto">
                <a
                  href={`mailto:${profile.member.email}`}
                  className="admin-table-cell flex flex-1 items-center justify-center gap-2 rounded-lg bg-members-primary-container px-5 py-2.5 font-semibold text-members-on-primary-container md:flex-none"
                >
                  <MessageCircle className="h-4 w-4" />
                  Mensaje
                </a>
                <button
                  type="button"
                  className="admin-table-cell flex flex-1 items-center justify-center gap-2 rounded-lg border border-members-outline-variant/50 bg-members-surface-container-high px-5 py-2.5 text-members-on-surface md:flex-none"
                  onClick={onClose}
                >
                  <Pencil className="h-4 w-4" />
                  Cerrar
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Kpi
              label="Conexiones"
              value={String(profile.connections)}
              hint="+12%"
              icon={<Network className="h-5 w-5 text-members-primary" />}
            />
            <Kpi
              label="Beneficios reclamados"
              value={String(profile.benefitsRedeemed)}
              icon={<Gift className="h-5 w-5 text-members-tertiary" />}
            />
            <Kpi
              label="Coffee & Meets"
              value={String(profile.coffees)}
              hint="Asistidos"
              icon={<Coffee className="h-5 w-5 text-members-on-surface-variant" />}
            />
            <article className="relative overflow-hidden rounded-xl border border-members-outline-variant/30 bg-members-surface-container p-5">
              <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-tl-full bg-members-primary/5" />
              <div className="relative z-10 mb-2 flex items-start justify-between">
                <span className="admin-label-caps text-members-on-surface-variant">Asistencia a eventos</span>
                <Ticket className="h-5 w-5 text-members-primary" />
              </div>
              <div className="relative z-10 flex items-end gap-2">
                <span className="text-3xl font-bold text-members-on-surface">{profile.attendance}%</span>
                <div className="mb-2 ml-2 h-1.5 w-full rounded-full bg-members-surface-container-highest">
                  <div className="h-1.5 rounded-full bg-members-primary" style={{ width: `${profile.attendance}%` }} />
                </div>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="overflow-hidden rounded-xl border border-members-outline-variant/30 bg-members-surface-container">
                <div className="flex items-center justify-between border-b border-members-outline-variant/30 bg-members-surface-container-low px-5 py-4">
                  <h1 className="admin-editor-body flex items-center gap-2 font-semibold text-members-on-surface">
                    <Handshake className="h-5 w-5 text-members-primary" />
                    Conexiones recientes (Let&apos;s Connect)
                  </h1>
                </div>
                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                  {profile.connectionsList.length ? (
                    profile.connectionsList.map((connection) => (
                      <article
                        key={connection.id}
                        className="flex items-center justify-between rounded-lg border border-members-outline-variant/20 bg-members-surface-container-high p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-members-primary-container text-[10px] font-bold text-white">
                            {initials(connection.name)}
                          </div>
                          <div>
                            <p className="admin-table-cell font-semibold text-members-on-surface">{connection.name}</p>
                            <p className="admin-label-caps text-members-on-surface-variant">
                              {connection.when} · {PAIR_LABEL[connection.status] || connection.status}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`admin-label-caps rounded-md border px-2.5 py-1 ${PAIR_CLASS[connection.status] || PAIR_CLASS.requested}`}
                        >
                          {PAIR_LABEL[connection.status] || connection.status}
                        </span>
                      </article>
                    ))
                  ) : (
                    <p className="admin-table-cell text-members-on-surface-variant">Aún no hay emparejamientos.</p>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-members-outline-variant/30 bg-members-surface-container">
                <div className="border-b border-members-outline-variant/30 bg-members-admin-surface-container px-5 py-4">
                  <h1 className="admin-editor-body flex items-center gap-2 font-semibold text-members-on-surface">
                    <Gift className="h-5 w-5 text-members-tertiary" />
                    Historial de beneficios
                  </h1>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-members-surface-variant bg-members-admin-surface-container">
                        <th className="admin-label-caps px-5 py-3 text-members-on-surface-variant">Beneficio</th>
                        <th className="admin-label-caps px-5 py-3 text-members-on-surface-variant">Marca</th>
                        <th className="admin-label-caps px-5 py-3 text-members-on-surface-variant">Fecha</th>
                        <th className="admin-label-caps px-5 py-3 text-right text-members-on-surface-variant">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.claims.map((claim) => (
                        <tr key={claim.id} className="h-14 border-b border-members-outline-variant/20 last:border-0 hover:bg-members-surface-container-high">
                          <td className="admin-table-cell px-5 py-2 font-medium text-members-on-surface">{claim.benefit}</td>
                          <td className="admin-table-cell px-5 py-2 text-members-on-surface-variant">{claim.brand}</td>
                          <td className="admin-table-cell px-5 py-2 text-members-on-surface-variant">
                            {new Date(claim.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-5 py-2 text-right">
                            <span className={`admin-label-caps rounded-md border px-2.5 py-1 ${CLAIM_CLASS[claim.status] || CLAIM_CLASS.requested}`}>
                              {CLAIM_LABEL[claim.status] || claim.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!profile.claims.length ? (
                        <tr>
                          <td className="admin-table-cell px-5 py-6 text-members-on-surface-variant" colSpan={4}>
                            Este founder aún no ha reclamado beneficios.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="overflow-hidden rounded-xl border border-members-outline-variant/30 bg-members-surface-container">
                <div className="border-b border-members-outline-variant/30 bg-members-surface-container-low px-5 py-4">
                  <h1 className="admin-editor-body flex items-center gap-2 font-semibold text-members-on-surface">
                    <Building2 className="h-5 w-5 text-members-on-surface-variant" />
                    Información de empresa
                  </h1>
                </div>
                <div className="space-y-4 p-5">
                  <InfoRow label="Industria" value={profile.company.industry} />
                  <InfoRow label="Etapa" value={profile.company.stage} />
                  <InfoRow label="Equipo" value={profile.company.team} />
                  <InfoRow label="Fundada" value={profile.company.founded} />
                  <InfoRow label="Ingresos est." value={profile.company.revenue} last />
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-members-outline-variant/30 bg-members-surface-container">
                <div className="border-b border-members-outline-variant/30 bg-members-surface-container-low px-5 py-4">
                  <h1 className="admin-editor-body flex items-center gap-2 font-semibold text-members-on-surface">
                    <CalendarDays className="h-5 w-5 text-members-on-surface-variant" />
                    Actividad Coffee & Meets
                  </h1>
                </div>
                <div className="relative p-5">
                  {profile.coffeeActivity.length ? (
                    <>
                      <div className="absolute bottom-5 left-[33px] top-5 w-px bg-members-outline-variant/30" />
                      <div className="relative z-10 space-y-6">
                        {profile.coffeeActivity.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div
                              className={
                                item.kind === 'group'
                                  ? 'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-members-primary bg-members-primary/20'
                                  : 'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-members-outline-variant bg-members-surface-container-highest'
                              }
                            >
                              {item.kind === 'group' ? (
                                <Users className="h-3.5 w-3.5 text-members-primary" />
                              ) : (
                                <Users className="h-3.5 w-3.5 text-members-on-surface-variant" />
                              )}
                            </div>
                            <div>
                              <p className="admin-table-cell font-medium leading-tight text-members-on-surface">{item.title}</p>
                              <p className="admin-label-caps mt-1 text-members-on-surface-variant">{item.when}</p>
                              <div className="mt-2 inline-block rounded-md border border-members-outline-variant/20 bg-members-surface-container-high p-2">
                                <span className="admin-label-caps text-members-primary">{item.status}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="admin-table-cell text-members-on-surface-variant">Sin cafés ni 1:1 todavía.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint?: string
  icon: ReactNode
}) {
  return (
    <article className="rounded-xl border border-members-outline-variant/30 bg-members-surface-container p-5 transition-colors hover:bg-members-surface-container-high">
      <div className="mb-2 flex items-start justify-between">
        <span className="admin-label-caps text-members-on-surface-variant">{label}</span>
        {icon}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-members-on-surface">{value}</span>
        {hint ? <span className="admin-table-cell mb-1 text-members-on-surface-variant">{hint}</span> : null}
      </div>
    </article>
  )
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${last ? 'pt-1' : 'border-b border-members-outline-variant/20 pb-3'}`}>
      <span className="admin-table-cell text-members-on-surface-variant">{label}</span>
      <span className="admin-table-cell font-medium text-members-on-surface">{value}</span>
    </div>
  )
}
