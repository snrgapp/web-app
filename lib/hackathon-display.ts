import type { HackatonSubmission } from '@/types/database.types'

export type HackathonRoleClass = 'role-purple' | 'role-green' | 'role-yellow' | 'role-blue'

export const PERFIL_LABEL: Record<HackatonSubmission['perfil'], string> = {
  frontend: 'FRONT-END DEV',
  backend: 'BACK-END DEV',
  full_stack: 'FULL STACK DEV',
  data_analyst: 'DATA ANALYST',
}

export function perfilToRoleClass(perfil: HackatonSubmission['perfil']): HackathonRoleClass {
  switch (perfil) {
    case 'frontend':
      return 'role-blue'
    case 'backend':
      return 'role-green'
    case 'full_stack':
      return 'role-purple'
    case 'data_analyst':
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
