export type AnalyticsRange = '1S' | '1M' | '1A'

export type AnalyticsKpi = {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'flat'
  icon: 'handshake' | 'event' | 'groups'
}

export const ANALYTICS_KPIS: AnalyticsKpi[] = [
  {
    id: 'conexiones',
    label: 'Conexiones creadas (1:1)',
    value: '148',
    delta: '+12%',
    trend: 'up',
    icon: 'handshake',
  },
  {
    id: 'eventos',
    label: 'Asistencia a eventos',
    value: '24',
    delta: '+5%',
    trend: 'up',
    icon: 'event',
  },
  {
    id: 'cafes',
    label: 'Participación en cafés grupales',
    value: '12',
    delta: '--',
    trend: 'flat',
    icon: 'groups',
  },
]

export const ANALYTICS_RANGES: { id: AnalyticsRange; label: string }[] = [
  { id: '1S', label: '1S' },
  { id: '1M', label: '1M' },
  { id: '1A', label: '1A' },
]

export const GROWTH_CHART: Record<
  AnalyticsRange,
  { path: string; fill: string; labels: string[] }
> = {
  '1S': {
    path: 'M0,70 C20,68 35,52 50,48 C65,44 80,38 100,28',
    fill: 'M0,70 C20,68 35,52 50,48 C65,44 80,38 100,28 L100,100 L0,100 Z',
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
  },
  '1M': {
    path: 'M0,85 C15,82 25,65 40,55 C55,45 65,65 80,35 C90,15 100,10 100,10',
    fill: 'M0,85 C15,82 25,65 40,55 C55,45 65,65 80,35 C90,15 100,10 100,10 L100,100 L0,100 Z',
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  },
  '1A': {
    path: 'M0,78 C18,74 30,60 42,50 C58,38 70,42 82,22 C92,12 100,18 100,18',
    fill: 'M0,78 C18,74 30,60 42,50 C58,38 70,42 82,22 C92,12 100,18 100,18 L100,100 L0,100 Z',
    labels: ['Ene', 'Abr', 'Jul', 'Oct'],
  },
}

export const ENGAGEMENT_MIX = [
  { id: 'cafes', label: 'Cafés', value: 40, color: 'bg-members-surface-variant hover:bg-members-surface-bright' },
  { id: 'ones', label: '1:1s', value: 80, color: 'bg-members-primary-container hover:brightness-110' },
  { id: 'eventos', label: 'Eventos', value: 60, color: 'bg-members-secondary hover:brightness-110' },
]
