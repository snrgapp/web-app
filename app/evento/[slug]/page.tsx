export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  MapPin,
  User,
  ArrowRight,
  LogIn,
} from 'lucide-react'
import { getEventoConFormularioBySlug } from '@/app/actions/eventos'
import { getInscripcionFormUrl } from '@/lib/config'
import Navbar from '@/components/Navbar'

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

function formatFecha(fechaStr: string | null) {
  if (!fechaStr) return null
  const d = new Date(fechaStr + 'T12:00:00')
  const dia = d.getDate()
  const mes = MESES[d.getMonth()]
  const diaSemana = DIAS_SEMANA[d.getDay()]
  return `${diaSemana}, ${dia} de ${mes}`
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const data = await getEventoConFormularioBySlug(slug)
  if (!data) return { title: 'Evento no encontrado' }
  return {
    title: `${data.evento.titulo ?? 'Evento'} | Synergy`,
    description: data.evento.ciudad
      ? `Evento en ${data.evento.ciudad}. ${data.evento.titulo ?? ''}`
      : data.evento.titulo ?? undefined,
  }
}

export default async function EventoSlugPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getEventoConFormularioBySlug(slug)

  if (!data) {
    notFound()
  }

  const { evento, form } = data
  const inscripcionAbierta = evento.inscripcion_abierta !== false
  const fechaFormateada = formatFecha(evento.fecha)
  const checkinUrl = evento.checkin_slug
    ? `/checkin?event=${encodeURIComponent(evento.checkin_slug)}`
    : null

  const isExternalLink = evento.link != null && evento.link.trim() !== '' && evento.link.startsWith('http')

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Columna izquierda: poster (cuadrado, más compacto) y organización */}
            <div className="lg:col-span-1 space-y-6">
              <div className="relative aspect-square w-full max-w-[min(400px,95vw)] sm:max-w-[380px] lg:max-w-[420px] mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-zinc-200 shadow-lg">
                {evento.image_url ? (
                  evento.image_url.startsWith('/') ? (
                    <Image
                      src={evento.image_url}
                      alt={evento.titulo ?? 'Evento'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) min(400px, 95vw), (max-width: 1024px) 380px, 420px"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={evento.image_url}
                      alt={evento.titulo ?? 'Evento'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha: título, fecha, ubicación, botón, acerca de, presentado por */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFE100]/30 text-[#1a1a1a] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFE100]" />
                  Evento de networking
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">
                  {evento.titulo ?? 'Evento'}
                </h1>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-600">
                  {fechaFormateada && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      {fechaFormateada}
                    </span>
                  )}
                  {evento.ciudad && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      {evento.ciudad}
                    </span>
                  )}
                </div>
              </div>

              {/* Sección Inscripción */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4">Inscripción</h2>

                {inscripcionAbierta && (form || evento.link) ? (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-600">
                      ¡Bienvenido! Para unirte al evento, por favor solicita tu inscripción.
                    </p>
                    {form ? (
                      <a
                        href={getInscripcionFormUrl(form.slug)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-black/90 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Solicitar unirse
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : isExternalLink && evento.link ? (
                      <a
                        href={evento.link ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-black/90 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Solicitar unirse
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    La inscripción está cerrada para este evento.
                  </p>
                )}

                {checkinUrl && (
                  <div className="mt-6 pt-6 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 mb-3">
                      ¿Ya estás inscrito? Entra a la sala para ver tu mesa asignada.
                    </p>
                    <Link
                      href={checkinUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE100] text-[#1a1a1a] rounded-xl font-medium hover:bg-[#FFD600] transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar a la sala
                    </Link>
                  </div>
                )}
              </div>

              {/* Acerca del evento */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Acerca del evento</h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Una reunión diseñada para emprendedores que están construyendo en serio. Será un
                  espacio para conexiones, conversaciones y oportunidades reales de colaboración.
                </p>
              </div>

              {/* Presentado por */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Presentado por
                  </p>
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="" width={24} height={24} className="rounded-full" />
                    <span className="font-medium text-[#1a1a1a]">Synergy</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Conectamos a los Founders que construyen el futuro en Latam.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Organizado por
                  </p>
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="" width={20} height={20} className="rounded-full" />
                    <span className="font-medium text-[#1a1a1a]">Synergy</span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              {evento.ciudad && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                  <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Ubicación</h2>
                  <p className="text-sm text-zinc-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {evento.ciudad}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.ciudad + ', Colombia')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-[#1a1a1a] font-medium hover:underline"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              )}

              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#1a1a1a] transition-colors"
              >
                ← Volver a eventos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
