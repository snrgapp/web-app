const LEGACY_PERFIL_UPPER: Record<string, string> = {
  frontend: 'FRONT-END DEV',
  backend: 'BACK-END DEV',
  full_stack: 'FULL STACK DEV',
  data_analyst: 'DATA ANALYST',
}

export type HackathonRoleClass = 'role-purple' | 'role-green' | 'role-yellow' | 'role-blue'

/** Etiqueta en badge / cards: valores históricos mapeados; el resto se muestra en mayúsculas. */
export function perfilHackathonLabel(perfil: string): string {
  const trimmed = perfil.trim()
  if (!trimmed) return '—'
  const key = trimmed.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
  const legacy = LEGACY_PERFIL_UPPER[key]
  return legacy ?? trimmed.toUpperCase()
}

export function perfilToRoleClass(perfil: string): HackathonRoleClass {
  const key = perfil.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
  switch (key) {
    case 'frontend':
      return 'role-blue'
    case 'backend':
      return 'role-green'
    case 'full_stack':
    case 'fullstack':
      return 'role-purple'
    case 'data_analyst':
    case 'dataanalyst':
      return 'role-yellow'
    default:
      return 'role-purple'
  }
}

export function inicialesDesdeNombre(nombreCompleto: string): string {
  const parts = nombreCompleto
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
