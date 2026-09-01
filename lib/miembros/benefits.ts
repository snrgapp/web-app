export type BenefitCategory =
  | 'Todos'
  | 'Cloud Hosting'
  | 'Productividad'
  | 'Marketing'
  | 'Finanzas y Legal'

export type Benefit = {
  id: string
  name: string
  description: string
  offer: string
  category: Exclude<BenefitCategory, 'Todos'>
  featured?: boolean
  logo: {
    label: string
    bg: string
    color: string
  }
}

export const BENEFIT_CATEGORIES: BenefitCategory[] = [
  'Todos',
  'Cloud Hosting',
  'Productividad',
  'Marketing',
  'Finanzas y Legal',
]

export const BENEFITS: Benefit[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    description:
      'Hasta $100,000 en créditos de AWS Activate por 1 año, más soporte técnico y entrenamiento para escalar tu infraestructura.',
    offer: '$100k en créditos',
    category: 'Cloud Hosting',
    featured: true,
    logo: { label: 'aws', bg: '#232F3E', color: '#FF9900' },
  },
  {
    id: 'notion',
    name: 'Notion for Startups',
    description:
      'Organiza toda la compañía en un solo lugar. 6 meses de Notion Plus gratis, incluyendo IA ilimitada para tu equipo.',
    offer: '6 meses gratis',
    category: 'Productividad',
    logo: { label: 'N', bg: '#FFFFFF', color: '#111111' },
  },
  {
    id: 'stripe',
    name: 'Stripe Processing',
    description:
      'Procesamiento sin comisión en tus primeros $50,000 de revenue. Acceso prioritario a Stripe Atlas para incorporar la empresa.',
    offer: 'Primeros $50k sin fee',
    category: 'Finanzas y Legal',
    logo: { label: 'S', bg: '#635BFF', color: '#FFFFFF' },
  },
  {
    id: 'slack',
    name: 'Slack Pro',
    description:
      '25% de descuento el primer año de Slack Pro o Business+ para equipos de menos de 200 personas.',
    offer: '25% off 1 año',
    category: 'Productividad',
    logo: { label: '#', bg: '#FFFFFF', color: '#4A154B' },
  },
  {
    id: 'hubspot',
    name: 'HubSpot for Startups',
    description:
      '90% off el primer año, 50% el segundo y 25% después. CRM y marketing para arrancar sin quemar caja.',
    offer: 'Hasta 90% off',
    category: 'Marketing',
    logo: { label: 'H', bg: '#FF7A59', color: '#FFFFFF' },
  },
]
