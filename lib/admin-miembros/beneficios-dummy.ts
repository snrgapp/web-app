import { BENEFITS } from '@/lib/miembros/benefits'
import type { CmsBenefit } from '@/lib/cms/types'

export type AdminBenefitStatus = 'active' | 'paused'

export type AdminBenefit = CmsBenefit & {
  claims: number
}

export type AdminBenefitClaim = {
  id: string
  status: 'requested' | 'sent' | 'failed'
  created_at: string
  benefit: string
  brand: string
  nombre: string
  email: string
  phone: string
  empresa: string
}

const COVERS: Record<string, string> = {
  aws: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  notion: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
  stripe: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
  slack: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80',
  hubspot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
}

const CLAIM_COUNTS: Record<string, number> = {
  aws: 142,
  notion: 89,
  stripe: 34,
  slack: 56,
  hubspot: 21,
}

const BRANDS: Record<string, string> = {
  aws: 'Amazon',
  notion: 'Notion',
  stripe: 'Stripe',
  slack: 'Slack',
  hubspot: 'HubSpot',
}

const PAUSED = new Set(['stripe'])

export function toAdminBenefit(benefit: CmsBenefit, claims = 0): AdminBenefit {
  return {
    ...benefit,
    claims,
    status: benefit.status || (benefit.published ? 'active' : 'paused'),
    cover_url: benefit.cover_url || COVERS[benefit.id] || '',
    brand: benefit.brand || BRANDS[benefit.id] || benefit.name,
  }
}

export const DUMMY_ADMIN_BENEFITS: AdminBenefit[] = BENEFITS.map((benefit) => {
  const paused = PAUSED.has(benefit.id)
  return {
    id: benefit.id,
    slug: benefit.id,
    name: benefit.name,
    description: benefit.description,
    offer: benefit.offer,
    category: benefit.category,
    featured: Boolean(benefit.featured),
    logo_label: benefit.logo.label,
    logo_bg: benefit.logo.bg,
    logo_color: benefit.logo.color,
    brand_email: `${benefit.id}@partners.test`,
    redeem_instructions: `Al reclamar, ${benefit.name} envía las instrucciones al correo del founder.`,
    published: !paused,
    claims: CLAIM_COUNTS[benefit.id] || 0,
    status: paused ? 'paused' : 'active',
    cover_url: COVERS[benefit.id] || '',
    brand: BRANDS[benefit.id] || benefit.name,
  }
})

export const DUMMY_ADMIN_CLAIMS: AdminBenefitClaim[] = [
  {
    id: 'claim-camila-aws',
    status: 'sent',
    created_at: new Date().toISOString(),
    benefit: 'Amazon Web Services',
    brand: 'Amazon',
    nombre: 'Camila Restrepo',
    email: 'camila@nubia.test',
    phone: '',
    empresa: 'Nubia Pay',
  },
  {
    id: 'claim-diego-slack',
    status: 'requested',
    created_at: new Date().toISOString(),
    benefit: 'Slack Pro',
    brand: 'Slack',
    nombre: 'Diego Álvarez',
    email: 'diego@ruta.test',
    phone: '',
    empresa: 'Ruta Norte',
  },
  {
    id: 'claim-vale-notion',
    status: 'sent',
    created_at: new Date().toISOString(),
    benefit: 'Notion for Startups',
    brand: 'Notion',
    nombre: 'Valentina Ortiz',
    email: 'vale@kora.test',
    phone: '',
    empresa: 'Kora Health',
  },
  {
    id: 'claim-andres-hubspot',
    status: 'failed',
    created_at: new Date().toISOString(),
    benefit: 'HubSpot for Startups',
    brand: 'HubSpot',
    nombre: 'Andrés Molina',
    email: 'andres@stack.test',
    phone: '',
    empresa: 'Stack Latam',
  },
]

export const emptyBenefit: Partial<CmsBenefit> = {
  name: '',
  description: '',
  offer: '',
  category: 'Productividad',
  featured: false,
  logo_label: '',
  logo_bg: '#232F3E',
  logo_color: '#FFFFFF',
  brand_email: '',
  redeem_instructions: '',
  published: true,
  brand: '',
  cover_url: '',
  status: 'active',
}

export function isDummyBenefitId(id: string) {
  return BENEFITS.some((benefit) => benefit.id === id) || id.startsWith('benefit-local-')
}
