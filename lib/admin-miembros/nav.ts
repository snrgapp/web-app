import {
  BarChart3,
  BookOpen,
  Coffee,
  Gift,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'

export const adminMembersNav = [
  { href: '/admin-miembros/inicio', icon: LayoutDashboard, label: 'Inicio', exact: true },
  { href: '/admin-miembros/coffee-meets', icon: Coffee, label: 'Coffee & Meets', exact: false },
  { href: '/admin-miembros/lets-connect', icon: Sparkles, label: "Let's Connect", exact: false },
  { href: '/admin-miembros/aprendizaje', icon: BookOpen, label: 'Aprendizaje', exact: false },
  { href: '/admin-miembros/beneficios', icon: Gift, label: 'Beneficios', exact: false },
  { href: '/admin-miembros/analitica', icon: BarChart3, label: 'Analítica', exact: false },
] as const
