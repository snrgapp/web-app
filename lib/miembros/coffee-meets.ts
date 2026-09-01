export type OneToOneMeet = {
  id: string
  nombre: string
  empresa: string
  rol: string
  fecha: string
  estado: 'aceptado' | 'proximo'
}

export type GroupCoffee = {
  id: string
  titulo: string
  anfitrion: string
  tema: string
  fecha: string
  lugar: string
  ocupados: number
  cupos: number
}

export type NetworkingEvent = {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  ciudad: string
  asistentes: number
  image: string
  link: string
}

export const DUMMY_ONE_TO_ONES: OneToOneMeet[] = [
  {
    id: '1on1-1',
    nombre: 'Camila Restrepo',
    empresa: 'Nubia Pay',
    rol: 'Founder',
    fecha: '2026-09-02T09:30:00',
    estado: 'aceptado',
  },
  {
    id: '1on1-2',
    nombre: 'Diego Álvarez',
    empresa: 'Ruta Norte',
    rol: 'CEO',
    fecha: '2026-09-04T16:00:00',
    estado: 'proximo',
  },
  {
    id: '1on1-3',
    nombre: 'Valentina Ortiz',
    empresa: 'Kora Health',
    rol: 'Co-founder',
    fecha: '2026-09-08T11:00:00',
    estado: 'aceptado',
  },
  {
    id: '1on1-4',
    nombre: 'Andrés Molina',
    empresa: 'Stack Latam',
    rol: 'Founder',
    fecha: '2026-09-11T15:30:00',
    estado: 'proximo',
  },
]

export const DUMMY_GROUP_COFFEES: GroupCoffee[] = [
  {
    id: 'group-1',
    titulo: 'Mesa de early-stage',
    anfitrion: 'Laura Peña',
    tema: 'Cómo cerrar los primeros 10 clientes B2B',
    fecha: '2026-09-03T10:00:00',
    lugar: 'Café 404, Medellín',
    ocupados: 4,
    cupos: 6,
  },
  {
    id: 'group-2',
    titulo: 'Founders de producto',
    anfitrion: 'Mateo Ríos',
    tema: 'Retention y onboarding sin quemar el runway',
    fecha: '2026-09-10T17:00:00',
    lugar: 'Café El Cielo, Bogotá',
    ocupados: 5,
    cupos: 6,
  },
  {
    id: 'group-3',
    titulo: 'Mesa de fundraising',
    anfitrion: 'Sofía Herrera',
    tema: 'Prep para seed: deck, métricas y warm intros',
    fecha: '2026-09-17T09:00:00',
    lugar: 'WeWork 93, Bogotá',
    ocupados: 3,
    cupos: 6,
  },
]

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sept',
  'oct',
  'nov',
  'dic',
]

function parseDateParts(value: string) {
  const [datePart, timePart = '00:00:00'] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  return { year, month, day, hour, minute }
}

export function formatMeetDate(value: string) {
  const { day, month, year } = parseDateParts(value)
  return `${day} de ${MONTHS_SHORT[month - 1]} de ${year}`
}

export function formatMeetTime(value: string) {
  const { hour, minute } = parseDateParts(value)
  const suffix = hour >= 12 ? 'p. m.' : 'a. m.'
  const hour12 = hour % 12 || 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`
}

export function formatEventWhen(value: string) {
  return formatMeetDate(value)
}

export const DUMMY_EVENTS: NetworkingEvent[] = [
  {
    id: 'event-1',
    titulo: 'Synergy Night Medellín',
    descripcion: 'Noche de networking para founders y makers. 90 minutos, mesas temáticas y after.',
    fecha: '2026-09-18',
    ciudad: 'Medellín',
    asistentes: 86,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
    link: 'https://luma.com/snrg',
  },
  {
    id: 'event-2',
    titulo: 'Demo Day Founders & Makers',
    descripcion: 'Seis startups en escenario y ronda abierta con operadores e inversores de la red.',
    fecha: '2026-10-02',
    ciudad: 'Bogotá',
    asistentes: 120,
    image: 'https://images.unsplash.com/photo-1514362545855-444688c1c58b?auto=format&fit=crop&w=900&q=80',
    link: 'https://luma.com/snrg',
  },
]
