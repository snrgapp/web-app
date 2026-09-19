export type FundingType = 'capital' | 'semilla' | 'aceleradora' | 'cofinanciacion'
export type Stage = 'temprana' | 'mediana' | 'ambas'
export type Sector = 'multi' | 'tech' | 'agro' | 'comercio' | 'sostenibilidad' | 'salud'
export type Region =
  | 'nacional'
  | 'bogota'
  | 'antioquia'
  | 'valle'
  | 'caribe'
  | 'santanderes'
  | 'eje'
  | 'orinoquia'
export type Urgency = 'urgent' | 'soon' | 'open' | 'upcoming' | 'continuous'

export type Convocatoria = {
  id: string
  initials: string
  entity: string
  entitySub: string
  title: string
  summary: string
  requirement: string
  amountLabel: string
  amountValue: string
  amountHint?: string
  funding: FundingType
  stage: Stage
  sector: Sector
  region: Region
  tags: string[]
  urgency: Urgency
  urgencyLabel: string
  keywords: string
  accent: 'black' | 'yellow' | 'slate'
}

export const REGIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Toda Colombia' },
  { value: 'bogota', label: 'Bogotá D.C. / Cundinamarca' },
  { value: 'antioquia', label: 'Antioquia (Medellín y región)' },
  { value: 'valle', label: 'Valle del Cauca (Cali y región)' },
  { value: 'caribe', label: 'Región Caribe (Barranquilla, Cartagena)' },
  { value: 'santanderes', label: 'Santanderes (Bucaramanga, Cúcuta)' },
  { value: 'eje', label: 'Eje Cafetero' },
  { value: 'orinoquia', label: 'Llanos y Amazonía' },
]

export const FUNDING_FILTERS: { value: 'all' | FundingType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'capital', label: 'Capital no reembolsable / Subsidios' },
  { value: 'semilla', label: 'Fondos semilla' },
  { value: 'aceleradora', label: 'Aceleradoras e incubación' },
  { value: 'cofinanciacion', label: 'Cofinanciación y crédito blando' },
]

export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'sena-fondo-emprender',
    initials: 'S',
    entity: 'SENA — Fondo Emprender',
    entitySub: 'Gobierno de Colombia',
    title: 'Convocatoria Nacional Multisectorial 2025',
    summary:
      'Financiación 100% no reembolsable para la creación y puesta en marcha de nuevas empresas en Colombia. Incluye asistencia técnica y mentoría de formulación.',
    requirement: 'Plan de negocio validado en centros SENA.',
    amountLabel: 'Monto financiable',
    amountValue: 'Hasta $105.000.000 COP',
    funding: 'capital',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital no reembolsable', 'Etapa temprana', 'Multisectorial', 'Nacional'],
    urgency: 'soon',
    urgencyLabel: 'Cierra en 21 días',
    keywords: 'sena fondo emprender semilla gobierno',
    accent: 'black',
  },
  {
    id: 'innpulsa-acelera',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Min. Comercio',
    title: 'Programa Acelera Colombia — Cohorte Expansión',
    summary:
      'Programa intensivo de 16 semanas para empresas con ventas demostradas que buscan escalar a nivel nacional e internacional con optimización de modelo operativo.',
    requirement: 'Mínimo 1 año de operación y ventas > $80M COP anuales.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Acompañamiento 1:1 + red 45+ VCs',
    funding: 'aceleradora',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Aceleradora', 'Etapa mediana', 'Innovación', 'Mentoría y fondos'],
    urgency: 'urgent',
    urgencyLabel: 'Quedan 4 días',
    keywords: 'innpulsa mincit acelera expansion vc',
    accent: 'yellow',
  },
  {
    id: 'ruta-n-angeles',
    initials: 'RN',
    entity: 'Ruta N & Red Ángeles',
    entitySub: 'Medellín y nacional',
    title: 'Fondo Semilla Inversión Ángel 2025',
    summary:
      'Inyección de capital para startups y empresas de servicios de alto valor agregado con producto mínimo viable lanzado y clientes activos en Colombia.',
    requirement: 'PMV en operación y tracción mensual comprobable.',
    amountLabel: 'Rango de inversión',
    amountValue: '$50.000 – $100.000 USD',
    amountHint: 'Aprox. $200M – $400M COP',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'tech',
    region: 'antioquia',
    tags: ['Fondo semilla', 'Etapa temprana', 'Servicios y tech', 'Equity / SAFE'],
    urgency: 'open',
    urgencyLabel: 'Cierre: 30 de mayo',
    keywords: 'ruta n angeles medellin semilla equity',
    accent: 'slate',
  },
  {
    id: 'minciencias-cofinancia',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Min. de Ciencia y Tecnología',
    title: 'Cofinanciación para la Innovación y Productividad Empresarial',
    summary:
      'Recursos no reembolsables para empresas legalmente constituidas: nuevos productos, absorción tecnológica y sofisticación productiva.',
    requirement: 'Mínimo 2 años de registro en Cámara de Comercio con RUT activo.',
    amountLabel: 'Monto no reembolsable',
    amountValue: 'Hasta $300.000.000 COP',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital no reembolsable', 'Etapa mediana', 'Multisectorial', 'Cofinanciación 70%'],
    urgency: 'open',
    urgencyLabel: 'Cierre: 15 de junio',
    keywords: 'minciencias innovacion productividad cofinanciacion',
    accent: 'black',
  },
  {
    id: 'appsco-mintic',
    initials: 'AP',
    entity: 'Apps.co & MinTIC',
    entitySub: 'Min. Tecnologías',
    title: 'Fase de Validación y Crecimiento de Negocios Digitales',
    summary:
      'Asesoría especializada, kits de herramientas en la nube y preparación para rondas de capital para equipos con software o plataformas digitales.',
    requirement: 'Equipo de mínimo 2 personas con producto digital funcional.',
    amountLabel: 'Paquete de beneficios',
    amountValue: 'Asesoría + $10.000 USD en cloud',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'tech',
    region: 'nacional',
    tags: ['Aceleradora / incubación', 'Etapa temprana', 'Digital', '100% gratuito'],
    urgency: 'continuous',
    urgencyLabel: 'Convocatoria continua',
    keywords: 'apps.co mintic digital cloud validacion',
    accent: 'yellow',
  },
  {
    id: 'fondo-mujer',
    initials: 'FM',
    entity: 'Fondo Mujer Emprende',
    entitySub: 'Presidencia y Vicepresidencia',
    title: 'Línea Impulso Productivo Nacional para Emprendedoras',
    summary:
      'Capital semilla y fortalecimiento técnico para empresas lideradas por mujeres en comercio, agro, manufactura o servicios en cualquier departamento.',
    requirement: 'Más del 51% de participación o liderazgo femenino acreditado.',
    amountLabel: 'Subsidio asignable',
    amountValue: 'Hasta $80.000.000 COP',
    funding: 'capital',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital no reembolsable', 'Etapa temprana y mediana', 'Mujeres líderes', 'Multisectorial'],
    urgency: 'upcoming',
    urgencyLabel: 'Apertura en 8 días',
    keywords: 'mujer emprende vicepresidencia subsidio',
    accent: 'black',
  },
]

export function matchesRegion(item: Convocatoria, region: string) {
  if (region === 'all') return true
  if (item.region === 'nacional') return true
  return item.region === region
}
