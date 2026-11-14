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
export type Urgency = 'urgent' | 'soon' | 'open' | 'upcoming' | 'continuous' | 'closed'

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
  /** URL concreta de términos, ficha o PDF oficial. Nunca la home del portal. */
  basesUrl: string
  sourceUrl?: string
  closesAt?: string
  scrapedAt?: string
  isOpen?: boolean
}

export const RADAR_REVIEWED_AT = '2026-11-14'

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

/**
 * Fichas contrastadas el 2026-11-14 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta (p. ej. convocatorias.innpulsacolombia.com) o sin
 * llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial y mentorías para unidades productivas de víctimas del conflicto en municipios PDET. La ficha oficial publica cierre el 19 de noviembre de 2026, 11:59 p. m. Cupos: 600 de formación y 360 de mentoría; selección semanal.',
    requirement:
      'Unidad productiva de población víctima, domiciliada y en operación en un municipio PDET priorizado, con compromiso de asistencia presencial.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Cierre 19 nov 2026 · 11:59 p. m.',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Víctimas', 'PDET', 'Gratuito'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 19 de noviembre',
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria pdet',
    accent: 'black',
    closesAt: '2026-11-19',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/transformacion-financiera-territorios-de-paz',
  },
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Asesoría de banca de inversión para pymes: diagnóstico, estructuración financiera y acompañamiento para conseguir recursos. Bancóldex cubre el 85 % de la Etapa I. Cierre de postulaciones: hasta agotar presupuesto; la Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026.',
    requirement:
      'Persona jurídica colombiana de comercio, manufactura o servicios, con al menos 3 años de constitución, ventas 2025 entre $2.500 y $78.451 millones y estados financieros 2023-2025. No haber usado Finbi en los últimos 3 años.',
    amountLabel: 'Cofinanciación Etapa I',
    amountValue: 'Bancóldex asume el 85 %',
    amountHint: 'Hasta agotar presupuesto · Etapa I hasta 30 nov 2026',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Pymes', 'Banca de inversión', 'Hasta agotar cupo'],
    urgency: 'soon',
    urgencyLabel: 'Etapa I hasta el 30 de noviembre',
    keywords: 'bancoldex finbi 2026 banca inversion pymes',
    accent: 'black',
    closesAt: '2026-11-30',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/finbi-banca-de-inversion-para-pymes-2026',
  },
  {
    id: 'fondo-emprender-168-volver-a-crecer',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada No. 168',
    title: 'Volver a Crecer — fortalecimiento productivo',
    summary:
      'Capital semilla condonable para fortalecer negocios formalizados en Caldas, Chocó, Quindío, Risaralda, Valle del Cauca y Tolima afectados por el terremoto del 10 de agosto de 2026 o por incendios forestales. Bolsa publicada: $34.140.799.482. Cierre: 30 de diciembre de 2026, 6:00 p. m.',
    requirement:
      'Iniciativa productiva constituida hace al menos un año, con matrícula vigente, en los departamentos priorizados, que acredite la afectación y cumpla la Ruta Emprendedora y los TDR 168.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$34.140.799.482 COP',
    amountHint: 'Hasta 42 SMMLV en modalidad individual · cierra 30 dic 2026',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'SENA', 'Eje, Valle, Tolima y Chocó', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'fondo emprender sena 168 volver a crecer terremoto incendios caldas chocó quindio risaralda valle tolima',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1682026.aspx',
  },
  {
    id: 'finagro-lec-2026',
    initials: 'FG',
    entity: 'Finagro',
    entitySub: 'Líneas Especiales de Crédito',
    title: 'LEC Finagro 2026',
    summary:
      'Líneas Especiales de Crédito 2026 (Desarrollo Productivo y Reforma Agraria) con subsidio a la tasa para productores y empresas del sector agropecuario, acuícola y rural. La Circular Externa 25 de 2026 fija vigencia hasta el 31 de diciembre de 2026 o hasta agotar recursos. Tope de subsidio: 5.000 UVB ($60.550.000).',
    requirement: 'Actividad agropecuaria, acuícola o rural elegible ante Finagro, vía intermediario financiero.',
    amountLabel: 'Tope de subsidio por beneficiario',
    amountValue: 'Hasta $60.550.000 COP',
    amountHint: 'Circular Externa 25 de 2026 · hasta 31 dic 2026',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'agro',
    region: 'nacional',
    tags: ['Agroindustria', 'LEC', 'Crédito de fomento', '2026'],
    urgency: 'open',
    urgencyLabel: 'Hasta el 31 de diciembre o agotar cupo',
    keywords: 'finagro lec 2026 credito agro rural circular 25 reforma agraria',
    accent: 'yellow',
    closesAt: '2026-12-31',
    basesUrl: 'https://www.finagro.com.co/lineas-especiales-de-credito-lec-finagro-2026',
  },
  {
    id: 'fiveonelabs-fem-2026',
    initials: '51',
    entity: 'Five One Labs',
    entitySub: 'Fundadoras Exponenciales Mastermind',
    title: 'FEM 2026 — Barranquilla',
    summary:
      'Programa presencial de tres meses en Barranquilla para fundadoras: entrenamiento práctico, mentoría y capital no reembolsable de desarrollo de negocio. La ficha oficial la marca como convocatoria abierta 2026, sin fecha de cierre publicada.',
    requirement:
      'Emprendedora en Barranquilla o su área metropolitana, con idea de crecimiento, abierta a asesoría. No exige matrícula mercantil; sí un mínimo de ventas y tiempo de operación según la ficha.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Capital de desarrollo + mentoría',
    amountHint: 'Gratuito · 3 meses · Barranquilla',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'multi',
    region: 'caribe',
    tags: ['Mujeres', 'Aceleración', 'Barranquilla', 'Capital no reembolsable'],
    urgency: 'continuous',
    urgencyLabel: 'Convocatoria abierta 2026',
    keywords: 'five one labs fem fundadoras exponenciales barranquilla 2026',
    accent: 'slate',
    basesUrl: 'https://fiveonelabs.org/fem-convocatoria2026',
  },
  {
    id: 'fiveonelabs-ignite-2026',
    initials: '51',
    entity: 'Five One Labs',
    entitySub: 'Preincubación Ignite',
    title: 'Ignite 2026 — preincubación en Barranquilla',
    summary:
      'Preincubación presencial y gratuita para emprendedores con una idea de nuevo producto o de expansión de mercado. Tres cohortes en 2026; la ficha indica que el proceso de selección se mantiene activo de forma continua.',
    requirement:
      'Un emprendedor o emprendedora por negocio. Quienes participaron en Ignite, Incubación o FEM entre 2023 y 2025 no pueden postularse.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Preincubación presencial',
    amountHint: 'Gratuito · 3 cohortes 2026 · continuo',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'tech',
    region: 'caribe',
    tags: ['Preincubación', 'Barranquilla', 'Gratuito', 'Hasta agotar cohortes'],
    urgency: 'continuous',
    urgencyLabel: 'Selección continua 2026',
    keywords: 'five one labs ignite barranquilla preincubacion 2026',
    accent: 'slate',
    basesUrl: 'https://fiveonelabs.org/ignite-2026',
  },
  {
    id: 'ruta-emprendimiento-medellin-2026',
    initials: 'RN',
    entity: 'Ruta del Emprendimiento / Alcaldía de Medellín',
    entitySub: 'Distrito de CTeI de Medellín',
    title: 'Ruta del Emprendimiento 2026',
    summary:
      'Acompañamiento en ideación, preincubación, incubación, aceleración y consolidación para iniciativas de base tecnológica en Medellín, hasta agotar 700 cupos. Los TDR 2026 publican 60 incentivos de capital semilla en especie (hasta $15 millones) para preincubación e incubación.',
    requirement:
      'Mayor de edad, residente en Medellín, con idea, emprendimiento o empresa de base tecnológica o que incorpore tecnología.',
    amountLabel: 'Capital semilla (especie)',
    amountValue: 'Hasta $15.000.000 COP',
    amountHint: '60 incentivos · TDR 2026 · hasta agotar cupos',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'tech',
    region: 'antioquia',
    tags: ['Capital semilla', 'Aceleración', 'Medellín', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar cupos',
    keywords: 'ruta emprendimiento medellin capital semilla ruta n alcaldia',
    accent: 'slate',
    basesUrl:
      'https://www.rutadelemprendimientomedellin.com/_files/ugd/b81507_10457b5836b24f698a5c2544416eae37.pdf',
  },
  {
    id: 'fondo-mujer-a-pulso',
    initials: 'FM',
    entity: 'Fondo Mujer Libre y Productiva',
    entitySub: 'Convenio Bancóldex / Grupo Bicentenario',
    title: 'Línea de crédito A PULSO',
    summary:
      'Línea de redescuento activa para mujeres microempresarias de actividades no agrícolas, con compensación parcial de capital. Tope por operación: hasta 6 SMMLV. El desembolso se gestiona con establecimientos financieros aliados.',
    requirement:
      'Mujer con micronegocio; SISBEN IV A, B o C o ingresos anuales inferiores a 50 SMMLV; destinar el crédito al micronegocio.',
    amountLabel: 'Tope por operación',
    amountValue: 'Hasta 6 SMMLV',
    amountHint: 'Alivio a capital en operaciones de hasta 2 SMMLV',
    funding: 'cofinanciacion',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Mujeres', 'Microempresa', 'Ventanilla activa'],
    urgency: 'continuous',
    urgencyLabel: 'Línea activa',
    keywords: 'fondo mujer a pulso bancoldex credito microempresarias',
    accent: 'black',
    basesUrl: 'https://fondomujer.gov.co/portfolio/linea-de-credito-creo-un-credito-para-conocernos/',
  },
]

export function matchesRegion(item: Convocatoria, region: string) {
  if (region === 'all') return true
  if (item.region === 'nacional') return true
  return item.region === region
}

export function isOpenToday(item: Convocatoria) {
  return item.urgency !== 'upcoming' && item.urgency !== 'closed'
}
