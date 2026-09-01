import { DUMMY_ANALYTICS_ROWS } from '@/lib/admin-miembros/analitica-dummy'
import { DUMMY_ADMIN_CLAIMS, type AdminBenefitClaim } from '@/lib/admin-miembros/beneficios-dummy'
import {
  DUMMY_ADMIN_COFFEES,
  DUMMY_ADMIN_PAIRING_CARDS,
  DUMMY_ADMIN_PAIRINGS,
} from '@/lib/admin-miembros/coffee-dummy'
import { formatMeetDate, formatMeetTime } from '@/lib/miembros/coffee-meets'
import type { CmsDirectoryMember, CmsPairing } from '@/lib/cms/types'

export type ActivityTone = 'recent' | 'days'

export type DirectoryMember = {
  member: CmsDirectoryMember
  events: number
  connections: number
  lastActive: ActivityTone
  lastActiveLabel: string
  industry: string
}

const INDUSTRY: Record<string, string> = {
  'Nubia Pay': 'Fintech',
  'Ruta Norte': 'Logística',
  'Kora Health': 'Salud',
  'Stack Latam': 'Tech',
  Synergy: 'Comunidad',
}

const ACTIVITY: Record<string, { tone: ActivityTone; label: string }> = {
  'dummy-camila': { tone: 'recent', label: 'En línea hace poco' },
  'dummy-diego': { tone: 'days', label: 'Última vez hace 3 d' },
  'dummy-valentina': { tone: 'recent', label: 'En línea hace poco' },
  'dummy-andres': { tone: 'days', label: 'Última vez hace 1 d' },
  'dummy-laura': { tone: 'recent', label: 'En línea hace poco' },
  'dummy-mateo': { tone: 'days', label: 'Última vez hace 5 d' },
  'dummy-sofia': { tone: 'recent', label: 'En línea hace poco' },
}

export const DUMMY_DIRECTORY: DirectoryMember[] = DUMMY_ANALYTICS_ROWS.map((row) => {
  const card = DUMMY_ADMIN_PAIRING_CARDS.find((item) => item.member.id === row.member.id)
  const activity = ACTIVITY[row.member.id] || { tone: 'days' as const, label: 'Última vez hace 7 d' }
  return {
    member: row.member,
    events: row.events + row.coffees,
    connections: card?.confirmed || row.pairings,
    lastActive: activity.tone,
    lastActiveLabel: activity.label,
    industry: INDUSTRY[row.member.empresa] || 'Otros',
  }
})

export const DIRECTORY_INDUSTRIES = [...new Set(DUMMY_DIRECTORY.map((item) => item.industry))]

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function activityFromLastActive(iso?: string | null): { tone: ActivityTone; label: string } {
  if (!iso) return { tone: 'days', label: 'Sin actividad reciente' }
  const elapsed = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(elapsed) || elapsed < 0) return { tone: 'days', label: 'Sin actividad reciente' }
  if (elapsed < 24 * 60 * 60 * 1000) return { tone: 'recent', label: 'En línea hace poco' }
  const days = Math.max(1, Math.round(elapsed / (24 * 60 * 60 * 1000)))
  return { tone: 'days', label: `Última vez hace ${days} d` }
}

export function toDirectoryMember(member: CmsDirectoryMember, extras?: Partial<DirectoryMember>): DirectoryMember {
  const activity = extras?.lastActive
    ? { tone: extras.lastActive, label: extras.lastActiveLabel || 'Sin actividad reciente' }
    : activityFromLastActive(member.last_active_at)
  return {
    member,
    events: extras?.events ?? 0,
    connections: extras?.connections ?? 0,
    lastActive: extras?.lastActive ?? activity.tone,
    lastActiveLabel: extras?.lastActiveLabel ?? activity.label,
    industry: extras?.industry || member.industry || INDUSTRY[member.empresa] || 'Otros',
  }
}

export type CompanyInfo = {
  role: string
  tags: string[]
  industry: string
  stage: string
  team: string
  founded: string
  revenue: string
}

export type ProfileConnection = {
  id: string
  name: string
  empresa: string
  when: string
  status: CmsPairing['status']
}

export type CoffeeActivity = {
  id: string
  title: string
  when: string
  kind: 'group' | 'one'
  status: string
}

const COMPANY: Record<string, CompanyInfo> = {
  'dummy-camila': {
    role: 'Founder & CEO',
    tags: ['Fintech', 'Pagos', 'Latam'],
    industry: 'Fintech / pagos',
    stage: 'Seed',
    team: '8 personas',
    founded: '2023',
    revenue: '< $1M',
  },
  'dummy-diego': {
    role: 'Founder & CEO',
    tags: ['Logística', 'B2B', 'Operaciones'],
    industry: 'Logística',
    stage: 'Seed',
    team: '12 personas',
    founded: '2022',
    revenue: '$1.2M – $5M',
  },
  'dummy-valentina': {
    role: 'Founder & CPO',
    tags: ['Salud', 'Producto', 'B2B'],
    industry: 'Healthtech',
    stage: 'Pre-seed',
    team: '6 personas',
    founded: '2024',
    revenue: '< $1M',
  },
  'dummy-andres': {
    role: 'Co-founder & CTO',
    tags: ['Tech', 'SaaS', 'IA'],
    industry: 'B2B SaaS / IA',
    stage: 'Seed',
    team: '15 personas',
    founded: '2021',
    revenue: '$1.2M – $5M',
  },
  'dummy-laura': {
    role: 'Community Lead',
    tags: ['Comunidad', 'Synergy'],
    industry: 'Comunidad',
    stage: 'Operando',
    team: 'Synergy',
    founded: '2024',
    revenue: '—',
  },
  'dummy-mateo': {
    role: 'Founder',
    tags: ['Comunidad', 'Producto'],
    industry: 'Comunidad',
    stage: 'Pre-seed',
    team: '3 personas',
    founded: '2025',
    revenue: '< $1M',
  },
  'dummy-sofia': {
    role: 'Founder & CEO',
    tags: ['Comunidad', 'GTM'],
    industry: 'Comunidad',
    stage: 'Seed',
    team: '5 personas',
    founded: '2024',
    revenue: '< $1M',
  },
}

const FALLBACK_COMPANY: CompanyInfo = {
  role: 'Founder',
  tags: ['Startup'],
  industry: 'Otros',
  stage: '—',
  team: '—',
  founded: '—',
  revenue: '—',
}

export type MemberProfile = DirectoryMember & {
  company: CompanyInfo
  coffees: number
  benefitsRedeemed: number
  attendance: number
  connectionsList: ProfileConnection[]
  claims: AdminBenefitClaim[]
  coffeeActivity: CoffeeActivity[]
}

export function getMemberProfile(item: DirectoryMember): MemberProfile {
  const fromMember: CompanyInfo = {
    role: item.member.role || FALLBACK_COMPANY.role,
    tags: item.member.tags?.length ? item.member.tags : [item.industry],
    industry: item.member.industry || item.industry,
    stage: item.member.stage || FALLBACK_COMPANY.stage,
    team: item.member.team || FALLBACK_COMPANY.team,
    founded: item.member.founded || FALLBACK_COMPANY.founded,
    revenue: item.member.revenue || FALLBACK_COMPANY.revenue,
  }
  const company = COMPANY[item.member.id] || fromMember
  const pairings = DUMMY_ADMIN_PAIRINGS.filter(
    (pairing) => pairing.requester_id === item.member.id || pairing.target_id === item.member.id
  )
  const connectionsList: ProfileConnection[] = pairings.map((pairing) => {
    const isRequester = pairing.requester_id === item.member.id
    return {
      id: pairing.id,
      name: isRequester ? pairing.target_nombre : pairing.requester_nombre,
      empresa: isRequester ? pairing.target_empresa : pairing.requester_empresa,
      when: pairing.created_at ? formatMeetDate(pairing.created_at) : '—',
      status: pairing.status,
    }
  })
  const claims = DUMMY_ADMIN_CLAIMS.filter((claim) => claim.nombre === item.member.nombre)
  const coffees = DUMMY_ADMIN_COFFEES.filter((coffee) =>
    coffee.seats.some((seat) => seat.member_id === item.member.id)
  )
  const coffeeActivity: CoffeeActivity[] = [
    ...coffees.map((coffee) => ({
      id: coffee.id,
      title: coffee.titulo,
      when: `${formatMeetDate(coffee.fecha)} · ${formatMeetTime(coffee.fecha)}`,
      kind: 'group' as const,
      status: 'Programado',
    })),
    ...pairings.map((pairing) => ({
      id: `one-${pairing.id}`,
      title: `1:1 con ${pairing.requester_id === item.member.id ? pairing.target_nombre : pairing.requester_nombre}`,
      when: pairing.meet_at ? formatMeetDate(pairing.meet_at) : 'Por confirmar',
      kind: 'one' as const,
      status: pairing.status === 'confirmed' ? 'Asistió' : 'Pendiente',
    })),
  ]
  const maxEvents = Math.max(item.events + 1, 4)
  return {
    ...item,
    company,
    coffees: coffees.length,
    benefitsRedeemed: claims.filter((claim) => claim.status === 'sent').length,
    attendance: Math.min(96, Math.round((item.events / maxEvents) * 100) + 40),
    connectionsList,
    claims,
    coffeeActivity,
  }
}
