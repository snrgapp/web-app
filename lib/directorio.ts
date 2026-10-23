export const DIRECTORIO_EVENT_SLUG = 'synergy-oct-20'
export const DIRECTORIO_DIAS = 7
export const DIRECTORIO_SESSION_KEY = 'directorio_session'

export type DirectorioCardTone = {
  bg: string
  fg: string
  onMuted: string
  panel: string
  divider: string
  chip: string
  actionBg: string
  actionFg: string
}

export const DIRECTORIO_CARD_TONES: DirectorioCardTone[] = [
  {
    bg: '#d4ff00',
    fg: '#111318',
    onMuted: 'rgba(17,19,24,0.8)',
    panel: 'rgba(0,0,0,0.05)',
    divider: 'rgba(0,0,0,0.1)',
    chip: 'rgba(0,0,0,0.1)',
    actionBg: '#111318',
    actionFg: '#d4ff00',
  },
  {
    bg: '#ff7300',
    fg: '#111318',
    onMuted: 'rgba(17,19,24,0.8)',
    panel: 'rgba(0,0,0,0.05)',
    divider: 'rgba(0,0,0,0.1)',
    chip: 'rgba(0,0,0,0.1)',
    actionBg: '#111318',
    actionFg: '#ff7300',
  },
  {
    bg: '#0044ff',
    fg: '#ffffff',
    onMuted: 'rgba(255,255,255,0.8)',
    panel: 'rgba(255,255,255,0.1)',
    divider: 'rgba(255,255,255,0.2)',
    chip: 'rgba(255,255,255,0.2)',
    actionBg: '#ffffff',
    actionFg: '#0044ff',
  },
  {
    bg: '#7b00ff',
    fg: '#ffffff',
    onMuted: 'rgba(255,255,255,0.8)',
    panel: 'rgba(255,255,255,0.1)',
    divider: 'rgba(255,255,255,0.2)',
    chip: 'rgba(255,255,255,0.2)',
    actionBg: '#ffffff',
    actionFg: '#7b00ff',
  },
  {
    bg: '#ff007f',
    fg: '#ffffff',
    onMuted: 'rgba(255,255,255,0.8)',
    panel: 'rgba(255,255,255,0.1)',
    divider: 'rgba(255,255,255,0.2)',
    chip: 'rgba(255,255,255,0.2)',
    actionBg: '#ffffff',
    actionFg: '#ff007f',
  },
]

export function cierreDirectorio(fechaEvento: string): Date {
  const [y, m, d] = fechaEvento.split('-').map(Number)
  // Último instante del día 7 (fecha + 6 días) en Bogotá
  return new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00-05:00`)
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime())
  next.setTime(next.getTime() + days * 24 * 60 * 60 * 1000)
  return next
}

export function finAccesoDirectorio(fechaEvento: string): Date {
  const start = cierreDirectorio(fechaEvento)
  // 7 días corridos desde el día del evento, hasta las 23:59 de Bogotá del séptimo día
  const endDay = addDays(start, DIRECTORIO_DIAS - 1)
  return new Date(endDay.getTime() + (23 * 60 + 59) * 60 * 1000 + 59 * 1000)
}

export function directorioAbierto(fechaEvento: string, now = new Date()): boolean {
  return now.getTime() <= finAccesoDirectorio(fechaEvento).getTime()
}

export function diasRestantesDirectorio(fechaEvento: string, now = new Date()): number {
  const end = finAccesoDirectorio(fechaEvento)
  const ms = end.getTime() - now.getTime()
  if (ms <= 0) return 0
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

export function iniciales(nombre?: string | null, apellido?: string | null): string {
  const a = nombre?.trim()?.[0] ?? ''
  const b = apellido?.trim()?.[0] ?? ''
  return `${a}${b}`.toUpperCase() || 'S'
}

export function mesaCorta(codigo?: string | null, mesa?: string | null): string {
  const from = (codigo || mesa || '').match(/(\d+)/)
  return from ? `Mesa ${from[1]}` : 'Mesa'
}

export function recorte(texto?: string | null, max = 90): string {
  if (!texto) return '—'
  const one = texto.replace(/\s+/g, ' ').trim()
  if (one.length <= max) return one
  return `${one.slice(0, max - 1).trim()}…`
}

export function telefonoWhatsApp(telefono?: string | null): string | null {
  if (!telefono) return null
  const digits = telefono.replace(/\D/g, '')
  if (!digits) return null
  const intl = digits.length === 10 ? `57${digits}` : digits
  return `https://wa.me/${intl}`
}

export function telefonoVisible(telefono?: string | null): string {
  const digits = (telefono ?? '').replace(/\D/g, '')
  const local = digits.length > 10 ? digits.slice(-10) : digits
  if (local.length !== 10) return telefono ?? ''
  return `+57 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
}

export function categoriaSector(sector?: string | null): string {
  const s = (sector ?? '').toLowerCase()
  if (s.includes('educa')) return 'Educación'
  if (s.includes('talento') || s.includes('rrhh')) return 'Talento humano'
  if (s.includes('evento')) return 'Eventos'
  if (s.includes('construcc')) return 'Construcción'
  if (s.includes('alimento')) return 'Alimentos'
  if (s.includes('fideliz')) return 'Fidelización'
  return 'Tecnología'
}

export type DirectorioSession = {
  asistenteId: string
  eventoId: string
}
