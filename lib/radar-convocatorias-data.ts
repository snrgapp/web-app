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

export const RADAR_REVIEWED_AT = '2026-10-21'

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
 * Fichas contrastadas el 2026-10-21 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'minciencias-53-cordoba',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 53 · SGR ASCTEI Córdoba',
    title: 'Fortalecimiento de capacidades CTeI en Córdoba — Corte 2',
    summary:
      'Convocatoria abierta del SGR para fortalecer CTeI en Córdoba con proyectos de reactivación agrícola, social y ambiental. Bolsa publicada: $28.094.792.444. Cierre: 23 de octubre de 2026, 4:00 p. m.',
    requirement:
      'Proponentes del SNCTI según TDR, alineados con los retos estratégicos de CTeI del plan bienal 2025-2026 de Córdoba.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$28.094.792.444 COP',
    amountHint: 'Cierre 23 oct 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'sostenibilidad',
    region: 'caribe',
    tags: ['Cofinanciación', 'CTeI', 'Córdoba', 'SGR'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'minciencias 53 cordoba sgr asctei ctei reactivacion',
    accent: 'black',
    closesAt: '2026-10-23',
    isOpen: true,
    basesUrl:
      'https://minciencias.gov.co/convocatorias/plan-convocatorias-asctei-2025-2026/convocatoria-para-el-fortalecimiento-capacidades-0',
  },
  {
    id: 'rionegro-semillas-bienestar-2026',
    initials: 'RG',
    entity: 'Alcaldía de Rionegro',
    entitySub: 'Secretaría de Desarrollo Económico · NODO 360',
    title: 'Semillas del Bienestar Rionegro 2026',
    summary:
      'Incentivos no reembolsables para 130 iniciativas en Rionegro (Validación, Preincubación, Incubación y Turismo sostenible). Bolsa: $700 millones. Inscripción en línea y entrega física de documentos del 13 al 23 de octubre de 2026.',
    requirement:
      'Persona natural mayor de edad, persona jurídica, mipyme, unidad productiva informal o ESAL con residencia o domicilio mínimo de 12 meses en Rionegro, según TDR.',
    amountLabel: 'Incentivo por iniciativa',
    amountValue: 'Hasta $7.000.000 COP',
    amountHint: '130 cupos · bolsa $700 millones · cierre 23 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'antioquia',
    tags: ['Capital no reembolsable', 'Rionegro', 'Emprendimiento', 'Cierra 23 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'rionegro semillas del bienestar nodo 360 capital semilla antioquia',
    accent: 'yellow',
    closesAt: '2026-10-23',
    isOpen: true,
    basesUrl:
      'https://rionegro.gov.co/publicaciones/1467/rionegro-destina-700-millones-para-impulsar-130-emprendimientos-con-semillas-del-bienestar-2026/',
  },
  {
    id: 'atenea-cafam-cohorte-1-3',
    initials: 'AT',
    entity: 'Agencia ATENEA / CAFAM',
    entitySub: 'Piloto 2600 Campus CTIB · Cohorte 1.3',
    title: 'Operación secundaria — Cohorte 1.3 (Cafam)',
    summary:
      'Selecciona 2 emprendimientos de alto impacto, 2 de base científica y tecnológica y 26 mipymes afiliadas a CAFAM para la implementación del Programa 2600 Campus CTIB. Estado: Abierta. Cierre: 28 de octubre de 2026, 4:59 p. m.',
    requirement:
      'Empresas y emprendimientos en la lista de elegibles de la operación primaria, afiliados a CAFAM, según los TDR de la convocatoria.',
    amountLabel: 'Cupos de la cohorte',
    amountValue: '30 beneficiarios (2+2+26)',
    amountHint: 'Cierre 28 oct 2026 · 4:59 p. m.',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'bogota',
    tags: ['Aceleración', 'Bogotá', 'CAFAM', 'CTeI'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 28 de octubre',
    keywords: 'atenea cafam 2600 campus ctib cohorte 1.3 operacion secundaria',
    accent: 'slate',
    closesAt: '2026-10-28',
    isOpen: true,
    basesUrl: 'https://www.agenciaatenea.gov.co/hema/piloto-2600-campus/convocatoria/op-secundaria-cafam',
  },
  {
    id: 'cabuyaro-resolucion-957-2026',
    initials: 'CB',
    entity: 'Alcaldía de Cabuyaro (Meta)',
    entitySub: 'Resolución 957 de 2026 · FEM / FODESCA / agro',
    title: 'Capital semilla FEM, FODESCA y fortalecimiento agropecuario',
    summary:
      'Tres categorías independientes: FEM (capital semilla para mujeres, 22 cupos de $875.452,50), FODESCA (15 cupos en especie hasta $8.000.000) y fortalecimiento agropecuario (12 cupos en especie hasta $8.000.000). Cierre de recepción: 29 de octubre de 2026.',
    requirement:
      'Mujeres rurales o urbanas (FEM), emprendedores en marcha y microempresas (FODESCA) o pequeños y medianos productores rurales (agro) del municipio de Cabuyaro, Meta.',
    amountLabel: 'Tope por beneficiario',
    amountValue: 'Hasta $8.000.000 COP (especie)',
    amountHint: 'FEM $875.452,50 · cierre recepción 29 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'agro',
    region: 'orinoquia',
    tags: ['Capital semilla', 'Mujeres', 'Meta', 'Cierra 29 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 29 de octubre',
    keywords: 'cabuyaro meta fem fodesca capital semilla resolucion 957',
    accent: 'yellow',
    closesAt: '2026-10-29',
    isOpen: true,
    basesUrl:
      'https://cabuyarometa.micolombiadigital.gov.co/sites/cabuyarometa/content/files/001712/85551_resolucion-957-de-convocatoria--2026.pdf',
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
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria adenda 5',
    accent: 'black',
    closesAt: '2026-10-30',
    isOpen: true,
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
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para identificación, colaboración y logística. El listado iNNpulsa la marca abierta hasta el 31 de octubre de 2026.',
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
    isOpen: true,
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
  },
  {
    id: 'minciencias-56-emergencia',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 56 · Decreto 1414 de 2026',
    title: 'Emergencia: recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos elegibles del SGR para adaptar, validar, transferir o escalar tecnologías e innovaciones en departamentos afectados por la emergencia. Bolsa: $700.000.000.000. Cierre: 3 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianzas con domicilio en departamentos afectados por la emergencia, según TDR (incluye al menos una organización de la sociedad civil cuando aplique).',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'sostenibilidad',
    region: 'nacional',
    tags: ['Cofinanciación', 'Emergencia', 'SGR', 'CTeI'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 3 de noviembre',
    keywords: 'minciencias 56 emergencia sgr capacidades transformadoras decreto 1414',
    accent: 'black',
    closesAt: '2026-11-03',
    isOpen: true,
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-emergencia-para-la-recuperacion-y-generacion-capacidades-transformadoras',
  },
  {
    id: 'innpulsa-calidad-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad · IATF 16949',
    title: 'Formación IATF 16949:2016 para mipymes automotriz',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de la calidad conforme a IATF 16949:2016 en la cadena automotriz y de motopartes. Abierta hasta el 4 de noviembre de 2026, 23:59.',
    requirement:
      'Mipyme (Decreto 957 de 2019) con al menos un año de constitución, 5 trabajadores con contrato laboral, ubicada en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca, y actividad en automotriz/motopartes.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF 16949',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'Automotriz', 'IATF', 'Mipymes'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad mipymes automotriz motopartes',
    accent: 'yellow',
    closesAt: '2026-11-04',
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    amountHint: 'Estado: Activa · alivio a capital en operaciones de hasta 2 SMMLV',
    funding: 'cofinanciacion',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Mujeres', 'Microempresa', 'Ventanilla activa'],
    urgency: 'continuous',
    urgencyLabel: 'Línea activa',
    keywords: 'fondo mujer a pulso bancoldex credito microempresarias',
    accent: 'black',
    isOpen: true,
    basesUrl: 'https://fondomujer.gov.co/portfolio/linea-de-credito-creo-un-credito-para-conocernos/',
  },
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Convocatoria de banca de inversión para pymes: estructuración y acompañamiento para operaciones de crecimiento. Apertura el 24 de abril de 2026; cierra al agotar el presupuesto disponible. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, y estados financieros 2023-2025.',
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
    isOpen: true,
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/finbi-banca-de-inversion-para-pymes-2026',
  },
  {
    id: 'prosperidad-inclusion-financiera',
    initials: 'PS',
    entity: 'Prosperidad Social',
    entitySub: 'Economía Popular · Banco Agrario / FNG',
    title: 'Inclusión Financiera para la Economía Popular',
    summary:
      'Crédito preferencial de hasta 80 SMMLV ($140.000.000 en 2026) para unidades productivas asociativas, con compensación del 14 % y garantía FNG del 90 %. El formulario RIT permanece abierto hasta agotar recursos.',
    requirement:
      'UPA legalmente constituida de mínimo tres personas; al menos el 61 % en Sisbén IV A01–A05, B01–B07 o C01–C18, víctimas de desplazamiento o comunidad indígena certificada.',
    amountLabel: 'Tope del crédito',
    amountValue: 'Hasta $140.000.000 COP',
    amountHint: 'Hasta 80 SMMLV · inscripción hasta agotar recursos',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Economía popular', 'FNG', 'Hasta agotar recursos'],
    urgency: 'continuous',
    urgencyLabel: 'Inscripción hasta agotar recursos',
    keywords: 'prosperidad social inclusion financiera economia popular banco agrario fng',
    accent: 'black',
    isOpen: true,
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
