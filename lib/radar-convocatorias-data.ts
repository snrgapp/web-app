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

export const RADAR_REVIEWED_AT = '2026-10-30'

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
 * Fichas contrastadas el 2026-10-30 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'innpulsa-logyca-gs1',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Alianza LOGYCA / GS1',
    title: 'Servicios complementarios logísticos, de colaboración y códigos de barras',
    summary:
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para identificación, colaboración y logística. El API de convocatorias iNNpulsa la marca abierta hasta el 31 de octubre de 2026.',
    requirement: 'Empresarios o emprendedores en Colombia que requieran estándares GS1 / LOGYCA.',
    amountLabel: 'Beneficio principal',
    amountValue: '7 servicios GS1 gratuitos',
    amountHint: 'Cierre 31 oct 2026',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Logística', 'Códigos de barras', 'Nacional', 'Sin costo'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 31 de octubre',
    keywords: 'innpulsa logyca gs1 codigos de barras mincit',
    accent: 'yellow',
    closesAt: '2026-10-31',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
  },
  {
    id: 'huila-sembremos-progreso-001-2026',
    initials: 'GH',
    entity: 'Gobernación del Huila',
    entitySub: 'Convocatoria pública 001-2026',
    title: 'Sembremos Progreso por un Huila Grande, Productivo y en Paz 2026',
    summary:
      'Capital y fortalecimiento para emprendimientos con enfoque de paz e inclusión social en los 37 municipios del Huila. La ficha oficial publica los TDR de la convocatoria 001-2026 (modificada el 28 oct 2026). Cierre: 2 de noviembre de 2026, 5:00 p. m., o al completar 300 postulaciones radicadas.',
    requirement:
      'Colombiano mayor de edad, residente en el Huila, de población priorizada (jóvenes 18-28, discapacidad, LGBTIQ+, líderes comunales víctimas, reincorporación/reintegración), con unidad productiva existente o propuesta de creación.',
    amountLabel: 'Bolsa publicada',
    amountValue: 'Más de $601.000.000 COP',
    amountHint: 'Cierre 2 nov 2026 · 17:00 o 300 postulaciones',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'Huila', 'Inclusión', 'Cierra 2 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 2 de noviembre',
    keywords: 'huila sembremos progreso 001-2026 gobernacion emprendimiento paz',
    accent: 'yellow',
    closesAt: '2026-11-02',
    basesUrl:
      'https://www.huila.gov.co/gobierno-y-desarrollo-comunitario/publicaciones/17383/convocatoria-publica-sembremos-progreso-por-un-huila-grande-productivo-y-en-paz-2026/',
  },
  {
    id: 'minciencias-56-emergencia',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 56 · SGR CTeI',
    title: 'Emergencia para recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos elegibles con recursos de la Asignación CTeI del SGR, en el marco del Decreto 1414 de 2026, para adaptar, validar, transferir o escalar tecnologías e innovaciones de atención y recuperación. Ficha Abierta. Cierre: 3 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con al menos una IES, una entidad territorial de los departamentos afectados y un actor SNCTI o del sector productivo u organización de la sociedad civil, según TDR de la convocatoria 56.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 16:00',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'SGR', 'Emergencia', 'Cierra 3 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 3 de noviembre',
    keywords: 'minciencias 56 emergencia sgr ctei decreto 1414',
    accent: 'black',
    closesAt: '2026-11-03',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-emergencia-para-la-recuperacion-y-generacion-capacidades-transformadoras',
  },
  {
    id: 'innpulsa-calidad-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad',
    title: 'Formación IATF 16949:2016 para mipymes automotriz',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de calidad IATF 16949:2016 en mipymes de la cadena automotriz y de motopartes. El API iNNpulsa la marca abierta hasta el 4 de noviembre de 2026 (23:59).',
    requirement:
      'Mipyme (Decreto 957 de 2019) con al menos un año de constitución, ubicada en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca, del sector automotriz/motopartes.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF 16949',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'Automotriz', 'IATF', 'Cierra 4 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad mipymes automotriz motopartes',
    accent: 'yellow',
    closesAt: '2026-11-04',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/formacion-y-asistencia-tecnica-en-calidad-para-mipymes-convocatoria-territorial--o2q9yw',
  },
  {
    id: 'fondo-emprender-167-cordoba',
    initials: 'FE',
    entity: 'Fondo Emprender (SENA)',
    entitySub: 'Convocatoria focalizada No. 167',
    title: 'Córdoba productiva: emprendimiento y fortalecimiento',
    summary:
      'Financia iniciativas productivas, unidades económicas y planes de negocio para creación o fortalecimiento en todos los sectores en Córdoba, de forma individual o asociativa. Recursos asignados: $20.000.000.000. Apertura 26 de octubre de 2026; cierre 6 de noviembre de 2026. La ficha no muestra banner de convocatoria cerrada.',
    requirement:
      'Planes de negocio de creación o fortalecimiento en el departamento de Córdoba que cumplan la normatividad vigente del Fondo Emprender.',
    amountLabel: 'Recursos asignados',
    amountValue: '$20.000.000.000 COP',
    amountHint: 'Cierre 6 nov 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'caribe',
    tags: ['Capital semilla', 'Córdoba', 'Fondo Emprender', 'Cierra 6 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 6 de noviembre',
    keywords: 'fondo emprender 167 cordoba productiva sena capital semilla',
    accent: 'yellow',
    closesAt: '2026-11-06',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1672026.aspx',
  },
  {
    id: 'minciencias-54-regional',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 54 · SGR CTeI',
    title: 'Proyectos regionales para capacidades científico-tecnológicas',
    summary:
      'Banco especial de proyectos elegibles de alcance regional para fortalecer capacidades científico-tecnológicas. Ficha Abierta. Recursos: $927.591.817.322. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianzas de actores del SNCTI según TDR, con ejecución en al menos dos departamentos de una misma región del SGR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$927.591.817.322 COP',
    amountHint: 'Cierre 13 nov 2026 · 16:00',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'SGR', 'Regional', 'Cierra 13 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 54 sgr ctei capacidades cientifico tecnologicas regional',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-54-convocatoria-especial-para-la-financiacion-proyectos-para-el',
  },
  {
    id: 'minciencias-55-macroproyectos',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 55 · SGR CTeI',
    title: 'Macroproyectos nacionales de capacidades científico-tecnológicas',
    summary:
      'Listado de macroproyectos nacionales elegibles con recursos de la Asignación CTeI del SGR (bienio 2025-2026). Monto indicativo $500.000.000.000. Ficha Abierta. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianzas con actores de varias regiones; al menos uno debe ser entidad territorial, empresa u otro actor del SNCTI según TDR de la convocatoria 55.',
    amountLabel: 'Recursos indicativos',
    amountValue: '$500.000.000.000 COP',
    amountHint: 'Cierre 13 nov 2026 · 16:00',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'SGR', 'Nacional', 'Cierra 13 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 55 macroproyectos sgr ctei capacidades nacionales',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-especial-para-la-financiacion-macroproyectos-nacionales-para-el',
  },
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial (hasta 4 horas) y mentorías individuales gratuitas para unidades productivas de víctimas del conflicto en municipios PDET. 600 cupos de formación y 360 de mentoría. La ficha HTML aún muestra el 30 de octubre; la Adenda 6 (19 oct 2026) mueve el cierre al 15 de noviembre de 2026, 11:59 p. m.',
    requirement:
      'Unidad productiva de víctima del conflicto armado, domiciliada y en operación en un municipio PDET priorizado por el programa.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: '600 formación · 360 mentoría',
    amountHint: 'Gratuito · cierre 15 nov 2026 · 11:59 p. m. (Adenda 6)',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Víctimas', 'PDET', 'Gratuito'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 15 de noviembre',
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria pdet adenda 6',
    accent: 'black',
    closesAt: '2026-11-15',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/transformacion-financiera-territorios-de-paz',
  },
  {
    id: 'innpulsa-cfp-honda',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Honda, norte del Tolima y Guaduas',
    summary:
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Honda y municipios del norte del Tolima, más Guaduas (Cundinamarca). Cierre publicado: 30 de noviembre de 2026 (23:59).',
    requirement:
      'Unidad productiva o MiPymes en Honda, Ambalema, Armero, Guayabal, Fresno, Casabianca, Herveo, Lérida, Líbano, Mariquita, Murillo, Palocabildo, Villahermosa (Tolima) o Guaduas (Cundinamarca).',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '200 cupos · postulación presencial',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['ZASCA', 'Tolima', 'Guaduas', 'Cierra 30 nov 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de noviembre',
    keywords: 'innpulsa zasca honda tolima guaduas tecnologias',
    accent: 'slate',
    closesAt: '2026-11-30',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-honda-norte-del-tolima-y-guaduas-postulacion-presencial-rg0fa',
  },
  {
    id: 'innpulsa-cfp-nortedesantander-c2',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Norte de Santander — Cohorte 2',
    summary:
      'Postulación presencial para vincular 300 unidades productivas o MiPymes de cualquier sector en municipios de Norte de Santander. Cierre publicado: 2 de diciembre de 2026.',
    requirement: 'Unidad productiva o MiPymes ubicada en Norte de Santander.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '300 cupos · postulación presencial',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'santanderes',
    tags: ['ZASCA', 'Norte de Santander', 'Cierra 2 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 2 de diciembre',
    keywords: 'innpulsa zasca norte de santander cucuta tecnologias cohorte 2',
    accent: 'slate',
    closesAt: '2026-12-02',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69f3d045a338026cc9d9e0f2',
  },
  {
    id: 'fondo-mujer-a-pulso',
    initials: 'FM',
    entity: 'Fondo Mujer Libre y Productiva',
    entitySub: 'Convenio Bancóldex / Grupo Bicentenario',
    title: 'Línea de crédito A PULSO',
    summary:
      'Línea de redescuento activa para mujeres microempresarias de actividades no agrícolas, con compensación parcial de capital. Tope por operación: hasta 6 SMMLV. El desembolso se gestiona con establecimientos financieros aliados. Estado publicado: Activa.',
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
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Asesoría financiera personalizada para pymes: Etapa I de diagnóstico y estructuración (Bancóldex asume el 85%) y Etapa II de consecución de recursos. Abierta desde el 24 de abril de 2026 hasta agotar presupuesto. Fecha límite para ejecutar la Etapa I: 30 de noviembre de 2026.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025 y que no haya accedido a Finbi en los últimos 3 años.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Banca de inversión pyme',
    amountHint: 'Hasta agotar presupuesto · Etapa I hasta 30 nov 2026',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Pymes', 'Banca de inversión', 'Hasta agotar cupo'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar presupuesto',
    keywords: 'bancoldex finbi 2026 banca inversion pymes',
    accent: 'black',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/finbi-banca-de-inversion-para-pymes-2026',
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
