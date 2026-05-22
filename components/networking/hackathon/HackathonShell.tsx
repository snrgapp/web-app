'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react'
import {
  getHackathonBadgePayload,
  getHackathonConexiones,
  type HackathonBadgePayload,
  type HackathonConexionUsuario,
  type HackathonRoleClass,
} from '@/app/actions/hackathon-networking'
import { hackathonWhatsappMeetGreetHref } from '@/lib/hackathon-whatsapp'

const NEON_CLASS: Record<HackathonRoleClass, string> = {
  'role-blue': 'neon-blue',
  'role-green': 'neon-green',
  'role-yellow': 'neon-yellow',
  'role-purple': 'neon-purple',
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

function HackathonShellContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [tab, setTab] = useState<'badge' | 'conn'>('badge')
  const [ronda, setRonda] = useState<1 | 2>(1)

  const [badge, setBadge] = useState<HackathonBadgePayload | null>(null)
  const [conexiones, setConexiones] = useState<HackathonConexionUsuario[]>([])
  const [loading, setLoading] = useState(true)
  const [connLoading, setConnLoading] = useState(false)

  useEffect(() => {
    const momento = searchParams.get('momento')
    if (momento === 'tarde') {
      setRonda(2)
      router.replace('/networking/hackathon', { scroll: false })
    }
  }, [searchParams, router])

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
    if (!submissionId || tab !== 'conn') return
    let cancelled = false
    ;(async () => {
      setConnLoading(true)
      const c = await getHackathonConexiones(submissionId, ronda)
      if (cancelled) return
      setConexiones(c)
      setConnLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [submissionId, tab, ronda])

  useEffect(() => {
    if (!submissionId || tab !== 'conn') return
    const POLL_MS = 2500
    const id = setInterval(() => {
      void getHackathonConexiones(submissionId, ronda).then(setConexiones)
    }, POLL_MS)
    return () => clearInterval(id)
  }, [submissionId, tab, ronda])

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
          Hackathon · Networking
        </span>
      </header>

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
                      <div className="ha-il">Badge ID</div>
                      <div className="ha-iv">{badge.badgeId}</div>
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
        <div className="ha-conn-head px-4 pt-2 pb-3">
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
        </div>
        <div className="ha-section-label">Conexiones sugeridas</div>
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => router.push(`/networking/hackathon/questions?ronda=${ronda}`)}
            className="ha-hk-prompt-cta"
          >
            Preguntas para conversar · ronda {ronda}
          </button>
        </div>
        <div className="ha-conn-list">
          {connLoading ? (
            <p className="text-center text-sm text-white/40 py-8">Cargando…</p>
          ) : conexiones.length === 0 ? (
            <p className="text-center text-sm text-white/40 py-8">
              Aún no hay conexiones para esta ronda.
            </p>
          ) : (
            conexiones.map((c) => {
              const waHref = hackathonWhatsappMeetGreetHref(c.telefono)
              const telDisplay = c.telefono?.replace(/\D/g, '') || c.telefono || '—'
              return (
                <div key={c.id} className={`ha-conn-card ha-conn-card-solo ${NEON_CLASS[c.roleClass]}`}>
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
                    {waHref ? (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ha-conn-wa"
                        aria-label={`Abrir WhatsApp con mensaje de meet and greet: ${c.nombreCompleto}`}
                      >
                        <MessageCircle className="ha-conn-wa-icon" aria-hidden />
                        <span className="ha-conn-wa-tel">{telDisplay}</span>
                        <span className="ha-conn-wa-hint">WhatsApp</span>
                      </a>
                    ) : (
                      <div className="ha-conn-tel-fallback">
                        <span className="ha-conn-tel-label">Tel.</span>
                        <span className="ha-conn-tel-num">{telDisplay}</span>
                      </div>
                    )}
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

export default function HackathonShell() {
  return (
    <Suspense
      fallback={
        <div className="hackathon-app-root role-purple flex min-h-dvh items-center justify-center bg-[#08080C]">
          <Loader2 className="h-9 w-9 animate-spin text-[#A87CFF]" />
        </div>
      }
    >
      <HackathonShellContent />
    </Suspense>
  )
}
