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

export const RADAR_REVIEWED_AT = '2026-10-26'

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
 * Fichas contrastadas el 2026-10-26 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'atenea-cafam-cohorte-1-3',
    initials: 'AT',
    entity: 'Agencia ATENEA / CAFAM',
    entitySub: '2600 Campus CTIB · Operación secundaria',
    title: 'Operación secundaria Cohorte 1.3 (CAFAM)',
    summary:
      'Selecciona 2 emprendimientos de alto impacto, 2 de base científica y tecnológica (modalidades A y C) y 26 mipymes con necesidades de innovación, afiliados a CAFAM, para implementar el programa 2600 Campus CTIB. Estado: Abierta. Cierre de la postulación técnica: 28 de octubre de 2026, 4:59 p. m. (Adenda 1).',
    requirement:
      'Empresas y emprendimientos de la lista de elegibles, afiliados a la Caja de Compensación Familiar CAFAM.',
    amountLabel: 'Cupos de la cohorte',
    amountValue: 'Hasta 30 beneficiarios CAFAM',
    amountHint: 'Cierre 28 oct 2026 · 4:59 p. m.',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'bogota',
    tags: ['Aceleración', 'CAFAM', 'Bogotá', 'Cierra 28 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 28 de octubre',
    keywords: 'atenea cafam 2600 campus ctib cohorte 1.3 emprendimiento mipyme',
    accent: 'yellow',
    closesAt: '2026-10-28',
    basesUrl: 'https://www.agenciaatenea.gov.co/hema/piloto-2600-campus/convocatoria/op-secundaria-cafam',
  },
  {
    id: 'cabuyaro-resolucion-957-2026',
    initials: 'CB',
    entity: 'Alcaldía de Cabuyaro (Meta)',
    entitySub: 'Resolución 957 de 2026 · FEM / FODESCA / agro',
    title: 'Capital semilla FEM, FODESCA y fortalecimiento agropecuario',
    summary:
      'Tres categorías municipales: FEM (22 cupos de $875.452,50 para mujeres rurales y urbanas), FODESCA (15 cupos de $8.000.000 para emprendedores en marcha y microempresas) y fortalecimiento agropecuario (12 cupos de $8.000.000). El cronograma del TDR cierra la recepción de planes de negocio el 29 de octubre de 2026.',
    requirement:
      'Mujeres elegibles FEM, emprendedores o microempresas en marcha (FODESCA) o pequeños y medianos productores rurales del municipio de Cabuyaro, Meta.',
    amountLabel: 'Tope por categoría',
    amountValue: 'Hasta $8.000.000 COP',
    amountHint: 'FEM $875.452,50 · cierre recepción 29 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'agro',
    region: 'orinoquia',
    tags: ['Capital semilla', 'Cabuyaro', 'Mujeres', 'Cierra 29 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 29 de octubre',
    keywords: 'cabuyaro meta fem fodesca capital semilla resolucion 957 2026',
    accent: 'slate',
    closesAt: '2026-10-29',
    basesUrl:
      'https://cabuyarometa.micolombiadigital.gov.co/sites/cabuyarometa/content/files/001712/85551_resolucion-957-de-convocatoria--2026.pdf',
  },
  {
    id: 'innpulsa-logyca-gs1',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Alianza LOGYCA / GS1',
    title: 'Servicios complementarios logísticos, de colaboración y códigos de barras',
    summary:
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para identificación, colaboración y logística. Abierta hasta el 31 de octubre de 2026.',
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
    id: 'huila-sembremos-progreso-2026',
    initials: 'HU',
    entity: 'Gobernación del Huila / INFIHUILA',
    entitySub: 'Convocatoria pública 001 de 2026',
    title: 'Sembremos Progreso por un Huila Grande, Productivo y en Paz',
    summary:
      'Capital semilla en especie para poblaciones priorizadas de los 37 municipios del Huila: hasta $6.000.000 para crear unidades productivas y hasta $4.000.000 para fortalecer negocios existentes, más asistencia técnica. Cierre: 2 de noviembre de 2026, 5:00 p. m., o al completar 300 postulaciones.',
    requirement:
      'Colombiano mayor de edad, residente en el Huila, de población priorizada (reincorporación, jóvenes 18-28, discapacidad, LGBTIQ+ o líderes comunales víctimas) con unidad productiva o propuesta de creación.',
    amountLabel: 'Capital semilla (especie)',
    amountValue: 'Hasta $6.000.000 COP',
    amountHint: 'Fortalecimiento hasta $4.000.000 · cierre 2 nov 2026 5:00 p. m.',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'Huila', 'Inclusión', 'Cierra 2 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 2 de noviembre',
    keywords: 'huila sembremos progreso infihuila capital semilla paz inclusion',
    accent: 'yellow',
    closesAt: '2026-11-02',
    basesUrl:
      'https://www.huila.gov.co/gobierno-y-desarrollo-comunitario/publicaciones/17383/convocatoria-publica-sembremos-progreso-por-un-huila-grande-productivo-y-en-paz-2026/',
  },
  {
    id: 'innpulsa-calidad-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad · ONUDI',
    title: 'Formación IATF 16949:2016 para mipymes automotrices',
    summary:
      'Asistencia técnica de 50 horas para implementar un sistema de gestión de calidad IATF 16949:2016 en la cadena automotriz y de motopartes. Abierta del 30 de septiembre al 4 de noviembre de 2026, 23:59. Territorios: Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda y Valle del Cauca.',
    requirement:
      'Mipyme (Decreto 957 de 2019) con al menos un año de constitución, 5 trabajadores, registro mercantil activo y actividad de la cadena automotriz o de motopartes en los departamentos habilitados.',
    amountLabel: 'Beneficio principal',
    amountValue: '50 horas de asistencia técnica',
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
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial (600 cupos) y mentorías individuales (360 cupos) para unidades productivas de víctimas del conflicto en municipios PDET. La Adenda 6 (19 oct 2026) amplió el cierre de postulaciones al 15 de noviembre de 2026, 11:59 p. m. Selección semanal hasta agotar cupos.',
    requirement:
      'Unidad productiva de población víctima, domiciliada y en operación en un municipio priorizado, con compromiso de asistencia presencial.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Cierre 15 nov 2026 · 11:59 p. m. · Adenda 6',
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
      'Banca de inversión para pymes: diagnóstico, estructuración financiera y acompañamiento para consecución de deuda. Apertura el 24 de abril de 2026; cierra al agotar el presupuesto de Bancóldex. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026. Bancóldex asume el 85% de la Etapa I.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025 y sin haber tomado Finbi en los últimos 3 años.',
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
    title: 'Inclusión Financiera para la Economía Popular',
    summary:
      'Crédito preferencial de hasta 80 SMMLV ($140.000.000 en 2026) para unidades productivas asociativas, con compensación del 14% del capital por buen pago y garantía FNG del 90% sin costo. La ficha oficial mantiene la inscripción abierta hasta agotar recursos.',
    requirement:
      'Unidad productiva asociativa de mínimo 3 personas, con el 61% de población objetivo de Prosperidad Social (Sisbén IV A01-A05, B01-B07 o C01-C18, víctimas de desplazamiento o comunidades indígenas).',
    amountLabel: 'Tope del crédito',
    amountValue: 'Hasta $140.000.000 COP',
    amountHint: 'Hasta 80 SMMLV · inscripción hasta agotar recursos',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Economía popular', 'Garantía FNG', 'Hasta agotar recursos'],
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
