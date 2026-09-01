export type CourseCategory =
  | 'Estrategia y Liderazgo'
  | 'Finanzas'
  | 'Producto y UX'
  | 'Ventas B2B'
  | 'Inteligencia Artificial'

export type CourseBadge = { label: string; tone: 'hot' | 'new' }

export type CourseInclude = {
  icon: 'video' | 'code' | 'download' | 'mobile' | 'captions' | 'certificate'
  label: string
}

export type Course = {
  id: string
  title: string
  shortTitle: string
  subtitle: string
  instructor: string
  instructors: string[]
  rating: number
  reviews: number
  students: number
  category: CourseCategory
  topics: [string, string]
  badge?: CourseBadge
  extraBadges?: string[]
  image: string
  updatedAt: string
  language: string
  captions: string
  learnings: string[]
  tags: string[]
  includes: CourseInclude[]
  firstLessonId?: string
}

export const COURSE_CATEGORIES: CourseCategory[] = [
  'Estrategia y Liderazgo',
  'Finanzas',
  'Producto y UX',
  'Ventas B2B',
  'Inteligencia Artificial',
]

export const FEATURED_COURSE_IDS = ['b2b', 'finance', 'pmf', 'ai', 'lead'] as const

export const COURSES: Course[] = [
  {
    id: 'b2b',
    title: 'Escalado B2B: De Startup a Enterprise',
    shortTitle: 'Escalado B2B',
    subtitle:
      'Cómo pasar de primeros clientes a un motor de ventas enterprise: ICP, ciclo largo, equipo y playbooks que sí se ejecutan.',
    instructor: 'Elena Rodriguez, VP of Sales',
    instructors: ['Elena Rodriguez'],
    rating: 4.9,
    reviews: 128,
    students: 1840,
    category: 'Ventas B2B',
    topics: ['Negocios', 'Ventas B2B'],
    badge: { label: 'Lo más visto', tone: 'hot' },
    extraBadges: ['Mejor valorados'],
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    updatedAt: '2/2026',
    language: 'Español',
    captions: 'Español [Automático]',
    learnings: [
      'Definirás un ICP enterprise que el equipo pueda usar en outbound',
      'Diseñarás un ciclo de venta para deals de 6 a 12 meses',
      'Armarás un playbook de discovery, demo y negociación',
      'Construirás forecast y cadencia de pipeline sin mentirte',
      'Contratarás y habilitarás los primeros AEs',
      'Pasarás de founder-led sales a un equipo que cierra sin ti',
    ],
    tags: ['Ventas B2B', 'Go-to-market', 'Negocios'],
    includes: [
      { icon: 'video', label: '6,5 horas de vídeo bajo demanda' },
      { icon: 'download', label: '14 playbooks y plantillas' },
      { icon: 'mobile', label: 'Acceso en dispositivos móviles y TV' },
      { icon: 'captions', label: 'Subtítulos' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
  },
  {
    id: 'finance',
    title: 'Modelado financiero avanzado para startups',
    shortTitle: 'Modelado financiero',
    subtitle:
      'Construye un modelo que sirva para decidir: unit economics, runway, escenarios y la historia que le cuentas a un inversionista.',
    instructor: 'David Chen',
    instructors: ['David Chen'],
    rating: 4.8,
    reviews: 85,
    students: 1320,
    category: 'Finanzas',
    topics: ['Negocios', 'Finanzas'],
    badge: { label: 'Lo más visto', tone: 'hot' },
    extraBadges: ['Mejor valorados'],
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    updatedAt: '1/2026',
    language: 'Español',
    captions: 'Español [Automático]',
    learnings: [
      'Armarás un modelo de 3 estados conectado y auditable',
      'Calcularás CAC, LTV, payback y contribución real',
      'Proyectarás runway y contrataciones sin romper caja',
      'Crearás escenarios base, upside y downside',
      'Prepararás el paquete financiero para una ronda seed o A',
      'Detectarás supuestos débiles antes de que te los señalen',
    ],
    tags: ['Finanzas', 'Startups', 'Negocios'],
    includes: [
      { icon: 'video', label: '8 horas de vídeo bajo demanda' },
      { icon: 'download', label: '9 modelos en Excel y Sheets' },
      { icon: 'code', label: '12 ejercicios guiados' },
      { icon: 'mobile', label: 'Acceso en dispositivos móviles y TV' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
  },
  {
    id: 'pmf',
    title: 'Product-Market Fit: más allá de la teoría',
    shortTitle: 'Product-Market Fit',
    subtitle:
      'Un método práctico para saber si ya tienes PMF, qué falta y cómo iterar con evidencia en lugar de opiniones.',
    instructor: 'Sarah Jenkins',
    instructors: ['Sarah Jenkins'],
    rating: 4.9,
    reviews: 210,
    students: 2560,
    category: 'Producto y UX',
    topics: ['Producto', 'Producto y UX'],
    badge: { label: 'Destacado y nuevo', tone: 'new' },
    extraBadges: ['Mejor valorados'],
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    updatedAt: '3/2026',
    language: 'Español',
    captions: 'Español [Automático]',
    learnings: [
      'Medirás PMF con señales de retención, no con encuestas sueltas',
      'Diseñarás entrevistas de discovery que no induzcan la respuesta',
      'Separarás problema real de feature request',
      'Priorizarás el siguiente experimento con un marco simple',
      'Armarás un tablero de evidencia para el equipo y el board',
      'Decidirás cuándo insistir, pivotar o pausar',
    ],
    tags: ['Producto', 'UX', 'Startups'],
    includes: [
      { icon: 'video', label: '5,5 horas de vídeo bajo demanda' },
      { icon: 'download', label: '11 plantillas de discovery' },
      { icon: 'mobile', label: 'Acceso en dispositivos móviles y TV' },
      { icon: 'captions', label: 'Subtítulos' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
  },
  {
    id: 'ai',
    title: 'Master en agentes IA: implementación práctica',
    shortTitle: 'Agentes IA',
    subtitle:
      'De un prompt suelto a un agente que trabaja en tu operación: herramientas, memoria, evaluación y despliegue sin humo.',
    instructor: 'Ing. Carlos Mendoza',
    instructors: ['Carlos Mendoza'],
    rating: 4.7,
    reviews: 45,
    students: 890,
    category: 'Inteligencia Artificial',
    topics: ['Tecnología', 'Inteligencia Artificial'],
    badge: { label: 'Nuevo', tone: 'new' },
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    updatedAt: '3/2026',
    language: 'Español',
    captions: 'Español [Automático]',
    learnings: [
      'Diseñarás un agente con objetivo, herramientas y límites claros',
      'Conectarás APIs, bases de datos y acciones reales',
      'Añadirás memoria y contexto sin inflar costos',
      'Evaluarás calidad, alucinaciones y regresiones',
      'Pondrás el agente en producción con logs y fallbacks',
      'Identificarás casos de uso que sí pagan en una startup',
    ],
    tags: ['Inteligencia Artificial', 'Agentes', 'Producto'],
    includes: [
      { icon: 'video', label: '7 horas de vídeo bajo demanda' },
      { icon: 'code', label: '18 ejercicios de implementación' },
      { icon: 'download', label: '8 repos y checklists' },
      { icon: 'mobile', label: 'Acceso en dispositivos móviles y TV' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
  },
  {
    id: 'lead',
    title: 'Liderazgo para founders en etapa seed',
    shortTitle: 'Liderazgo seed',
    subtitle:
      'Cómo dirigir cuando el equipo es chico, el tiempo no alcanza y cada decisión se siente existencial.',
    instructor: 'Mariana Ortiz',
    instructors: ['Mariana Ortiz'],
    rating: 4.6,
    reviews: 64,
    students: 1120,
    category: 'Estrategia y Liderazgo',
    topics: ['Negocios', 'Estrategia y Liderazgo'],
    badge: { label: 'Lo más visto', tone: 'hot' },
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
    updatedAt: '12/2025',
    language: 'Español',
    captions: 'Español [Automático]',
    learnings: [
      'Pasarás de hacer todo a priorizar lo que solo tú puedes hacer',
      'Darás feedback que cambia conducta, no solo clima',
      'Armarás cadencias de 1:1, all-hands y board útiles',
      'Contratarás los primeros líderes sin diluir la cultura',
      'Manejarás conflicto y bajo desempeño a tiempo',
      'Cuidarás tu energía para no quemar la compañía',
    ],
    tags: ['Liderazgo', 'Founders', 'Negocios'],
    includes: [
      { icon: 'video', label: '4,5 horas de vídeo bajo demanda' },
      { icon: 'download', label: '10 guías de 1:1 y rituales' },
      { icon: 'mobile', label: 'Acceso en dispositivos móviles y TV' },
      { icon: 'captions', label: 'Subtítulos' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
  },
  {
    id: 'ux',
    title: 'Discovery continuo para productos B2B',
    shortTitle: 'Discovery B2B',
    subtitle:
      'Un sistema semanal de discovery para que el roadmap no se llene de tickets y sí de problemas validados.',
    instructor: 'Andrés Peña',
    instructors: ['Andrés Peña'],
    rating: 4.8,
    reviews: 91,
    students: 740,
    category: 'Producto y UX',
    topics: ['Producto', 'Producto y UX'],
    image:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80',
    updatedAt: '2/2026',
    language: 'Español',
    captions: 'Español [Automático]',
    learnings: [
      'Instalarás un ritmo semanal de entrevistas y observación',
      'Mapearás jobs-to-be-done en un flujo B2B real',
      'Traducirás hallazgos a oportunidades, no a features',
      'Alinearás sales, CS y producto alrededor de la misma evidencia',
      'Evitarás el discovery teatral que no cambia el roadmap',
      'Medirás si el discovery está mejorando las decisiones',
    ],
    tags: ['UX', 'Discovery', 'Producto y UX'],
    includes: [
      { icon: 'video', label: '5 horas de vídeo bajo demanda' },
      { icon: 'download', label: '12 scripts y canvas' },
      { icon: 'mobile', label: 'Acceso en dispositivos móviles y TV' },
      { icon: 'captions', label: 'Subtítulos' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
  },
]

export function getCourseById(id: string | undefined) {
  if (!id) return undefined
  return COURSES.find((course) => course.id === id)
}

export function formatCourseCount(value: number) {
  return value.toLocaleString('es-CO')
}
