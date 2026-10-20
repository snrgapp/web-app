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

export const RADAR_REVIEWED_AT = '2026-10-20'

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
 * Fichas contrastadas el 2026-10-20 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'atenea-cafam-op-secundaria-13',
    initials: 'AT',
    entity: 'Agencia ATENEA / CAFAM',
    entitySub: '2600 Campus CTIB — Cohorte 1.3',
    title: 'Operación secundaria Cohorte 1.3 (Cafam)',
    summary:
      'Selecciona 2 emprendimientos de alto impacto, 2 de base científica y tecnológica (modalidades A y C) y 26 mipymes con necesidades de innovación. El beneficio lo financia CAFAM en especie (hasta $50, $120 o $25 millones según tipología). Solo lista de elegibles afiliados a Cafam. Cierre: 21 de octubre de 2026, 4:59 p. m.',
    requirement:
      'Estar en la lista de elegibles de la operación primaria y afiliado a CAFAM; postulación según TDR de la Cohorte 1.3.',
    amountLabel: 'Apoyo en especie (máx.)',
    amountValue: 'Hasta $120.000.000 COP',
    amountHint: 'EBCT · 2+2+26 cupos · cierra 21 oct 16:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'bogota',
    tags: ['Campus CTIB', 'CAFAM', 'Bogotá', 'Cierra 21 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 21 de octubre',
    keywords: 'atenea cafam 2600 campus ctib cohorte 1.3 operacion secundaria',
    accent: 'yellow',
    closesAt: '2026-10-21',
    basesUrl: 'https://www.agenciaatenea.gov.co/hema/piloto-2600-campus/convocatoria/op-secundaria-cafam',
  },
  {
    id: 'minciencias-53-cordoba',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 53 del SGR — Córdoba corte 2',
    title: 'Fortalecimiento de capacidades CTeI en Córdoba',
    summary:
      'Banco de proyectos de CTeI para reactivación agrícola, social y ambiental en Córdoba, alineado con el Plan Bienal 2025-2026. Bolsa: $28.094.792.444. Abierta; cierra el 23 de octubre de 2026 a las 4:00 p. m. Alianzas con IES domiciliada en Córdoba y actor productivo.',
    requirement:
      'Alianza con al menos una IES con domicilio principal en Córdoba y actor del sector productivo, según TDR de la convocatoria 53.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$28.094.792.444 COP',
    amountHint: 'Cierre 23 oct 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'caribe',
    tags: ['CTeI', 'Córdoba', 'Regalías', 'Cierra 23 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'minciencias 53 cordoba sgr ctei plan bienal corte 2',
    accent: 'black',
    closesAt: '2026-10-23',
    basesUrl:
      'https://www.minciencias.gov.co/convocatorias/plan-convocatorias-asctei-2025-2026/convocatoria-para-el-fortalecimiento-capacidades-0',
  },
  {
    id: 'rionegro-semillas-bienestar-2026',
    initials: 'RN',
    entity: 'Alcaldía de Rionegro',
    entitySub: 'Secretaría de Desarrollo Económico — NODO 360',
    title: 'Semillas del Bienestar Rionegro 2026',
    summary:
      'Incentivos no reembolsables para 130 emprendimientos del municipio: Validación ($3 millones), Preincubación ($5.875.000), Incubación ($7 millones) y Turismo sostenible ($3 millones). Bolsa $700 millones. Inscripción en línea y entrega física hasta el 23 de octubre de 2026. TDR en NODO 360 (Resolución 0893).',
    requirement:
      'Persona natural, jurídica, mipyme, unidad informal o ESAL con residencia o domicilio mínimo de 12 meses en Rionegro, según TDR.',
    amountLabel: 'Incentivo por iniciativa',
    amountValue: 'Hasta $7.000.000 COP',
    amountHint: '130 cupos · cierre 23 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'antioquia',
    tags: ['Capital semilla', 'Rionegro', 'NODO 360', 'Cierra 23 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'rionegro semillas del bienestar nodo 360 capital semilla alcaldia',
    accent: 'yellow',
    closesAt: '2026-10-23',
    basesUrl: 'https://rionegro.gov.co/desarrolloeconomico/publicaciones/1169/atencion-a-emprendedores-nodo-360/',
  },
  {
    id: 'cabuyaro-fem-fodesca-2026',
    initials: 'CB',
    entity: 'Alcaldía de Cabuyaro (Meta)',
    entitySub: 'FEM / FODESCA / fortalecimiento agropecuario',
    title: 'Capital semilla FEM, FODESCA y fortalecimiento agropecuario 2026',
    summary:
      'Convocatoria municipal (Resolución 957 del 16 de octubre de 2026) con tres categorías: capital semilla FEM para mujeres (hasta 50 % de un SMMLV; 22 cupos; bolsa $19.259.955), FODESCA en especie para emprendimientos en marcha y activos productivos para pequeños y medianos productores rurales. Recepción de planes: 27 al 29 de octubre de 2026. Cierre: 29 de octubre de 2026.',
    requirement:
      'Mujer, emprendedor en marcha/microempresa o productor rural con domicilio en Cabuyaro, Meta, según la categoría y los TDR de la Resolución 957.',
    amountLabel: 'Capital semilla FEM (máx.)',
    amountValue: 'Hasta 50% SMMLV',
    amountHint: '22 cupos FEM · cierre 29 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'orinoquia',
    tags: ['Capital semilla', 'Mujeres', 'Cabuyaro', 'Cierra 29 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 29 de octubre',
    keywords: 'cabuyaro meta fem fodesca capital semilla mujeres alcaldia resolucion 957',
    accent: 'yellow',
    closesAt: '2026-10-29',
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
      'Formación financiera presencial (600 cupos) y mentorías (360 cupos) para unidades productivas de víctimas del conflicto en municipios priorizados. Programa gratuito. Cierre de postulaciones: 30 de octubre de 2026, 11:59 p. m. (Adenda 5). Selección semanal hasta agotar cupos.',
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
    requirement: 'MiPymes legalmente constituidas en Colombia que no sean miembro activo de LOGYCA / ASOCIACIÓN.',
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
    entitySub: 'Convocatoria 56 del SGR',
    title: 'Emergencia: recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos de CTeI para adaptar, validar, transferir o escalar tecnologías en departamentos afectados por la emergencia (Decreto 1414 de 2026). Bolsa: $700.000.000.000. Abierta; cierra el 3 de noviembre de 2026 a las 4:00 p. m. Incluye línea de empresas de base científica y tecnológica.',
    requirement:
      'Alianza con al menos una IES, una entidad territorial de departamento afectado y un actor SNCTI, productivo u organización de la sociedad civil, según TDR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['CTeI', 'Emergencia', 'SGR', 'Cierra 3 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 3 de noviembre',
    keywords: 'minciencias 56 emergencia sgr capacidades transformadoras decreto 1414',
    accent: 'black',
    closesAt: '2026-11-03',
    basesUrl:
      'https://www.minciencias.gov.co/convocatorias/convocatoria-emergencia-para-la-recuperacion-y-generacion-capacidades-transformadoras',
  },
  {
    id: 'innpulsa-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad — ONUDI',
    title: 'Formación IATF 16949:2016 para mipymes automotriz',
    summary:
      'Asistencia técnica para implementar un sistema de calidad IATF 16949:2016 en la cadena automotriz y de motopartes (50 horas). Territorios: Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda y Valle del Cauca. Cierre: 4 de noviembre de 2026, 23:59.',
    requirement:
      'MiPymes con al menos un año, 5 trabajadores con contrato laboral, CIIU de la cadena automotriz/motopartes y ubicación en los departamentos listados.',
    amountLabel: 'Beneficio principal',
    amountValue: '50 horas de asistencia IATF',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'IATF 16949', 'Automotriz', 'Cierra 4 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad automotriz motopartes onudi',
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
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Asesoría de banca de inversión para pymes (diagnóstico y estructuración; etapa II opcional de consecución de deuda). Apertura el 24 de abril de 2026; cierra al agotar el presupuesto de Bancóldex. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026. Bancóldex asume el 85 % de la Etapa I.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025 y sin Finbi en los últimos 3 años.',
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
    id: 'prosperidad-inclusion-financiera',
    initials: 'PS',
    entity: 'Prosperidad Social',
    entitySub: 'Banco Agrario y Fondo Nacional de Garantías',
    title: 'Inclusión financiera para la Economía Popular',
    summary:
      'Crédito asociativo de hasta 80 SMMLV ($140.000.000 en 2026) para unidades productivas asociativas, con tasa preferencial, garantía FNG del 90 % sin costo para el solicitante y compensación del 14 % por plan de inversión y buen pago. Inscripción en RIT hasta agotar recursos.',
    requirement:
      'UPA de mínimo tres personas, 61 % población Sisbén A/B/C, víctimas de desplazamiento o comunidades indígenas; documentos de existencia, RUT y cédulas en el formulario RIT.',
    amountLabel: 'Tope del crédito',
    amountValue: 'Hasta 80 SMMLV',
    amountHint: '$140.000.000 en 2026 · hasta agotar recursos',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito asociativo', 'Economía popular', 'FNG', 'Ventanilla activa'],
    urgency: 'continuous',
    urgencyLabel: 'Inscripción hasta agotar recursos',
    keywords: 'prosperidad social inclusion financiera economia popular banco agrario fng',
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
