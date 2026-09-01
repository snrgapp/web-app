import {
  DUMMY_EVENTS,
  DUMMY_GROUP_COFFEES,
  DUMMY_ONE_TO_ONES,
} from '@/lib/miembros/coffee-meets'
import type { CmsDirectoryMember, CmsEvent, CmsGroupCoffee, CmsPairing } from '@/lib/cms/types'

const DUMMY_FOUNDERS = [
  { id: 'dummy-camila', nombre: 'Camila Restrepo', empresa: 'Nubia Pay', email: 'camila@nubia.test' },
  { id: 'dummy-diego', nombre: 'Diego Álvarez', empresa: 'Ruta Norte', email: 'diego@ruta.test' },
  { id: 'dummy-valentina', nombre: 'Valentina Ortiz', empresa: 'Kora Health', email: 'vale@kora.test' },
  { id: 'dummy-andres', nombre: 'Andrés Molina', empresa: 'Stack Latam', email: 'andres@stack.test' },
  { id: 'dummy-laura', nombre: 'Laura Peña', empresa: 'Synergy', email: 'laura@snrg.test' },
  { id: 'dummy-mateo', nombre: 'Mateo Ríos', empresa: 'Synergy', email: 'mateo@snrg.test' },
  { id: 'dummy-sofia', nombre: 'Sofía Herrera', empresa: 'Synergy', email: 'sofia@snrg.test' },
]

const DUMMY_PLANS: Record<string, 'free' | 'pro'> = {
  'dummy-camila': 'free',
  'dummy-diego': 'pro',
  'dummy-valentina': 'pro',
  'dummy-andres': 'free',
  'dummy-laura': 'pro',
  'dummy-mateo': 'free',
  'dummy-sofia': 'pro',
}

const DUMMY_MONTH_USED: Record<string, number> = {
  'dummy-camila': 3,
  'dummy-diego': 12,
  'dummy-valentina': 8,
  'dummy-andres': 1,
  'dummy-laura': 5,
  'dummy-mateo': 4,
  'dummy-sofia': 2,
}

export const DUMMY_ADMIN_MEMBERS: CmsDirectoryMember[] = DUMMY_FOUNDERS.map((person) => ({
  ...person,
  phone: '',
  plan: DUMMY_PLANS[person.id] || 'free',
}))

const GROUP_SEATS: Record<string, string[]> = {
  'group-1': ['dummy-laura', 'dummy-camila', 'dummy-diego', 'dummy-valentina'],
  'group-2': ['dummy-mateo', 'dummy-andres', 'dummy-camila', 'dummy-diego', 'dummy-valentina'],
  'group-3': ['dummy-sofia', 'dummy-andres', 'dummy-laura'],
}

export const DUMMY_ADMIN_COFFEES: CmsGroupCoffee[] = DUMMY_GROUP_COFFEES.map((group) => ({
  id: group.id,
  titulo: group.titulo,
  anfitrion: group.anfitrion,
  tema: group.tema,
  fecha: group.fecha,
  lugar: group.lugar,
  cupos: group.cupos,
  published: true,
  seats: (GROUP_SEATS[group.id] || []).map((memberId, index) => {
    const person = DUMMY_FOUNDERS.find((item) => item.id === memberId) || DUMMY_FOUNDERS[0]
    return {
      id: `${group.id}-seat-${index}`,
      coffee_id: group.id,
      member_id: person.id,
      status: index === 0 ? 'confirmed' : 'invited',
      nombre: person.nombre,
      empresa: person.empresa,
      email: person.email,
    }
  }),
}))

export const DUMMY_ADMIN_EVENTS: CmsEvent[] = DUMMY_EVENTS.map((event) => ({
  id: event.id,
  titulo: event.titulo,
  descripcion: event.descripcion,
  fecha_inicio: `${event.fecha}T18:00:00`,
  ciudad: event.ciudad,
  lugar: event.ciudad,
  image_url: event.image,
  link: event.link,
  published: true,
  asistentes: event.asistentes,
}))

export const DUMMY_ADMIN_PAIRINGS: CmsPairing[] = [
  {
    id: 'pair-1',
    requester_id: 'dummy-camila',
    target_id: 'dummy-diego',
    status: 'confirmed',
    meet_at: DUMMY_ONE_TO_ONES[0].fecha,
    created_at: DUMMY_ONE_TO_ONES[0].fecha,
    requester_nombre: 'Camila Restrepo',
    requester_empresa: 'Nubia Pay',
    target_nombre: 'Diego Álvarez',
    target_empresa: 'Ruta Norte',
  },
  {
    id: 'pair-2',
    requester_id: 'dummy-valentina',
    target_id: 'dummy-andres',
    status: 'requested',
    meet_at: DUMMY_ONE_TO_ONES[1].fecha,
    created_at: DUMMY_ONE_TO_ONES[1].fecha,
    requester_nombre: 'Valentina Ortiz',
    requester_empresa: 'Kora Health',
    target_nombre: 'Andrés Molina',
    target_empresa: 'Stack Latam',
  },
  {
    id: 'pair-3',
    requester_id: 'dummy-laura',
    target_id: 'dummy-sofia',
    status: 'confirmed',
    meet_at: DUMMY_ONE_TO_ONES[2].fecha,
    created_at: DUMMY_ONE_TO_ONES[2].fecha,
    requester_nombre: 'Laura Peña',
    requester_empresa: 'Synergy',
    target_nombre: 'Sofía Herrera',
    target_empresa: 'Synergy',
  },
]

export const DUMMY_ADMIN_PAIRING_CARDS = DUMMY_ADMIN_MEMBERS.map((member) => {
  const monthLimit = member.plan === 'pro' ? 30 : 4
  const monthUsed = DUMMY_MONTH_USED[member.id] ?? 0
  const mine = DUMMY_ADMIN_PAIRINGS.filter(
    (item) => item.requester_id === member.id || item.target_id === member.id
  )
  return {
    member,
    requested: mine.filter((item) => item.status === 'requested').length,
    confirmed: mine.filter((item) => item.status === 'confirmed').length,
    declined: 0,
    monthUsed,
    monthLimit,
  }
})
