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

export const RADAR_REVIEWED_AT = '2026-11-10'

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
 * Fichas contrastadas el 2026-11-10 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'fondo-emprender-167',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada No. 167',
    title: 'Córdoba productiva: emprendimiento y fortalecimiento',
    summary:
      'Capital semilla condonable para crear o fortalecer iniciativas productivas en todos los sectores del departamento de Córdoba, en modalidad individual o asociativa. Bolsa publicada: $20.000 millones. Cierre en la plataforma: 10 de noviembre de 2026 (Adenda 01).',
    requirement:
      'Persona natural, grupo asociativo u organización habilitada por el Reglamento Interno del Fondo Emprender, con domicilio en Córdoba y Ruta Emprendedora SENA.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$20.000.000.000 COP',
    amountHint: 'Cierre 10 nov 2026 · capital semilla condonable',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'caribe',
    tags: ['Capital semilla', 'Córdoba', 'SENA', 'Cierra 10 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 10 de noviembre',
    keywords: 'fondo emprender sena 167 cordoba productiva capital semilla',
    accent: 'yellow',
    closesAt: '2026-11-10',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1672026.aspx',
  },
  {
    id: 'minciencias-54-2026',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 54 · SGR CTeI',
    title: 'Proyectos regionales para capacidades científico-tecnológicas',
    summary:
      'Banco de proyectos elegibles de alcance regional (mínimo dos departamentos de una misma región SGR) para fortalecer capacidades de CTeI. Bolsa: $927.591.817.322. Tope por proyecto: $17.177.626.246. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con IES, otro actor SNCTI, entidad territorial y un actor usuario (empresa, gremio, organización o entidad pública).',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$927.591.817.322 COP',
    amountHint: 'Hasta $17.177.626.246 por proyecto · cierra 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'CTeI', 'Regalías', 'Cierra 13 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 54 sgr ctei capacidades cientifico tecnologicas regalías',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-54-convocatoria-especial-para-la-financiacion-proyectos-para-el',
  },
  {
    id: 'minciencias-55-2026',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 55 · SGR CTeI',
    title: 'Macroproyectos nacionales de capacidades científico-tecnológicas',
    summary:
      'Listado de macroproyectos nacionales elegibles con intervención en al menos dos regiones del SGR. Bolsa indicativa: $500.000 millones para diez macroproyectos (hasta $50.000 millones cada uno). Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza de mínimo tres personas jurídicas nacionales; el proponente con reconocimiento SNCTI o trayectoria CTeI, e intervención en mínimo dos regiones SGR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$500.000.000.000 COP',
    amountHint: 'Hasta $50.000.000.000 por macroproyecto · cierra 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'Macroproyectos', 'CTeI', 'Cierra 13 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 55 sgr macroproyectos capacidades cientifico tecnologicas',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-especial-para-la-financiacion-macroproyectos-nacionales-para-el',
  },
  {
    id: 'innpulsa-calidad-iatf',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ONUDI · calidad automotriz',
    title: 'Formación IATF 16949 para mipymes de autopartes',
    summary:
      'Asistencia técnica para implementar un sistema de calidad IATF 16949:2016 en la cadena automotriz y de motopartes. 50 horas de consultoría (25 presenciales y 25 virtuales). El listado iNNpulsa la marca abierta hasta el 30 de noviembre de 2026 (23:59).',
    requirement:
      'Mipyme con al menos un año de constitución y 5 trabajadores, ubicada en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca, con actividad de la cadena automotriz o de motopartes.',
    amountLabel: 'Beneficio principal',
    amountValue: '50 horas de asistencia IATF',
    amountHint: 'Cierre 30 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'IATF', 'Autopartes', 'Cierra 30 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad mipymes automotriz motopartes onudi',
    accent: 'yellow',
    closesAt: '2026-11-30',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/formacion-y-asistencia-tecnica-en-calidad-para-mipymes-convocatoria-territorial--o2q9yw',
  },
  {
    id: 'innpulsa-cfp-honda',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Honda, norte del Tolima y Guaduas',
    summary:
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Honda, municipios del norte del Tolima y Guaduas (Cundinamarca). Cierre publicado: 30 de noviembre de 2026, 23:59.',
    requirement: 'Unidad productiva o MiPymes ubicada en Honda, norte del Tolima o Guaduas.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '200 cupos · postulación presencial · cierra 30 nov 2026',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['ZASCA', 'Tolima', 'Guaduas', 'Cierra 30 nov 2026'],
    urgency: 'soon',
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
    id: 'fondo-emprender-168',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada No. 168',
    title: 'Volver a Crecer: recuperación de territorios afectados',
    summary:
      'Capital semilla condonable para fortalecer negocios formales de Caldas, Chocó, Quindío, Risaralda, Valle del Cauca y Tolima afectados por el terremoto del 10 de agosto de 2026 o por incendios forestales. Bolsa: $34.140.799.482. En modalidad individual, hasta 42 SMMLV. Cierre: 30 de diciembre de 2026, 6:00 p. m.',
    requirement:
      'Negocio formal con al menos un año de operación en los departamentos priorizados, matrícula vigente y constancia de afectación; solo línea de fortalecimiento (no creación).',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$34.140.799.482 COP',
    amountHint: 'Hasta 42 SMMLV en modalidad individual · cierra 30 dic 2026 · 6:00 p. m.',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'Fortalecimiento', 'SENA', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'fondo emprender 168 volver a crecer terremoto incendios caldas chocó quindio risaralda valle tolima',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1682026.aspx',
  },
  {
    id: 'innpulsa-cfp-bucaramanga-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Bucaramanga 2026',
    summary:
      'Fortalecimiento productivo y apropiación tecnológica para unidades productivas y MiPymes de Bucaramanga. El listado iNNpulsa la mantiene abierta hasta agotar 500 cupos.',
    requirement: 'Unidad productiva o MiPymes con operación en Bucaramanga.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '500 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'santanderes',
    tags: ['ZASCA', 'Bucaramanga', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar 500 cupos',
    keywords: 'innpulsa zasca bucaramanga tecnologias 500 cupos',
    accent: 'slate',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-bucaramanga-2026-inscribete-500-cupos-disponibles-cpts-92coq',
  },
  {
    id: 'innpulsa-cfp-arauca-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Arauca 2026',
    summary:
      'Fortalecimiento productivo, competitividad y apropiación tecnológica para unidades productivas y MiPymes de Arauca. Abierta hasta agotar 150 cupos, según el listado público de iNNpulsa.',
    requirement: 'Unidad productiva o MiPymes con operación en Arauca.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '150 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'orinoquia',
    tags: ['ZASCA', 'Arauca', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar 150 cupos',
    keywords: 'innpulsa zasca arauca tecnologias 150 cupos',
    accent: 'slate',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-arauca-2026-inscribete-150-cupos-disponibles-6iydow',
  },
  {
    id: 'innpulsa-jovenes-valledupar-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías Jóvenes',
    title: 'Tecnologías Jóvenes Valledupar 2026',
    summary:
      'Formación, asistencia técnica y acceso a tecnologías, maquinaria e infraestructura para jóvenes de 15 a 28 años en Valledupar y municipios aledaños, con foco en software y hardware. Abierta hasta agotar 65 cupos.',
    requirement:
      'Joven colombiano entre 15 y 28 años cumplidos, ubicado en Valledupar o municipios aledaños, interesado en habilidades tecnológicas y empresariales.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Formación + infraestructura ZASCA',
    amountHint: '65 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'tech',
    region: 'caribe',
    tags: ['ZASCA', 'Jóvenes', 'Valledupar', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar 65 cupos',
    keywords: 'innpulsa zasca jovenes valledupar software hardware',
    accent: 'yellow',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-jovenes-valledupar-2026-inscribete-65-cupos-disponibles-twadw',
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
  {
    id: 'finagro-lec-2026',
    initials: 'FG',
    entity: 'Finagro',
    entitySub: 'Líneas Especiales de Crédito',
    title: 'LEC Finagro 2026',
    summary:
      'Líneas Especiales de Crédito 2026 (Desarrollo Productivo y Reforma Agraria) con subsidio a la tasa para productores y empresas del sector agropecuario, acuícola y rural. Las operaciones se registran hasta el 31 de diciembre de 2026 o hasta agotar recursos. Tope de subsidio por beneficiario: 5.000 UVB ($60.550.000).',
    requirement: 'Actividad agropecuaria, acuícola o rural elegible ante Finagro, vía intermediario financiero de redescuento.',
    amountLabel: 'Tope de subsidio por beneficiario',
    amountValue: 'Hasta $60.550.000 COP',
    amountHint: 'Hasta el 31 dic 2026 o agotar recursos · Circular Externa 100 de 2026',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'agro',
    region: 'nacional',
    tags: ['Agroindustria', 'LEC', 'Crédito de fomento', '2026'],
    urgency: 'continuous',
    urgencyLabel: 'Línea 2026 publicada',
    keywords: 'finagro lec 2026 credito agro rural circular 100 desarrollo productivo',
    accent: 'yellow',
    basesUrl: 'https://www.finagro.com.co/lineas-especiales-de-credito-lec-finagro-2026',
  },
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Asesoría financiera personalizada para pymes: diagnóstico, estructuración y acompañamiento para acceder a deuda. Bancóldex cubre el 85 % de la Etapa I. Apertura el 24 de abril de 2026; cierra al agotar presupuesto. La Etapa I debe ejecutarse antes del 30 de noviembre de 2026.',
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
