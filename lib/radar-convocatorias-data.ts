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

export const RADAR_REVIEWED_AT = '2026-11-15'

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
 * Fichas contrastadas el 2026-11-15 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta (p. ej. convocatorias.innpulsacolombia.com) o sin llamado
 * abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial (600 cupos) y mentorías individuales (360 cupos) para unidades productivas de víctimas del conflicto en municipios PDET. El cronograma vigente (Adenda 7) cierra postulaciones el 19 de noviembre de 2026 a las 11:59 p. m. El programa es gratuito; no garantiza crédito.',
    requirement:
      'Unidad productiva de población víctima, domiciliada y en operación en un municipio PDET priorizado, con compromiso de asistencia presencial.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: '600 formación + 360 mentoría',
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
    id: 'fondo-emprender-168-2026',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria 168 · Volver a Crecer',
    title: 'Convocatoria 168 — Volver a Crecer',
    summary:
      'Capital semilla para fortalecer negocios formalmente constituidos en Caldas, Chocó, Quindío, Risaralda, Valle del Cauca y Tolima que acrediten afectación por el terremoto del 10 de agosto de 2026 o por incendios forestales. Bolsa publicada: $34.140.799.482. Cierre: 30 de diciembre de 2026, 6:00 p. m.',
    requirement:
      'Iniciativa, unidad productiva o plan de negocio formal, en modalidad individual o asociativa, localizado en uno de los seis departamentos y con afectación acreditada.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$34.140.799.482 COP',
    amountHint: 'Capital semilla · cierre 30 dic 2026 · 6:00 p. m.',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'SENA', 'Reactivación', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'fondo emprender sena 168 volver a crecer terremoto incendios caldas chocó quindio risaralda valle tolima',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl:
      'https://www.fondoemprender.com/DocsConvocatoriasNacionales/2026/Octubre/CONVOCATORIA%20No.%20168%20VOLVER%20A%20CRECER_M.pdf',
    sourceUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1682026.aspx',
  },
  {
    id: 'finagro-lec-nino-2026',
    initials: 'FG',
    entity: 'Finagro',
    entitySub: 'LEC Desarrollo Productivo — Fenómeno del Niño',
    title: 'LEC Fenómeno del Niño 2026',
    summary:
      'Apertura de la Línea Especial de Crédito Desarrollo Productivo — Fenómeno del Niño (Circular Externa 128 de 2026) para destinos de riego, drenaje, manejo hídrico y control de inundaciones. Las operaciones se atienden en orden de registro hasta el 30 de diciembre de 2026 o hasta agotar recursos.',
    requirement:
      'Productor agropecuario, acuícola o de pesca elegible ante Finagro, vía intermediario financiero y redescuento AGROS en los destinos habilitados por la circular.',
    amountLabel: 'Instrumento',
    amountValue: 'Crédito LEC con subsidio a tasa',
    amountHint: 'Hasta el 30 dic 2026 o agotar recursos',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'agro',
    region: 'nacional',
    tags: ['Agroindustria', 'LEC', 'Fenómeno del Niño', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'finagro lec 2026 fenomeno del nino riego drenaje circular 128',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl:
      'https://www.finagro.com.co/sites/default/files/2026-10/Circular%20Externa%20No.%20128%20de%202026.pdf',
    sourceUrl:
      'https://www.finagro.com.co/transparencia-y-acceso-informacion-publica/normativa/circulares/titulo-circular-externa-128-de-2026',
  },
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Asesoría financiera para pymes: diagnóstico y estructuración (Bancóldex cubre el 85 % de la Etapa I) y acompañamiento para consecución de recursos. Apertura el 24 de abril de 2026; cierra al agotar el presupuesto. La ficha fija el 30 de noviembre de 2026 como fecha límite para ejecutar la Etapa I.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025 y sin haber usado Finbi en los últimos 3 años.',
    amountLabel: 'Cofinanciación Etapa I',
    amountValue: 'Bancóldex asume el 85%',
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
    id: 'prosperidad-inclusion-financiera-2026',
    initials: 'PS',
    entity: 'Prosperidad Social',
    entitySub: 'Banco Agrario y Fondo Nacional de Garantías',
    title: 'Inclusión Financiera para la Economía Popular',
    summary:
      'Créditos con tasa preferencial para unidades productivas asociativas agropecuarias y no agropecuarias, hasta 80 SMMLV ($140.000.000 en 2026), con garantía FNG del 90 % sin costo para el solicitante y compensación del 14 % del capital por plan de inversión y buen pago. El formulario permanece abierto hasta agotar recursos.',
    requirement:
      'UPA legalmente constituida con mínimo tres personas; al menos el 61 % debe ser población objeto de Prosperidad Social (Sisbén IV A01–C18, RUV o comunidades indígenas certificadas).',
    amountLabel: 'Tope del crédito',
    amountValue: 'Hasta 80 SMMLV',
    amountHint: '$140.000.000 en 2026 · hasta agotar recursos',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Economía popular', 'FNG', 'Hasta agotar recursos'],
    urgency: 'continuous',
    urgencyLabel: 'Inscripción hasta agotar recursos',
    keywords: 'prosperidad social inclusion financiera economia popular banco agrario fng upa',
    accent: 'black',
    basesUrl:
      'https://prosperidadsocial.gov.co/programas/economia-popular-para-el-cambio/inclusion-financiera-para-la-economia-popular/',
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
