export type ExperiencePortfolioItem = {
  logo: string
  name: string
  url: string
  description: string
  status: 'ACTIVO' | 'PRÓXIMO' | 'COMPLETADO'
  frequency: string
  attendees: string
}

export const experiencesPortfolio: ExperiencePortfolioItem[] = [
  {
    logo: '/images/experiencias/logo-synergy.png',
    name: 'Networking Meetings',
    url: 'https://snrg.lat/eventos',
    description:
      'Encuentros íntimos entre founders del Caribe para conectar, colaborar y construir alianzas reales.',
    status: 'PRÓXIMO',
    frequency: 'Trimestral',
    attendees: '40+',
  },
  {
    logo: '/images/experiencias/logo-spotlight.png',
    name: 'Spotlight',
    url: 'https://snrg.lat/spotlight',
    description:
      'Evento en cine con panel de expertos y pitch de 5 startups ante inversores y founders del ecosistema.',
    status: 'ACTIVO',
    frequency: 'Cuatrimestre',
    attendees: '80+',
  },
  {
    logo: '/images/experiencias/logo-fh.png',
    name: 'Founder House BAQ',
    url: 'https://snrg.lat/founder-house',
    description:
      'Experiencia inmersiva de varios días donde startup founders conviven, construyen y reciben mentoría entre sí.',
    status: 'PRÓXIMO',
    frequency: 'Semestral',
    attendees: '12',
  },
]
