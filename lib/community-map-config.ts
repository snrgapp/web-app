export type CommunityCity = {
  name: string
  x: number
  y: number
  info: string
}

export type CommunityRoute = {
  from: number
  to: number
  color: string
}

/** Ciudades caribe / nodos de la comunidad Synergy (posiciones en % del contenedor). */
export const COMMUNITY_CITIES: CommunityCity[] = [
  { name: 'Barranquilla', x: 44.5, y: 38.5, info: '15 founders activos' },
  { name: 'Cartagena', x: 34.5, y: 48.5, info: '12 founders activos' },
  { name: 'Santa Marta', x: 51.5, y: 35.5, info: '8 founders activos' },
  { name: 'Riohacha', x: 74.5, y: 28.5, info: '5 founders activos' },
  { name: 'Montería', x: 25.5, y: 72.5, info: '7 founders activos' },
  { name: 'Valledupar', x: 63.5, y: 46.5, info: '6 founders activos' },
  { name: 'Sincelejo', x: 34.5, y: 61.5, info: '4 founders activos' },
]

/** Conexiones visuales entre nodos (índices en COMMUNITY_CITIES). */
export const COMMUNITY_ROUTES: CommunityRoute[] = [
  { from: 0, to: 1, color: '#E5B318' },
  { from: 0, to: 2, color: '#E5B318' },
  { from: 1, to: 2, color: '#c9a016' },
  { from: 0, to: 3, color: '#f0d875' },
  { from: 0, to: 4, color: '#d4af37' },
  { from: 1, to: 5, color: '#e8cc6a' },
  { from: 1, to: 6, color: '#f5e6a8' },
]
