'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  getHackathonBadgePayload,
  getHackathonConexiones,
  getHackathonMiEquipoSticky,
  getHackathonUltimasAsignaciones,
  obtenerMisIntencionesHackathon,
  registrarIntencionHackathon,
  type HackathonBadgePayload,
  type HackathonConexionUsuario,
  type HackathonMiEquipoSticky,
  type HackathonRecienteEnEquipo,
  type HackathonRoleClass,
} from '@/app/actions/hackathon-networking'

const STORAGE_PHONE = 'hackathon_viewer_phone'

const NEON_CLASS: Record<HackathonRoleClass, string> = {
  'role-blue': 'neon-blue',
  'role-green': 'neon-green',
  'role-yellow': 'neon-yellow',
  'role-purple': 'neon-purple',
}

const ROLE_BG: Record<HackathonRoleClass, string> = {
  'role-purple': '#2a0880',
  'role-green': '#003d20',
  'role-yellow': '#3d3600',
  'role-blue': '#00293d',
}

function hackathonQrSvg(seed: string): string {
  const cell = 48 / 9
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) | 0
  const n = 9
  let rects = ''
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const inF = (i < 3 && j < 3) || (i < 3 && j >= n - 3) || (i >= n - 3 && j < 3)
      let fill = 0
      if (inF) {
        const fi = i < 3 ? i : n - 1 - i
        const fj = j < 3 ? j : n - 1 - j
        fill =
          fi === 0 || fi === 2 || fj === 0 || fj === 2 || (fi === 1 && fj === 1) ? 1 : 0
      } else {
        fill = Math.abs((h * (i * n + j + 7) * 2654435761) | 0) % 3 > 0 ? 1 : 0
      }
      if (fill) {
        rects += `<rect x="${j * cell}" y="${i * cell}" width="${cell - 0.9}" height="${
          cell - 0.9
        }" fill="#0f0f0f"/>`
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">${rects}</svg>`
}

const STORAGE_ID = 'hackathon_submission_id'

export default function HackathonShell() {
  const router = useRouter()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [tab, setTab] = useState<'badge' | 'conn'>('badge')
  const [ronda, setRonda] = useState<1 | 2>(1)

  const [badge, setBadge] = useState<HackathonBadgePayload | null>(null)
  const [equipo, setEquipo] = useState<HackathonMiEquipoSticky | null>(null)
  const [conexiones, setConexiones] = useState<HackathonConexionUsuario[]>([])
  const [recientes, setRecientes] = useState<HackathonRecienteEnEquipo[]>([])
  const [loading, setLoading] = useState(true)
  const [connLoading, setConnLoading] = useState(false)
  const [viewerPhone, setViewerPhone] = useState<string | null>(null)
  const [intentions, setIntentions] = useState<Record<string, 'interested' | 'pass'>>({})
  const [intentBusyId, setIntentBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const p =
      sessionStorage.getItem(STORAGE_PHONE) ?? localStorage.getItem(STORAGE_PHONE)
    setViewerPhone(p)
  }, [])

  useEffect(() => {
    const sid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_ID) ?? localStorage.getItem(STORAGE_ID)
        : null
    if (!sid) {
      router.replace('/networking/hackathon/verify')
      return
    }
    setSubmissionId(sid)
  }, [router])

  useEffect(() => {
    if (!submissionId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const b = await getHackathonBadgePayload(submissionId)
      if (cancelled) return
      setBadge(b)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [submissionId])

  useEffect(() => {
    if (!submissionId) return
    void getHackathonUltimasAsignaciones(24).then(setRecientes)
  }, [submissionId])

  useEffect(() => {
    if (!submissionId || tab !== 'conn') return
    let cancelled = false
    ;(async () => {
      setConnLoading(true)
      const [e, c, r, intents] = await Promise.all([
        getHackathonMiEquipoSticky(submissionId, ronda),
        getHackathonConexiones(submissionId, ronda),
        getHackathonUltimasAsignaciones(24),
        viewerPhone
          ? obtenerMisIntencionesHackathon(viewerPhone, submissionId)
          : Promise.resolve({} as Record<string, 'interested' | 'pass'>),
      ])
      if (cancelled) return
      setEquipo(e)
      setConexiones(c)
      setRecientes(r)
      setIntentions(intents)
      setConnLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [submissionId, tab, ronda, viewerPhone])

  async function enviarIntencion(toSubmissionId: string, type: 'interested' | 'pass') {
    if (!submissionId || !viewerPhone) return
    setIntentBusyId(toSubmissionId)
    const res = await registrarIntencionHackathon({
      telefono: viewerPhone,
      fromSubmissionId: submissionId,
      toSubmissionId,
      type,
    })
    setIntentBusyId(null)
    if (res.ok) {
      setIntentions((prev) => ({ ...prev, [toSubmissionId]: type }))
    }
  }

  useEffect(() => {
    if (!submissionId) return
    const POLL_MS = 2500
    const id = setInterval(() => {
      void (async () => {
        const rec = await getHackathonUltimasAsignaciones(24)
        setRecientes(rec)
        if (tab !== 'conn') return
        const [e, c, intentsMaybe] = await Promise.all([
          getHackathonMiEquipoSticky(submissionId, ronda),
          getHackathonConexiones(submissionId, ronda),
          viewerPhone
            ? obtenerMisIntencionesHackathon(viewerPhone, submissionId)
            : Promise.resolve(null),
        ])
        setEquipo(e)
        setConexiones(c)
        if (intentsMaybe) setIntentions(intentsMaybe)
      })()
    }, POLL_MS)
    return () => clearInterval(id)
  }, [submissionId, tab, ronda, viewerPhone])

  const roleRootClass = badge?.roleClass ?? 'role-purple'

  const qrInner = useMemo(() => {
    if (!badge) return ''
    return hackathonQrSvg(`${badge.badgeId}·${badge.nombreCompleto}`)
  }, [badge])

  if (!submissionId) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#08080C] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#A87CFF]" />
      </div>
    )
  }

  if (loading && !badge) {
    return (
      <div
        className={`hackathon-app-root ${roleRootClass} min-h-dvh flex items-center justify-center bg-[#08080C]`}
      >
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--c)' }} />
      </div>
    )
  }

  if (!badge) {
    return (
      <div className="min-h-dvh bg-[#08080C] text-white flex flex-col items-center justify-center px-6">
        <p className="text-center text-sm font-semibold text-white/70">
          No pudimos cargar tu badge. Vuelve a verificar.
        </p>
        <button
          type="button"
          className="mt-6 text-[#A87CFF] font-bold text-sm"
          onClick={() => router.push('/networking/hackathon/verify')}
        >
          Ir a verificación
        </button>
      </div>
    )
  }

  const maxSlots = equipo?.cuposMax ?? 5
  const miembros = equipo?.miembros ?? []
  const vacios = Math.max(0, maxSlots - miembros.length)

  return (
    <div className={`hackathon-app-root ${roleRootClass} min-h-dvh bg-[#08080C] text-white`}>
      <div className="ha-noise" />

      <header className="relative z-20 flex items-center gap-3 px-4 pt-3 pb-2">
        <button
          type="button"
          className="p-2 -ml-2 rounded-lg text-white/70 hover:bg-white/5"
          aria-label="Volver"
          onClick={() => router.push('/home')}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="text-xs font-bold tracking-widest text-white/35 uppercase">
          Hackathon · Conexiones
        </span>
      </header>

      <div className="ha-picks relative z-10">
        <div className="ha-picks-label">Recién en equipo</div>
        <div className="ha-picks-row">
          {recientes.length === 0 ? (
            <span className="text-[11px] text-white/30 font-medium px-1">
              Aún no hay asignaciones publicadas.
            </span>
          ) : (
            recientes.map((p, idx) => (
              <div key={`${p.nombreCorto}-${p.equipoNumero}-${idx}`} className="ha-pick-chip">
                <div
                  className="ha-pick-av"
                  style={{
                    background: ROLE_BG[p.roleClass],
                    color: 'var(--c)',
                    boxShadow: `0 0 8px ${p.roleClass === 'role-purple' ? '#7b35ff' : '#00e87a'}`,
                  }}
                >
                  {p.iniciales}
                </div>
                <span>
                  {p.nombreCorto} · Eq. {p.equipoNumero}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`ha-view ${tab === 'badge' ? 'HaActive' : ''}`}>
        <div className="ha-scene" id="ha-scene">
          <div className="ha-badge-wrap" id="ha-badge">
            <div className="ha-lanyard">
              <span className="ha-lanyard-text">HACKATHON · BARRANQUILLA · SNRG</span>
            </div>
            <div className="ha-card-back" />
            <div className="ha-card-front">
              <div className="ha-cf-wash" />
              <div className="ha-cf-hd">
                <div className="ha-cf-logo">
                  barranquilla<em>.</em>hack
                </div>
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md border-[1.5px] text-[13px] font-black"
                  style={{
                    borderColor: 'var(--c)',
                    background: 'var(--c-soft)',
                    color: 'var(--c)',
                    boxShadow: '0 0 10px var(--c-glow)',
                  }}
                >
                  H
                </div>
              </div>
              <div className="ha-cf-id">
                <div className="ha-id-avatar">
                  <span className="ha-id-init">{badge.iniciales}</span>
                </div>
                <div className="ha-id-name">{badge.nombreDisplay}</div>
                <div className="ha-id-role">{badge.perfilLabel}</div>
              </div>
              <div className="ha-cf-info">
                <div className="flex gap-3 items-start">
                  <div className="flex-1 flex flex-col gap-2">
                    <div>
                      <div className="ha-il">Nivel</div>
                      <div className="ha-iv capitalize">{badge.nivelExperiencia}</div>
                    </div>
                    <div>
                      <div className="ha-il">Badge ID</div>
                      <div className="ha-iv">{badge.badgeId}</div>
                    </div>
                    <div>
                      <div className="ha-il">Lenguajes</div>
                      <div className="ha-iv text-[7px] leading-snug">
                        {badge.lenguajes.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="ha-il">Código</div>
                    <div
                      className="ha-qr-box"
                      dangerouslySetInnerHTML={{ __html: qrInner }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`ha-view ${tab === 'conn' ? 'HaActive' : ''}`}>
        <div className="ha-conn-sticky">
          <div className="ha-ronda-row">
            <button
              type="button"
              className={`ha-ronda-btn ${ronda === 1 ? 'HaRondaOn' : ''}`}
              onClick={() => setRonda(1)}
            >
              Ronda 1
            </button>
            <button
              type="button"
              className={`ha-ronda-btn ${ronda === 2 ? 'HaRondaOn' : ''}`}
              onClick={() => setRonda(2)}
            >
              Ronda 2
            </button>
          </div>
          <div className="ha-team-label">
            {equipo?.grupoNumero != null ? equipo.grupoNombre.toUpperCase() : 'SIN EQUIPO ASIGNADO'}
          </div>
          <div className="ha-team-row">
            <div className="flex items-end justify-center">
              {miembros.map((m) => (
                <div key={m.submissionId} className="ha-team-av-wrap">
                  <div
                    className="ha-team-av"
                    style={{
                      background: ROLE_BG[m.roleClass],
                      color: 'var(--c)',
                      borderColor: '#08080c',
                    }}
                  >
                    {m.iniciales}
                  </div>
                  <div className="ha-team-av-name">
                    {m.nombreCompleto.split(/\s+/)[0]}
                  </div>
                </div>
              ))}
            </div>
            <div className="ha-team-slots">
              {Array.from({ length: vacios }).map((_, i) => (
                <div key={i} className="ha-team-slot">
                  +
                </div>
              ))}
            </div>
          </div>
          <div className="ha-team-meta">
            <span className="text-white/50 font-bold">
              {equipo?.grupoNumero != null ? `${miembros.length} / ${maxSlots}` : '—'}
            </span>{' '}
            miembros
          </div>
        </div>
        <div className="ha-section-label">Conexiones sugeridas</div>
        {!viewerPhone && (
          <p className="text-center text-[10px] text-white/35 px-4 pb-2 leading-snug">
            Para usar Pasar / Guardar, verifica tu acceso otra vez con tu teléfono en esta app (así
            guardamos tu número solo en tu dispositivo).
          </p>
        )}
        <div className="ha-conn-list">
          {connLoading ? (
            <p className="text-center text-sm text-white/40 py-8">Cargando…</p>
          ) : conexiones.length === 0 ? (
            <p className="text-center text-sm text-white/40 py-8">
              Aún no hay conexiones para esta ronda.
            </p>
          ) : (
            conexiones.map((c) => {
              const chosen = intentions[c.id]
              const busy = intentBusyId === c.id
              const locked = Boolean(chosen) || busy || !viewerPhone
              return (
                <div
                  key={c.id}
                  className={`ha-conn-card relative ${NEON_CLASS[c.roleClass]}`}
                >
                  <div className="ha-cc-accent" />
                  <div className="ha-conn-av">
                    <span className="ha-conn-av-t">
                      {c.nombreCompleto
                        .split(/\s+/)
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="ha-conn-body">
                    <div className="ha-conn-name">{c.nombreCompleto}</div>
                    <span className="ha-conn-chip">{c.perfilLabel}</span>
                    {c.equipoLabel && (
                      <div className="mt-1 text-[9px] text-white/25 tracking-wide">
                        {c.equipoLabel}
                      </div>
                    )}
                  </div>
                  <div className="ha-conn-actions">
                    <button
                      type="button"
                      className="ha-intent-pass"
                      disabled={locked}
                      onClick={() => void enviarIntencion(c.id, 'pass')}
                    >
                      {busy ? '…' : chosen === 'pass' ? 'Pasaste' : 'Pasar'}
                    </button>
                    <button
                      type="button"
                      className="ha-intent-save"
                      disabled={locked}
                      onClick={() => void enviarIntencion(c.id, 'interested')}
                    >
                      {busy ? '…' : chosen === 'interested' ? 'Guardado' : 'Guardar'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <nav className="ha-tab-bar" aria-label="Navegación principal">
        <button
          type="button"
          className={`ha-tab-btn ${tab === 'badge' ? 'HaActive' : ''}`}
          onClick={() => setTab('badge')}
        >
          <span className="ha-tab-pip" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="3.5" />
            <line x1="8" y1="9" x2="14" y2="9" />
            <line x1="8" y1="13" x2="12" y2="13" />
          </svg>
          Mi badge
        </button>
        <button
          type="button"
          className={`ha-tab-btn ${tab === 'conn' ? 'HaActive' : ''}`}
          onClick={() => setTab('conn')}
        >
          <span className="ha-tab-pip" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="8" cy="8" r="3" />
            <circle cx="17" cy="8" r="3" />
            <path d="M2 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" />
            <path d="M17 13.5c2 0 4.5 1.2 4.5 3.5" />
          </svg>
          Conexiones
        </button>
      </nav>
    </div>
  )
}
