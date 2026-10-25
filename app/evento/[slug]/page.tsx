export const dynamic = 'force-dynamic'
export const revalidate = 0

import { unstable_noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ArrowUpRight, Award, CalendarCheck, CalendarDays, Download, MapPin, Navigation, Users, Video } from 'lucide-react'
import { getEventoPublicoBySlug } from '@/app/actions/eventos'
import { camposPublicos } from '@/lib/registro-evento'
import RegistroEvento from '@/components/evento/RegistroEvento'
import EventoTabs from '@/components/evento/EventoTabs'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const T = {
  label: 'text-[13px] leading-4 tracking-[0.01em] font-semibold',
  labelSm: 'text-[11px] leading-[14px] tracking-[0.04em] font-semibold',
  body: 'text-[13px] leading-[18px]',
  boton:
    'h-7 px-2.5 rounded-lg bg-white hover:bg-[#eeedf7] text-[#1a1b22] text-[11px] leading-[14px] tracking-[0.04em] font-semibold flex items-center gap-1.5 shadow-sm transition-colors w-fit',
  tarjeta: 'p-4 rounded-xl bg-[#f4f2fd] flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
  icono: 'w-10 h-10 rounded-lg bg-[#e3e1ec] flex items-center justify-center shrink-0',
}

const FORMATOS: Record<string, string> = { presencial: 'Presencial', virtual: 'Virtual', hibrido: 'Híbrido' }

type BloqueAgenda = { inicio?: string; fin?: string; titulo?: string; detalle?: string; lugar?: string }
type Patrocinador = { nombre?: string; rol?: string; logo_url?: string; url?: string }

function fechaLarga(fecha: string) {
  const f = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  })
  return f.charAt(0).toUpperCase() + f.slice(1)
}

/** Fecha y hora en UTC para calendarios (Colombia es UTC-5 todo el año). */
function utc(fecha: string, hora: string) {
  const [h, m] = hora.split(':').map(Number)
  return new Date(`${fecha}T00:00:00Z`).getTime() + ((h + 5) * 60 + (m || 0)) * 60000
}

function calendario(e: { titulo: string; fecha: string; inicio: string | null; fin: string | null; lugar: string; detalle: string }) {
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  let rango: [string, string]
  if (e.inicio) {
    const desde = utc(e.fecha, e.inicio)
    const hasta = e.fin ? utc(e.fecha, e.fin) : desde + 2 * 3600000
    rango = [fmt(desde), fmt(hasta > desde ? hasta : hasta + 86400000)]
  } else {
    const dia = e.fecha.replace(/-/g, '')
    const siguiente = new Date(new Date(`${e.fecha}T00:00:00Z`).getTime() + 86400000).toISOString().slice(0, 10).replace(/-/g, '')
    rango = [dia, siguiente]
  }
  const google =
    'https://calendar.google.com/calendar/render?' +
    new URLSearchParams({ action: 'TEMPLATE', text: e.titulo, dates: rango.join('/'), location: e.lugar, details: e.detalle })
  const esc = (s: string) => s.replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Synergy//Eventos//ES',
    'BEGIN:VEVENT',
    `UID:${rango[0]}-${encodeURIComponent(e.titulo)}@snrg.lat`,
    `DTSTAMP:${fmt(Date.now())}`,
    e.inicio ? `DTSTART:${rango[0]}` : `DTSTART;VALUE=DATE:${rango[0]}`,
    e.inicio ? `DTEND:${rango[1]}` : `DTEND;VALUE=DATE:${rango[1]}`,
    `SUMMARY:${esc(e.titulo)}`,
    `LOCATION:${esc(e.lugar)}`,
    `DESCRIPTION:${esc(e.detalle)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return { google, ics: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics) }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const data = await getEventoPublicoBySlug(slug)
  if (!data) return { title: 'Evento no encontrado' }
  return {
    title: `${data.evento.titulo ?? 'Evento'} | Synergy`,
    description: data.evento.ciudad
      ? `Evento en ${data.evento.ciudad}. ${data.evento.titulo ?? ''}`
      : data.evento.titulo ?? undefined,
  }
}

export default async function EventoSlugPage({ params }: PageProps) {
  unstable_noStore()
  const { slug } = await params
  const data = await getEventoPublicoBySlug(slug)
  if (!data) notFound()

  const { campos, whatsappPagos, politicaReembolso, ocupados } = data
  const evento = data.evento as typeof data.evento & {
    formato?: string | null
    capacidad?: number | null
    precio_cop?: number | null
    hora_inicio?: string | null
    hora_fin?: string | null
    lugar?: string | null
    agenda?: BloqueAgenda[] | null
    lista_espera?: boolean | null
    patrocinadores?: Patrocinador[] | null
    incluye?: string | null
  }
  const titulo = evento.titulo ?? 'Evento'
  const virtual = evento.formato === 'virtual'
  const capacidad = Number(evento.capacidad) || 0
  const restantes = capacidad ? Math.max(0, capacidad - ocupados) : null
  const inscripcionAbierta =
    evento.inscripcion_abierta !== false && evento.estado !== 'borrador' && evento.estado !== 'archivado'
  const rawLink = evento.link?.trim() ?? ''
  const linkExterno = rawLink ? (/^https?:\/\//.test(rawLink) ? rawLink : `https://${rawLink}`) : null
  const sede = [evento.lugar, evento.ciudad].filter(Boolean).join(', ')
  const agenda = (Array.isArray(evento.agenda) ? evento.agenda : []).filter((b) => b?.titulo)
  const patrocinadores = (Array.isArray(evento.patrocinadores) ? evento.patrocinadores : []).filter((s) => s?.nombre)
  const incluye = evento.incluye?.trim() || null
  const acerca = evento.acerca_del_evento?.trim() || 'Pronto compartiremos todos los detalles de este encuentro.'
  const cal = evento.fecha
    ? calendario({
        titulo,
        fecha: evento.fecha,
        inicio: evento.hora_inicio || null,
        fin: evento.hora_fin || null,
        lugar: virtual ? 'Evento virtual' : sede,
        detalle: `https://snrg.lat/evento/${slug}`,
      })
    : null

  const disponibilidad = !inscripcionAbierta
    ? 'Inscripción cerrada'
    : restantes === null
      ? 'Inscripción abierta'
      : restantes === 0
        ? evento.lista_espera
          ? 'Cupos agotados · lista de espera'
          : 'Cupos agotados'
        : restantes <= 5
          ? 'Pocas entradas disponibles'
          : `${restantes} cupos disponibles`

  const tabs = [
    {
      id: 'agenda',
      label: 'Agenda',
      contenido:
        agenda.length > 0 ? (
          agenda.map((b, i) => (
            <div key={i} className="p-4 rounded-xl bg-white shadow-sm flex items-start gap-4">
              <span className={`${T.label} text-[#4648d4] shrink-0 pt-0.5`}>{b.inicio || '—'}</span>
              <div className="flex flex-col gap-0.5">
                <h4 className={`${T.label} text-[#1a1b22]`}>{b.titulo}</h4>
                {(b.detalle || b.lugar) && (
                  <p className={`${T.body} text-[#46464b]`}>{[b.detalle, b.lugar].filter(Boolean).join(' · ')}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-xl bg-white shadow-sm">
            <p className={`${T.body} text-[#46464b]`}>La agenda se publicará pronto.</p>
          </div>
        ),
    },
    politicaReembolso && {
      id: 'detalles',
      label: 'Detalles',
      contenido: (
        <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col gap-2">
          <h4 className={`${T.label} text-[#1a1b22]`}>Política de reembolso</h4>
          <p className={`${T.body} text-[#46464b] whitespace-pre-line`}>{politicaReembolso}</p>
        </div>
      ),
    },
  ].filter(Boolean) as { id: string; label: string; contenido: React.ReactNode }[]

  return (
    <div className={`${jakarta.className} bg-[#fbf8ff] text-[#1a1b22] antialiased selection:bg-[#e1e0ff]`}>
      <header className="fixed top-0 w-full z-50 bg-[#fbf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.png" alt="" width={56} height={56} className="w-14 h-14 -ml-3 mix-blend-multiply" priority />
            <span className={`${T.label} text-[15px]`}>Synergy</span>
          </Link>
          <Link
            href="/eventos"
            className={`h-9 px-4 rounded-lg bg-black hover:bg-[#1a1b21] text-white ${T.label} flex items-center gap-2 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98]`}
          >
            Más eventos
          </Link>
        </div>
      </header>

      <main className="w-full pt-16 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            <div className="w-full lg:w-7/12 flex flex-col gap-8">
              <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-black via-[#1a1b21] to-[#4648d4]">
                {evento.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={evento.image_url}
                    alt={titulo}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image src="/logowhite.png" alt="" width={240} height={240} className="w-48 h-48 sm:w-60 sm:h-60 opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1a1b22] ${T.labelSm} shadow-sm`}>
                    <span className={`w-2 h-2 rounded-full ${inscripcionAbierta && restantes !== 0 ? 'bg-[#4648d4] animate-pulse' : 'bg-[#77767b]'}`} />
                    {disponibilidad}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className={`text-[#6ffbbe] ${T.label} tracking-wider uppercase`}>
                      Evento {FORMATOS[evento.formato ?? ''] ?? 'Presencial'}
                    </span>
                    <p className={`text-white ${T.body} opacity-90 truncate`}>
                      {[evento.ciudad, 'Comunidad Synergy'].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                  {ocupados > 0 && (
                    <span className={`h-8 px-3 rounded-full bg-black text-white ${T.labelSm} flex items-center gap-1.5 shadow-sm shrink-0`}>
                      <Users className="w-3.5 h-3.5" />+{ocupados}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h1 className="text-[36px] leading-[44px] tracking-[-0.025em] sm:text-[56px] sm:leading-[64px] sm:tracking-[-0.03em] font-bold">
                    {titulo}
                  </h1>
                  <p className="text-[17px] leading-[26px] text-[#46464b] whitespace-pre-line">{acerca}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className={T.tarjeta}>
                    <div className="flex items-start gap-3.5">
                      <div className={T.icono}>
                        <CalendarDays className="w-5 h-5 text-[#4648d4]" />
                      </div>
                      <div className="flex flex-col">
                        <span className={T.label}>{evento.fecha ? fechaLarga(evento.fecha) : 'Fecha por confirmar'}</span>
                        <span className={`${T.body} text-[#46464b]`}>
                          {evento.hora_inicio
                            ? `${evento.hora_inicio}${evento.hora_fin ? ` — ${evento.hora_fin}` : ''} hrs (hora Colombia)`
                            : 'Hora por confirmar'}
                        </span>
                      </div>
                    </div>
                    {cal && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a href={cal.google} target="_blank" rel="noopener noreferrer" className={T.boton}>
                          <CalendarCheck className="w-3.5 h-3.5" />
                          Google Calendar
                        </a>
                        <a href={cal.ics} download={`${slug}.ics`} className={T.boton}>
                          <Download className="w-3.5 h-3.5" />
                          Apple iCal
                        </a>
                      </div>
                    )}
                  </div>

                  <div className={T.tarjeta}>
                    <div className="flex items-start gap-3.5">
                      <div className={T.icono}>
                        {virtual ? <Video className="w-5 h-5 text-[#4648d4]" /> : <MapPin className="w-5 h-5 text-[#4648d4]" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`${T.label} truncate`}>{virtual ? 'Evento virtual' : evento.lugar || 'Sede por confirmar'}</span>
                        <span className={`${T.body} text-[#46464b] truncate`}>
                          {virtual ? 'El enlace llega a tu correo al inscribirte' : evento.ciudad || ''}
                        </span>
                      </div>
                    </div>
                    {!virtual && sede && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede + ', Colombia')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={T.boton}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Abrir en Mapas
                      </a>
                    )}
                  </div>
                </div>

                {!virtual && sede && (
                  <div className="w-full h-36 rounded-xl overflow-hidden relative shadow-sm">
                    <iframe
                      title={`Mapa de ${sede}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(sede + ', Colombia')}&z=15&output=embed`}
                      className="w-full h-full border-0 grayscale-[30%]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 pointer-events-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4648d4]" />
                      <span className={T.labelSm}>{sede}</span>
                    </div>
                  </div>
                )}
              </div>

              {patrocinadores.length > 0 && (
                <div className="p-5 sm:p-6 rounded-xl bg-[#f4f2fd] shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#4648d4]" />
                        <h3 className="text-[20px] leading-[28px] tracking-[-0.01em] font-semibold">Sponsors &amp; Aliados Oficiales</h3>
                      </div>
                      <p className={`${T.body} text-[#46464b]`}>Empresas e instituciones que impulsan este encuentro.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {patrocinadores.map((s, i) => {
                      const card = (
                        <div className="p-3.5 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center gap-2 text-center min-w-0 h-full hover:shadow-md transition-shadow">
                          <div className="w-10 h-10 rounded-lg bg-[#e3e1ec] flex items-center justify-center overflow-hidden shrink-0">
                            {s.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.logo_url} alt="" className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className={`${T.label} text-[#46464b]`}>{(s.nombre ?? '?').slice(0, 1)}</span>
                            )}
                          </div>
                          <div className="flex flex-col items-center min-w-0 w-full">
                            <span className={`${T.label} leading-tight truncate w-full`}>{s.nombre}</span>
                            {s.rol && <span className={`${T.labelSm} text-[#46464b] truncate w-full`}>{s.rol}</span>}
                          </div>
                        </div>
                      )
                      return s.url ? (
                        <a key={i} href={/^https?:\/\//.test(s.url) ? s.url : `https://${s.url}`} target="_blank" rel="noopener noreferrer">
                          {card}
                        </a>
                      ) : (
                        <div key={i}>{card}</div>
                      )
                    })}
                  </div>
                </div>
              )}

              <EventoTabs tabs={tabs} />
            </div>

            <div className="w-full lg:w-5/12 flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="w-full rounded-2xl bg-white p-6 sm:p-7 shadow-xl flex flex-col gap-6">
                <div className="pb-2">
                  <h2 className="text-[24px] leading-[32px] tracking-[-0.015em] font-semibold">Registro oficial</h2>
                  <p className={`${T.body} text-[#46464b]`}>Confirma tu cupo en tiempo real</p>
                </div>

                {!inscripcionAbierta ? (
                  <div className="p-4 rounded-xl bg-[#f4f2fd] flex flex-col gap-1">
                    <span className="text-[20px] leading-[28px] font-semibold">Inscripciones cerradas</span>
                    <span className={`${T.body} text-[#46464b]`}>Este evento ya no recibe nuevas inscripciones.</span>
                  </div>
                ) : linkExterno ? (
                  <a
                    href={linkExterno}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-xl bg-black hover:bg-[#1a1b21] text-white text-[17px] font-semibold flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all"
                  >
                    Solicitar unirse
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                ) : (
                  <RegistroEvento
                    slug={slug}
                    titulo={titulo}
                    campos={camposPublicos(campos)}
                    whatsappPagos={whatsappPagos}
                    precio={Number(evento.precio_cop) || 0}
                    incluye={incluye}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white py-12 shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="" width={44} height={44} className="w-11 h-11 mix-blend-multiply" />
            <span className={T.label}>Synergy</span>
          </div>
          <div className="flex items-center gap-6">
            <Link className={`${T.body} text-[#46464b] hover:text-[#1a1b22] transition-colors`} href="/terminos">
              Términos
            </Link>
            <Link className={`${T.body} text-[#46464b] hover:text-[#1a1b22] transition-colors`} href="/politica-privacidad">
              Privacidad
            </Link>
            <Link className={`${T.body} text-[#46464b] hover:text-[#1a1b22] transition-colors`} href="/contacto">
              Soporte
            </Link>
          </div>
          <p className={`${T.body} text-[#46464b]`}>© {new Date().getFullYear()} Synergy · Founders &amp; Makers</p>
        </div>
      </footer>
    </div>
  )
}
