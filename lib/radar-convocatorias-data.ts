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

export const RADAR_REVIEWED_AT = '2026-10-17'

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
 * Fichas contrastadas el 2026-10-17 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'atenea-cafam-op2-2026',
    initials: 'AT',
    entity: 'Agencia ATENEA / CAFAM',
    entitySub: 'Piloto 2600 Campus CTIB',
    title: 'Operación secundaria — Cohorte 1.3 (Cafam)',
    summary:
      'Selecciona 2 emprendimientos de alto impacto, 2 de base científica y tecnológica y 26 mipymes con necesidades de innovación para la cohorte 1.3 del piloto 2600 Campus. Estado en ficha: abierta. Cierre: 21 de octubre de 2026, 4:59 p. m.',
    requirement:
      'Empresa o emprendimiento en la lista de elegibles y afiliado a la Caja de Compensación Familiar Cafam.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Implementación 2600 Campus',
    amountHint: '30 cupos · cierre 21 oct 2026 · 4:59 p. m.',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'bogota',
    tags: ['CTeI', 'Cafam', 'Bogotá', 'Cierra 21 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 21 de octubre',
    keywords: 'atenea cafam 2600 campus operacion secundaria cohorte 1.3',
    accent: 'yellow',
    closesAt: '2026-10-21',
    basesUrl: 'https://www.agenciaatenea.gov.co/sites/default/files/convocatorias/2026-10/tdr-op2-cafam.pdf',
    sourceUrl: 'https://www.agenciaatenea.gov.co/hema/piloto-2600-campus/convocatoria/op-secundaria-cafam',
  },
  {
    id: 'minciencias-53-cordoba',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 53 · SGR CTeI Córdoba',
    title: 'Fortalecimiento de capacidades CTeI en Córdoba — corte 2',
    summary:
      'Convocatoria abierta del SGR para proyectos de reactivación agrícola, social y ambiental en Córdoba, alineados con el Plan Bienal 2025-2026. Bolsa publicada: $28.094.792.444. Cierre: 23 de octubre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con actor del SNCTI y al menos un actor del sector productivo (empresa, gremio, clúster o cámara) según TDR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$28.094.792.444 COP',
    amountHint: 'Cierre 23 oct 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'agro',
    region: 'caribe',
    tags: ['Cofinanciación', 'CTeI', 'Córdoba', 'Cierra 23 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'minciencias 53 cordoba sgr ctei regalías plan bienal',
    accent: 'black',
    closesAt: '2026-10-23',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/plan-convocatorias-asctei-2025-2026/convocatoria-para-el-fortalecimiento-capacidades-0',
  },
  {
    id: 'rionegro-semillas-bienestar-2026',
    initials: 'RG',
    entity: 'Alcaldía de Rionegro',
    entitySub: 'Secretaría de Desarrollo Económico',
    title: 'Semillas del Bienestar Rionegro 2026',
    summary:
      'Incentivos no reembolsables y formación para 130 iniciativas del municipio. Bolsa: $700 millones. Tope: $7 millones en incubación. Inscripciones y entrega física de documentos: 13 al 23 de octubre de 2026.',
    requirement:
      'Persona natural, jurídica, mipyme, unidad informal o ESAL con residencia o domicilio mínimo de 12 meses en Rionegro, según TDR.',
    amountLabel: 'Incentivo no reembolsable',
    amountValue: 'Hasta $7.000.000 COP',
    amountHint: '130 cupos · bolsa $700 millones · cierre 23 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'antioquia',
    tags: ['Capital semilla', 'Rionegro', 'Antioquia', 'Cierra 23 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'rionegro semillas del bienestar 2026 capital semilla nodo 360',
    accent: 'yellow',
    closesAt: '2026-10-23',
    basesUrl: 'https://rionegro.gov.co/desarrolloeconomico/publicaciones/1169/atencion-a-emprendedores-nodo-360/',
    sourceUrl:
      'https://rionegro.gov.co/publicaciones/1467/rionegro-destina-700-millones-para-impulsar-130-emprendimientos-con-semillas-del-bienestar-2026/',
  },
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial y mentorías para unidades productivas de víctimas del conflicto en municipios priorizados. Cierre de postulaciones: 30 de octubre de 2026, 11:59 p. m. (Adenda 5). Cupos limitados, selección semanal.',
    requirement:
      'Unidad productiva domiciliada y en operación en un municipio priorizado, con condición de víctima verificable.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Cierre 30 oct 2026 · 11:59 p. m.',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Víctimas', 'Territorios priorizados', 'Gratuito'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de octubre',
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria',
    accent: 'black',
    closesAt: '2026-10-30',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/transformacion-financiera-territorios-de-paz',
  },
  {
    id: 'innpulsa-logyca-gs1',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Alianza LOGYCA / GS1',
    title: 'Servicios complementarios logísticos, de colaboración y códigos de barras',
    summary:
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para identificación, colaboración y logística. El API público la marca abierta hasta el 31 de octubre de 2026.',
    requirement: 'Empresarios o emprendedores en Colombia que requieran estándares GS1 / LOGYCA.',
    amountLabel: 'Beneficio principal',
    amountValue: '7 servicios GS1 gratuitos',
    amountHint: 'Cierre 31 oct 2026',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Logística', 'Códigos de barras', 'Nacional', 'Sin costo'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 31 de octubre',
    keywords: 'innpulsa logyca gs1 codigos de barras mincit',
    accent: 'yellow',
    closesAt: '2026-10-31',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
  },
  {
    id: 'minciencias-56-emergencia',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 56 · SGR CTeI',
    title: 'Emergencia: recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos elegibles del SGR para adaptar, validar, transferir o escalar tecnologías en departamentos afectados por la emergencia (Decreto 1414 de 2026). Bolsa: $700.000.000.000. Cierre: 3 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con IES, entidad territorial afectada y actor del SNCTI, sector productivo o sociedad civil, según TDR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'sostenibilidad',
    region: 'nacional',
    tags: ['Cofinanciación', 'Emergencia', 'CTeI', 'Cierra 3 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 3 de noviembre',
    keywords: 'minciencias 56 emergencia sgr capacidades transformadoras decreto 1414',
    accent: 'black',
    closesAt: '2026-11-03',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-emergencia-para-la-recuperacion-y-generacion-capacidades-transformadoras',
  },
  {
    id: 'innpulsa-calidad-iatf',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad',
    title: 'Formación IATF 16949:2016 para mipymes',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de calidad IATF 16949:2016 y avanzar en la cadena automotriz y de motopartes. El API iNNpulsa la marca abierta hasta el 4 de noviembre de 2026, 23:59.',
    requirement: 'Mipymes que cumplan los criterios habilitantes publicados en la ficha al momento de inscribirse.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'IATF', 'Autopartes', 'Cierra 4 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad mipymes automotriz motopartes',
    accent: 'yellow',
    closesAt: '2026-11-04',
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
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Honda, municipios del norte del Tolima y Guaduas (Cundinamarca). Cierre publicado: 30 de noviembre de 2026.',
    requirement: 'Unidad productiva o MiPymes ubicada en Honda, norte del Tolima o Guaduas.',
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
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Convocatoria de banca de inversión para pymes: estructuración y acompañamiento para operaciones de crecimiento. Cierra al agotar el presupuesto de Bancóldex. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026.',
    requirement: 'Empresa pyme que complete el formulario de postulación y ranking de indicadores financieros.',
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
    id: 'prosperidad-inclusion-financiera',
    initials: 'PS',
    entity: 'Prosperidad Social',
    entitySub: 'Banco Agrario y FNG',
    title: 'Inclusión financiera para la Economía Popular',
    summary:
      'Crédito asociativo de hasta 80 SMMLV (hasta $140 millones en 2026), tasa preferencial, garantía FNG del 90 % sin costo y compensación del 14 % por plan de inversión y buen hábito de pago. Inscripción hasta agotar recursos.',
    requirement:
      'Unidad productiva asociativa de mínimo tres personas; al menos el 61 % debe ser población objeto de Prosperidad Social.',
    amountLabel: 'Tope del crédito',
    amountValue: 'Hasta 80 SMMLV',
    amountHint: 'Hasta $140 millones en 2026 · hasta agotar recursos',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Economía popular', 'FNG', 'Hasta agotar recursos'],
    urgency: 'continuous',
    urgencyLabel: 'Inscripción hasta agotar recursos',
    keywords: 'prosperidad inclusion financiera economia popular banco agrario fng',
    accent: 'slate',
    basesUrl:
      'https://prosperidadsocial.gov.co/programas/economia-popular-para-el-cambio/inclusion-financiera-para-la-economia-popular/',
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
