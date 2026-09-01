export const REGISTRO_STEPS = [
  'Información básica',
  'Métricas de la empresa',
  'Objetivos y networking',
] as const

export const COMPANY_CATEGORIES = [
  { id: 'tech', label: 'Tecnología / SaaS' },
  { id: 'fintech', label: 'Fintech' },
  { id: 'health', label: 'Healthtech' },
  { id: 'retail', label: 'Retail / E-commerce' },
  { id: 'other', label: 'Otra' },
] as const

export const EMPLOYEE_RANGES = ['1-5', '6-20', '21-50', '50+'] as const

export const REVENUE_RANGES = [
  { id: 'under_100k', label: '< $100k' },
  { id: '100k_1m', label: '$100k - $1M' },
  { id: 'over_1m', label: '> $1M' },
] as const

export const CONNECTION_INTERESTS = [
  { id: 'mentorship', label: 'Mentoría' },
  { id: 'investors', label: 'Inversores' },
  { id: 'partners', label: 'Partners comerciales' },
  { id: 'talent', label: 'Talento C-Level' },
] as const

export const CHANNELS = [
  { id: 'email', label: 'Correo electrónico' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'slack', label: 'Slack / Discord' },
  { id: 'phone', label: 'Llamada telefónica' },
] as const

export const REGISTRO_HERO_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'
