import {
  LayoutDashboard,
  Coffee,
  Brain,
  GraduationCap,
  Gift,
  ChartNoAxesCombined,
  Settings,
  HelpCircle,
} from 'lucide-react'

export const membersNavItems = [
  { href: '/', icon: LayoutDashboard, label: 'Inicio', shortLabel: 'Inicio', exact: true },
  {
    href: '/coffee-meets',
    icon: Coffee,
    label: 'Coffee & Meets',
    shortLabel: 'Coffee',
    exact: false,
  },
  {
    href: '/lets-connect',
    icon: Brain,
    label: "Let's Connect",
    shortLabel: 'Connect',
    exact: false,
  },
  {
    href: '/aprendizaje',
    icon: GraduationCap,
    label: 'Aprendizaje',
    shortLabel: 'Aprende',
    exact: false,
  },
  {
    href: '/beneficios',
    icon: Gift,
    label: 'Beneficios',
    shortLabel: 'Ofertas',
    exact: false,
  },
  {
    href: '/analitica',
    icon: ChartNoAxesCombined,
    label: 'Analítica',
    shortLabel: 'Datos',
    exact: false,
  },
] as const

export const membersFooterItems = [
  { href: '/configuracion', icon: Settings, label: 'Configuración' },
  { href: '/contacto', icon: HelpCircle, label: 'Ayuda' },
] as const

export const membersMobileTabs = membersNavItems

export function membersBasePath(pathname: string) {
  return pathname === '/miembros' || pathname.startsWith('/miembros/') ? '/miembros' : ''
}

export function membersHref(href: string, basePath: string) {
  if (href === '/') return basePath || '/'
  return `${basePath}${href}`
}

export function isMembersRouteActive(
  pathname: string,
  href: string,
  exact: boolean,
  basePath: string
) {
  const full = membersHref(href, basePath)
  if (exact) return pathname === full
  return pathname === full || pathname.startsWith(`${full}/`)
}
