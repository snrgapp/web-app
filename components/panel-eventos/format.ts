import type { EventoPlat } from '@/app/actions/eventos-platform'

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export function hoyBogota() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' })
}

export function mesBogota() {
  return new Date().toLocaleDateString('es-CO', { month: 'long', timeZone: 'America/Bogota' })
}

export function fechaParts(fecha: string | null) {
  if (!fecha) return { mes: '—', dia: '—' }
  const [, m, day] = fecha.slice(0, 10).split('-')
  return { mes: MESES[Number(m) - 1] || '—', dia: String(Number(day)) }
}

export function fechaLarga(fecha: string | null, hora?: string | null) {
  if (!fecha) return 'Sin fecha'
  const d = new Date(`${fecha.slice(0, 10)}T12:00:00`)
  const texto = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
  const h = hora ? hora.slice(0, 5) : ''
  return h ? `${texto} · ${h}` : texto
}

export function money(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  const out = parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
  return out || '·'
}

export function hace(iso: string | null) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.max(0, Math.round(diff / 60000))
  if (m < 1) return 'Ahora'
  if (m < 60) return `Hace ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `Hace ${h} h`
  return `Hace ${Math.round(h / 24)} d`
}

export function formatoLabel(formato: string) {
  if (formato === 'virtual') return 'Remoto'
  if (formato === 'hibrido') return 'Híbrido'
  return 'Presencial'
}

export type FiltroEvento = 'todos' | 'proximos' | 'pasados' | 'borradores'

export function grupoEvento(e: Pick<EventoPlat, 'fecha' | 'estado'>, hoy: string): Exclude<FiltroEvento, 'todos'> {
  if (e.estado === 'borrador') return 'borradores'
  if (e.estado === 'finalizado' || (e.fecha && e.fecha.slice(0, 10) < hoy)) return 'pasados'
  return 'proximos'
}

export function estadoVisual(e: Pick<EventoPlat, 'fecha' | 'estado'>, hoy: string) {
  if (e.estado === 'borrador') return { label: 'Borrador', tone: 'muted' as const }
  if (e.fecha?.slice(0, 10) === hoy) return { label: 'Activo', tone: 'indigo' as const }
  if (grupoEvento(e, hoy) === 'pasados') return { label: 'Pasado', tone: 'muted' as const }
  return { label: 'Publicado', tone: 'green' as const }
}
