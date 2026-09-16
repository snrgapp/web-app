export const LAUNCH_CITIES = [
  'Barranquilla',
  'Cartagena',
  'Santa Marta',
  'Valledupar',
  'Montería',
] as const

export const COMPANY_TYPES = [
  { value: 'Servicios', title: 'Servicios', hint: 'Consultoría, agencias, salud' },
  { value: 'Producto / Retail', title: 'Producto / Retail', hint: 'Bienes físicos, tiendas' },
  { value: 'Tecnología o software', title: 'Tecnología / SaaS', hint: 'Apps, plataformas digitales' },
  { value: 'Manufactura', title: 'Manufactura', hint: 'Producción a escala' },
  { value: 'Agroindustria', title: 'Agroindustria', hint: 'Agro, alimentos, campo' },
  { value: 'Otro', title: 'Otro sector', hint: 'Especificar campo' },
] as const

export const SEEKING_OPTIONS = [
  { value: 'Clientes', label: 'Clientes' },
  { value: 'Socios estratégicos', label: 'Socios estratégicos' },
  { value: 'Inversión', label: 'Inversión' },
  { value: 'Mentoría', label: 'Mentoría' },
  { value: 'Proveedores', label: 'Proveedores' },
  { value: 'Talento', label: 'Talento' },
  { value: 'Aprendizaje y comunidad', label: 'Aprendizaje y comunidad', wide: true },
] as const

export const SALES_CHANNELS = [
  { value: 'Redes sociales', title: 'Redes sociales', hint: 'Instagram, TikTok, ads' },
  { value: 'Referidos / voz a voz', title: 'Voz a voz', hint: 'Recomendaciones' },
  { value: 'Ventas directas', title: 'Venta directa', hint: 'Outbound, llamadas' },
  { value: 'Marketplace o e-commerce', title: 'E-commerce', hint: 'Tienda online / Web' },
  { value: 'Alianzas B2B', title: 'Alianzas B2B', hint: 'Acuerdos comerciales' },
  { value: 'Pauta digital', title: 'Pauta digital', hint: 'Google / Meta Ads' },
  { value: 'Otro', title: 'Otro canal no listado', hint: 'Ferias, licitaciones o puntos físicos', wide: true },
] as const

export const CAMARA_OPTIONS = [
  {
    value: 'Sí',
    title: 'Sí, legalmente constituida',
    hint: 'Tengo NIT y matrícula mercantil activa',
  },
  {
    value: 'No',
    title: 'Aún no',
    hint: 'Operamos como personas naturales / validando idea',
  },
  {
    value: 'Estoy en proceso',
    title: 'Estoy en proceso',
    hint: 'Estructurando formalización y trámites',
  },
] as const

export const EMPLOYEE_OPTIONS = [
  { value: 'Solo yo', title: 'Solo yo (solo founder)', hint: 'Emprendiendo de manera independiente' },
  { value: '2 a 5', title: '2 a 5 personas', hint: 'Equipo base inicial' },
  { value: '6 a 15', title: '6 a 15 personas', hint: 'Etapa de tracción y expansión' },
  { value: '16 a 50', title: '16 a 50 personas', hint: 'Empresa consolidada en crecimiento' },
  { value: 'Más de 50', title: 'Más de 50 personas', hint: 'Gran escala empresarial' },
] as const

export type ArchetypeName = 'El Visionario' | 'El Ejecutor' | 'El Conector' | 'El Estratega'

export const ARCHETYPES: Record<
  ArchetypeName,
  { tag: string; blurb: string; desc: string; benefit: string }
> = {
  'El Visionario': {
    tag: 'Futuro',
    blurb: 'Siempre estoy pensando en el siguiente gran paso.',
    desc: 'Siempre estás pensando en el siguiente gran paso, anticipando tendencias y visualizando soluciones que transforman industrias.',
    benefit:
      'Te conectaremos con mentores de escalabilidad, fondos y co-founders ejecutores que materialicen tu visión.',
  },
  'El Ejecutor': {
    tag: 'Velocidad',
    blurb: 'Prefiero avanzar rápido y ajustar en el camino.',
    desc: 'Tu superpoder es la velocidad de iteración; aprendes construyendo en el terreno.',
    benefit:
      'Te agruparemos con estrategas y founders que compartan proveedores y metodologías ágiles.',
  },
  'El Conector': {
    tag: 'Sinergia',
    blurb: 'Disfruto presentar personas y crear alianzas.',
    desc: 'Tu fortaleza es tender puentes y ver oportunidades donde otros ven contactos sueltos.',
    benefit:
      'Te ubicaremos en mesas con founders que necesitan alianzas — tu red crece desde el día uno.',
  },
  'El Estratega': {
    tag: 'Datos',
    blurb: 'Analizo antes de moverme, decido con datos.',
    desc: 'Tomas decisiones calculadas; tu rigor operativo te permite construir empresas sostenibles.',
    benefit:
      'Te conectaremos con fundadores en expansión y perfiles financieros para estructurar crecimiento sólido.',
  },
}

export const WAITLIST_REVIEWS = [
  {
    initials: 'LF',
    name: 'Lucía Fernández',
    role: 'Co-fundadora · E-commerce',
    quote:
      'Salí del evento con tres reuniones agendadas con gente que buscaba exactamente lo que ofrecemos.',
  },
  {
    initials: 'MO',
    name: 'Martín Ortega',
    role: 'Fundador · SaaS B2B',
    quote:
      'Había probado otros formatos y terminaba coleccionando tarjetas. Aquí la conversación empieza con contexto.',
  },
  {
    initials: 'VR',
    name: 'Valentina Ríos',
    role: 'CEO · Healthtech',
    quote:
      'El ambiente es cercano y el pitch me abrió puertas con mentores que no habría conocido de otra forma.',
  },
] as const
