'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookmarkCheck,
  Cloud,
  ExternalLink,
  MapPin,
  Rocket,
  Search,
  Share2,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  FUNDING_FILTERS,
  RADAR_REVIEWED_AT,
  REGIONS,
  isOpenToday,
  matchesRegion,
  type Convocatoria,
  type FundingType,
} from '@/lib/radar-convocatorias-data'
import { subscribeRadarAlertasAction } from '@/app/actions/radar-alertas'

const selectClass =
  'w-full appearance-none rounded-xl border border-white/10 bg-[#2a2a2a] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FFD60A]'

function officialHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function urgencyClass(urgency: Convocatoria['urgency']) {
  if (urgency === 'urgent') return 'bg-red-500/15 text-red-300'
  if (urgency === 'closed') return 'bg-white/10 text-white/55'
  if (urgency === 'upcoming') return 'bg-white/10 text-white/70'
  if (urgency === 'continuous') return 'bg-white/10 text-white/70'
  return 'bg-[#FFD60A]/15 text-[#FFD60A]'
}

export default function RadarConvocatoriasPage({
  items,
  refreshedAt,
}: {
  items: Convocatoria[]
  refreshedAt: string | null
}) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [funding, setFunding] = useState<'all' | FundingType>('all')
  const [stage, setStage] = useState('all')
  const [sector, setSector] = useState('all')
  const [openOnly, setOpenOnly] = useState(true)
  const [sort, setSort] = useState('close')
  const [saved, setSaved] = useState<string[]>([])
  const [alertOk, setAlertOk] = useState(false)
  const [alertError, setAlertError] = useState('')
  const [contact, setContact] = useState('')
  const [alertRegion, setAlertRegion] = useState('bogota')
  const [alertChannel, setAlertChannel] = useState('email')
  const [pendingAlert, startAlert] = useTransition()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter((item) => {
      if (funding !== 'all' && item.funding !== funding) return false
      if (stage !== 'all' && item.stage !== 'ambas' && item.stage !== stage) return false
      if (sector !== 'all' && item.sector !== 'multi' && item.sector !== sector) return false
      if (!matchesRegion(item, region)) return false
      if (openOnly && !isOpenToday(item)) return false
      if (
        q &&
        !`${item.entity} ${item.title} ${item.keywords} ${item.tags.join(' ')}`
          .toLowerCase()
          .includes(q)
      ) {
        return false
      }
      return true
    })

    if (sort === 'amount') {
      list = [...list].sort((a, b) => b.amountValue.localeCompare(a.amountValue))
    } else if (sort === 'recent') {
      list = [...list].reverse()
    }
    return list
  }, [items, query, region, funding, stage, sector, openOnly, sort])

  const counts = useMemo(() => {
    const base = items.filter((item) => matchesRegion(item, region))
    return {
      all: base.length,
      capital: base.filter((i) => i.funding === 'capital').length,
      semilla: base.filter((i) => i.funding === 'semilla').length,
      aceleradora: base.filter((i) => i.funding === 'aceleradora').length,
      cofinanciacion: base.filter((i) => i.funding === 'cofinanciacion').length,
    }
  }, [items, region])

  function clearFilters() {
    setQuery('')
    setRegion('all')
    setFunding('all')
    setStage('all')
    setSector('all')
    setOpenOnly(true)
    setSort('close')
  }

  async function share(item: Convocatoria) {
    const text = `${item.entity} — ${item.title}\nFuente oficial: ${item.basesUrl}`
    if (navigator.share) {
      await navigator.share({ title: item.title, text, url: item.basesUrl }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(item.basesUrl)
  }

  return (
    <main className="synergy-page-dots-dark min-h-screen text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-center px-4 py-6 md:px-8">
        <Image
          src="/logo.png"
          alt="Synergy"
          width={40}
          height={40}
          className="h-10 w-10 object-contain brightness-0 invert"
        />
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-10 text-center md:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#FFD60A]">
          Radar de convocatorias
          <span className="text-white/50">· Synergy Networking Colombia</span>
        </div>
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight md:text-5xl">
          Convocatorias de financiación y aceleración para emprendedores en Colombia
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-white/60 md:text-base">
          Explora y postula a fondos semilla, subsidios de capital no reembolsable y programas
          de aceleración para etapas temprana y mediana en todos los sectores.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          <Metric
            icon={<Rocket className="h-5 w-5" />}
            title={`${items.filter(isOpenToday).length} abiertas`}
            sub={`${items.length} fichas · ${refreshedAt ? new Date(refreshedAt).toLocaleDateString('es-CO') : RADAR_REVIEWED_AT}`}
          />
          <Metric icon={<Wallet className="h-5 w-5" />} title="Portales oficiales" sub="SENA, iNNpulsa, MinCiencias…" />
          <Metric icon={<Cloud className="h-5 w-5 text-[#FFD60A]" />} title="100% multisectorial" sub="Todos los rubros" />
          <Metric icon={<MapPin className="h-5 w-5" />} title="Cobertura total" sub="32 departamentos" />
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#141414] p-2.5 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl bg-[#2a2a2a] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-white/35 focus:ring-1 focus:ring-[#FFD60A]"
              placeholder="Buscar por entidad (SENA, iNNpulsa, MinCiencias...), sector o palabra clave..."
            />
          </div>
          <div className="relative w-full md:w-60">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={cn(selectClass, 'pl-10 pr-8 py-3')}
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-black"
          >
            Explorar
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141414] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
              Tipo de financiamiento
            </span>
            <button type="button" onClick={clearFilters} className="text-xs text-[#FFD60A] hover:underline">
              Limpiar todos
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {FUNDING_FILTERS.map((f) => {
              const active = funding === f.value
              const n = counts[f.value]
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFunding(f.value)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                    active ? 'bg-[#FFD60A] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]',
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-bold',
                      active ? 'bg-black/15' : 'bg-white/10 text-white/60',
                    )}
                  >
                    {n}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 items-end gap-3 rounded-xl bg-[#1a1a1a] p-3 md:grid-cols-12">
            <label className="flex flex-col gap-1 md:col-span-4">
              <span className="text-[11px] font-bold text-white/45">Etapa del negocio</span>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className={selectClass}>
                <option value="all">Todas las etapas</option>
                <option value="temprana">Etapa temprana (idea / prototipo / primeras ventas)</option>
                <option value="mediana">Etapa mediana (tracción / crecimiento)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 md:col-span-4">
              <span className="text-[11px] font-bold text-white/45">Sector económico</span>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className={selectClass}>
                <option value="all">Multisectorial</option>
                <option value="tech">Tecnología y digital</option>
                <option value="agro">Agroindustria y alimentos</option>
                <option value="comercio">Comercio, moda y retail</option>
                <option value="sostenibilidad">Sostenibilidad</option>
                <option value="salud">Salud y servicios</option>
              </select>
            </label>
            <div className="flex items-center justify-between gap-3 pt-1 md:col-span-4 md:pt-5">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="h-4 w-4 accent-[#FFD60A]"
                />
                Abiertas hoy
              </label>
              <label className="flex items-center gap-1.5 text-xs text-white/50">
                Orden:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#2a2a2a] px-2 py-1.5 text-xs text-white outline-none"
                >
                  <option value="close">Próximas a cerrar</option>
                  <option value="amount">Mayor monto</option>
                  <option value="recent">Más recientes</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Convocatorias abiertas destacadas</h2>
            <p className="text-sm text-white/50">
              Revisadas el {RADAR_REVIEWED_AT}. Cada ficha abre la convocatoria oficial para que puedas contrastar título, monto y cierre.
            </p>
          </div>
          <span className="hidden rounded-full bg-[#2a2a2a] px-3 py-1 text-[11px] text-white/60 sm:inline-block">
            Mostrando {filtered.length} de {items.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-[#141414] p-8 text-center text-sm text-white/50">
            No hay convocatorias con esos filtros. Prueba “Limpiar todos”.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#141414] p-5"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className={cn(
                          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-extrabold',
                          item.accent === 'yellow'
                            ? 'bg-[#FFD60A]/15 text-[#FFD60A]'
                            : item.accent === 'slate'
                              ? 'bg-white/10 text-white'
                              : 'bg-white/10 text-white',
                        )}
                      >
                        {item.initials}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="truncate text-sm font-bold">{item.entity}</p>
                        <p className="text-xs text-white/45">{item.entitySub}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        urgencyClass(item.urgency),
                      )}
                    >
                      {item.urgencyLabel}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold leading-snug">
                    <a
                      href={item.basesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 text-white hover:text-[#FFD60A] hover:underline"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0" aria-hidden />
                    </a>
                  </h3>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-[11px] text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mb-3 rounded-xl bg-[#1a1a1a] p-3">
                    <p className="text-[11px] uppercase text-white/40">{item.amountLabel}</p>
                    <p className="text-lg font-extrabold text-[#FFD60A]">{item.amountValue}</p>
                    {item.amountHint ? (
                      <p className="text-xs text-white/45">{item.amountHint}</p>
                    ) : null}
                  </div>
                  <p className="mb-3 line-clamp-3 text-sm text-white/55">{item.summary}</p>
                  <p className="mb-3 text-xs text-white/45">Requisito: {item.requirement}</p>
                  <a
                    href={item.basesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 block truncate rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-left text-[11px] text-[#FFD60A] hover:underline"
                  >
                    Fuente oficial: {officialHost(item.basesUrl)}
                  </a>
                </div>
                <div className="-mx-5 -mb-5 flex items-center gap-2 rounded-b-2xl bg-[#1a1a1a] px-5 py-3">
                  <a
                    href={item.basesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFD60A] py-2.5 text-center text-sm font-semibold text-black"
                  >
                    Abrir convocatoria oficial
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                  <button
                    type="button"
                    title="Guardar"
                    onClick={() =>
                      setSaved((prev) =>
                        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                      )
                    }
                    className="rounded-lg bg-[#2a2a2a] p-2.5 text-white/70 hover:text-[#FFD60A]"
                  >
                    {saved.includes(item.id) ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="Compartir"
                    onClick={() => share(item)}
                    className="rounded-lg bg-[#2a2a2a] p-2.5 text-white/70 hover:text-white"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-8">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#141414] px-3 py-1 text-xs font-semibold text-[#FFD60A]">
                <Bell className="h-4 w-4" />
                Alertas de convocatorias
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
                Nunca más te pierdas una fecha de cierre
              </h3>
              <p className="max-w-xl text-sm text-white/55">
                Recibes un correo de confirmación ahora y, cada lunes, tres convocatorias con enlace
                a las bases oficiales.
              </p>
            </div>
            <form
              className="space-y-3 rounded-2xl border border-white/10 bg-[#141414] p-6 lg:col-span-6"
              onSubmit={(e) => {
                e.preventDefault()
                setAlertError('')
                startAlert(async () => {
                  const result = await subscribeRadarAlertasAction({
                    contact,
                    departamento: alertRegion,
                    canal: alertChannel,
                  })
                  if (result.success) setAlertOk(true)
                  else setAlertError(result.error || 'No se pudo activar.')
                })
              }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-left">
                  <span className="mb-1 block text-[11px] font-bold text-white/45">Departamento</span>
                  <select
                    value={alertRegion}
                    onChange={(e) => setAlertRegion(e.target.value)}
                    className={selectClass}
                  >
                    <option value="bogota">Bogotá D.C.</option>
                    <option value="antioquia">Antioquia</option>
                    <option value="valle">Valle del Cauca</option>
                    <option value="caribe">Atlántico / Bolívar</option>
                    <option value="santander">Santander</option>
                    <option value="eje">Caldas / Risaralda / Quindío</option>
                    <option value="otro">Otro departamento</option>
                  </select>
                </label>
                <label className="block text-left">
                  <span className="mb-1 block text-[11px] font-bold text-white/45">Canal preferido</span>
                  <select
                    value={alertChannel}
                    onChange={(e) => setAlertChannel(e.target.value)}
                    className={selectClass}
                  >
                    <option value="email">Correo electrónico</option>
                    <option value="whatsapp">WhatsApp / SMS</option>
                    <option value="ambos">Ambos canales</option>
                  </select>
                </label>
              </div>
              <label className="block text-left">
                <span className="mb-1 block text-[11px] font-bold text-white/45">
                  Correo electrónico o celular
                </span>
                <div className="flex gap-2">
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-[#2a2a2a] px-4 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#FFD60A]"
                    placeholder="ejemplo@emprendimiento.co o 310..."
                  />
                  <button
                    type="submit"
                    disabled={pendingAlert}
                    className="flex-shrink-0 rounded-xl bg-[#FFD60A] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
                  >
                    {pendingAlert ? 'Activando…' : 'Activar alertas'}
                  </button>
                </div>
              </label>
              {alertOk ? (
                <p className="text-xs text-[#FFD60A]">
                  Listo. Si dejaste un correo, te acaba de llegar la confirmación.
                </p>
              ) : (
                <p className="text-[11px] text-white/35">
                  {alertError ||
                    'Tratamiento de datos bajo la Ley 1581 de Habeas Data. Puedes cancelar con un clic en cada correo.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode
  title: string
  sub: string
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-left">
      <span className="text-white">{icon}</span>
      <div>
        <span className="block text-xs font-bold md:text-sm">{title}</span>
        <span className="block text-[11px] text-white/45">{sub}</span>
      </div>
    </div>
  )
}
