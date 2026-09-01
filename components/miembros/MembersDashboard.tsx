'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'
import { OnboardingProgressCard } from '@/components/miembros/OnboardingProgressCard'
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Compass,
  Loader2,
  Plus,
  Video,
} from 'lucide-react'

type Connection = {
  id: string
  nombre: string
  empresa: string
}

type UpcomingEvent = {
  id: string
  titulo?: string | null
  fecha?: string | null
  ciudad?: string | null
  link?: string | null
}

type CafeInvitation = {
  id: string
  nombre: string
  empresa?: string
  created_at: string
}

function firstNameFrom(fullName?: string | null) {
  const name = (fullName || '').trim()
  return name.split(/\s+/)[0] || 'ahí'
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatEventDate(value?: string | null) {
  if (!value) return 'Fecha por confirmar'
  const d = new Date(`${value}T12:00:00`)
  return d.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function MembersDashboard() {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const to = (href: string) => membersHref(href, basePath)
  const [firstName, setFirstName] = useState('ahí')
  const [connections, setConnections] = useState<Connection[]>([])
  const [nextEvent, setNextEvent] = useState<UpcomingEvent | null>(null)
  const [nextCafe, setNextCafe] = useState<CafeInvitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [homeCards, setHomeCards] = useState<{ kind: string; title: string; body: string; image_url: string; href: string; badge: string }[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const fetchAll = () =>
          Promise.all([
            fetch('/api/miembros/auth/session'),
            fetch('/api/miembros/connections'),
            fetch('/api/miembros/upcoming-eventos'),
            fetch('/api/miembros/cafe-invitations'),
            fetch('/api/miembros/cms/home'),
          ])

        let [sessionRes, connectionsRes, eventsRes, cafeRes, homeRes] = await fetchAll()
        if (sessionRes.status === 401) {
          ;[sessionRes, connectionsRes, eventsRes, cafeRes, homeRes] = await fetchAll()
        }

        if (sessionRes.status === 401) {
          window.location.href = '/miembros/login'
          return
        }

        const session = sessionRes.ok ? await sessionRes.json() : null
        const connectionsData = connectionsRes.ok ? await connectionsRes.json() : {}
        const eventsData = eventsRes.ok ? await eventsRes.json() : {}
        const cafeData = cafeRes.ok ? await cafeRes.json() : {}

        if (cancelled) return

        setFirstName(firstNameFrom(session?.nombre))
        setConnections((connectionsData?.latestConnections || []).slice(0, 3))
        setNextEvent((eventsData?.events || [])[0] || null)
        setNextCafe((cafeData?.invitations || [])[0] || null)
        const homeData = homeRes.ok ? await homeRes.json() : {}
        setHomeCards(homeData?.cards || [])
      } catch {
        if (!cancelled) {
          setConnections([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-members-primary" />
        <p className="text-sm text-members-on-surface-variant">lo bueno toma tiempo</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-6 sm:px-6 md:px-10 md:pt-10">
      <header className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 text-[28px] font-semibold leading-8 tracking-tight text-members-on-surface sm:text-4xl sm:leading-[44px]">
            Hola, {firstName}.
          </h1>
          <p className="text-sm leading-6 text-members-on-surface-variant sm:text-base">
            Tu red está activa. Hagamos que hoy cuente.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={to('/coffee-meets')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-members-border bg-members-surface px-4 py-2.5 text-sm text-members-on-surface transition-colors hover:bg-[#1A1A1A]"
          >
            <Calendar className="h-4 w-4" />
            Agendar
          </Link>
          <Link
            href={to('/lets-connect')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-members-primary-container px-4 py-2.5 text-sm text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-colors hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Nueva conexión
          </Link>
        </div>
      </header>

      <OnboardingProgressCard to={to} />

      <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-12 lg:grid-cols-12">
        <div className="group relative min-h-[280px] overflow-hidden rounded-xl border border-members-border bg-members-surface transition-colors hover:border-[#333333] sm:min-h-[320px] lg:col-span-8">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url('${homeCards.find((card) => card.kind === 'highlight')?.image_url || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80'}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-members-surface to-transparent" />
          <div className="relative flex h-full min-h-[280px] flex-col justify-end p-5 sm:min-h-[320px] sm:p-8">
            <div className="mb-4 inline-flex w-max items-center gap-2 rounded-full bg-members-surface-container-high/80 px-3 py-1.5 text-xs font-semibold text-members-secondary backdrop-blur">
              <div className="h-2 w-2 animate-members-pulse rounded-full bg-members-success" />
              {homeCards.find((card) => card.kind === 'highlight')?.badge || 'Actividad en vivo'}
            </div>
            <h1 className="mb-2 text-xl font-semibold leading-7 tracking-tight text-members-on-surface sm:text-2xl sm:leading-8">
              {homeCards.find((card) => card.kind === 'highlight')?.title ||
                nextEvent?.titulo ||
                'La red Synergy está en movimiento'}
            </h1>
            <p className="mb-6 max-w-xl text-sm leading-5 text-members-on-surface-variant">
              {homeCards.find((card) => card.kind === 'highlight')?.body ||
                (nextEvent
                  ? `${formatEventDate(nextEvent.fecha)}${nextEvent.ciudad ? ` · ${nextEvent.ciudad}` : ''}. Revisa el calendario y reserva tu lugar.`
                  : 'Explora founders y makers cerca de ti, agenda cafés y llega a la próxima reunión con contexto.')}
            </p>
            <Link
              href={to('/coffee-meets')}
              className="inline-flex w-max items-center gap-2 rounded-lg border border-members-border bg-members-surface px-5 py-2 text-sm font-semibold text-members-on-surface transition-all hover:bg-members-surface-bright/20"
            >
              {nextEvent ? 'Ver evento' : 'Explorar red'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-members-border bg-members-surface p-5 transition-colors hover:border-[#333333] hover:bg-[#1A1A1A] sm:p-6 lg:col-span-4">
          <div className="mb-6 flex items-start justify-between">
            <h1 className="flex items-center gap-2 text-base font-semibold text-members-on-surface">
              <Calendar className="h-5 w-5 text-members-primary" />
              Próxima sesión
            </h1>
            <span className="rounded bg-[#1A1A1A] px-2 py-1 font-mono text-xs text-members-on-surface-variant">
              {nextEvent ? formatEventDate(nextEvent.fecha) : nextCafe ? 'Café' : 'Libre'}
            </span>
          </div>

          {nextEvent ? (
            <>
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-members-primary/30 bg-members-surface-variant text-lg font-bold text-members-on-surface">
                  {initials(nextEvent.titulo || 'SN')}
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-7 text-members-on-surface">
                    {nextEvent.titulo}
                  </h1>
                  <p className="text-sm text-members-on-surface-variant">
                    {nextEvent.ciudad || 'Synergy'}
                  </p>
                </div>
              </div>
              <div className="mb-6 rounded-lg border border-members-border bg-members-surface-container-low p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-members-on-surface-variant">
                  Tema
                </p>
                <p className="text-sm text-members-on-surface">
                  Próxima reunión de la comunidad
                </p>
              </div>
              {nextEvent.link ? (
                <a
                  href={nextEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-members-primary-container py-2.5 text-sm text-white transition-colors hover:brightness-110"
                >
                  <Video className="h-4 w-4" />
                  Unirse
                </a>
              ) : (
                <Link
                  href={to('/coffee-meets')}
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-members-primary-container py-2.5 text-sm text-white transition-colors hover:brightness-110"
                >
                  <Video className="h-4 w-4" />
                  Ver eventos
                </Link>
              )}
            </>
          ) : nextCafe ? (
            <>
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-members-primary/30 bg-members-surface-variant text-lg font-bold text-members-on-surface">
                  {initials(nextCafe.nombre)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-7 text-members-on-surface">
                    {nextCafe.nombre}
                  </h1>
                  <p className="text-sm text-members-on-surface-variant">
                    {nextCafe.empresa || 'Café 1:1'}
                  </p>
                </div>
              </div>
              <div className="mb-6 rounded-lg border border-members-border bg-members-surface-container-low p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-members-on-surface-variant">
                  Tema
                </p>
                <p className="text-sm text-members-on-surface">Conversación de café</p>
              </div>
              <Link
                href={to('/coffee-meets')}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-members-primary-container py-2.5 text-sm text-white transition-colors hover:brightness-110"
              >
                <Video className="h-4 w-4" />
                Ver invitación
              </Link>
            </>
          ) : (
            <>
              <p className="mb-6 text-sm leading-6 text-members-on-surface-variant">
                Aún no tienes una sesión 1:1 ni un evento próximo. Agenda el siguiente encuentro.
              </p>
              <Link
                href="https://luma.com/snrg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-members-primary-container py-2.5 text-sm text-white transition-colors hover:brightness-110"
              >
                <Calendar className="h-4 w-4" />
                Ver calendario
              </Link>
            </>
          )}
        </div>
      </div>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold leading-7 text-members-on-surface">
              Conexiones recientes
            </h1>
            <p className="mt-1 text-sm text-members-on-surface-variant">
              Founders con los que te has sincronizado.
            </p>
          </div>
          <Link
            href={to('/coffee-meets')}
            className="inline-flex items-center gap-1 text-sm text-members-primary transition-colors hover:text-[#e2dfff]"
          >
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {connections.map((conn) => (
            <Link
              key={conn.id}
              href={to('/coffee-meets')}
              className="group cursor-pointer rounded-xl border border-members-border bg-members-surface p-5 transition-colors hover:border-[#333333] hover:bg-[#1A1A1A]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-members-surface-variant text-sm font-semibold text-members-on-surface">
                  {initials(conn.nombre)}
                </div>
                <div className="h-2 w-2 rounded-full bg-members-success" />
              </div>
              <h1 className="text-base font-semibold text-members-on-surface">{conn.nombre}</h1>
              <p className="mb-4 text-sm text-members-on-surface-variant">
                {conn.empresa || 'Founder'}
              </p>
              {conn.empresa ? (
                <div className="flex flex-wrap gap-2">
                  <span className="rounded border border-members-border bg-[#1A1A1A] px-2 py-1 text-xs font-medium text-members-on-surface-variant">
                    {conn.empresa}
                  </span>
                </div>
              ) : null}
            </Link>
          ))}

          {connections.length === 0 ? (
            <div className="rounded-xl border border-members-border bg-members-surface p-5 sm:col-span-2">
              <p className="text-sm text-members-on-surface-variant">
                Aún no tienes conexiones. Empieza por descubrir la red.
              </p>
            </div>
          ) : null}

          <Link
            href={to('/coffee-meets')}
            className="group relative min-h-[180px] cursor-pointer overflow-hidden rounded-xl border border-members-border bg-members-surface"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity transition-opacity group-hover:opacity-80"
              style={{
                backgroundImage: `url('${homeCards.find((card) => card.kind === 'discover')?.image_url || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'}')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-members-surface via-members-surface/80 to-transparent" />
            <div className="relative flex h-full min-h-[180px] flex-col justify-end p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-members-primary/30 bg-members-primary-container/20">
                <Compass className="h-5 w-5 text-members-primary" />
              </div>
              <h1 className="text-base font-semibold text-members-on-surface">
                {homeCards.find((card) => card.kind === 'discover')?.title || 'Descubrir red'}
              </h1>
              <p className="text-sm text-members-on-surface-variant">
                {homeCards.find((card) => card.kind === 'discover')?.body ||
                  'Encuentra founders según tu etapa de crecimiento.'}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
