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

export const RADAR_REVIEWED_AT = '2026-10-23'

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
 * Fichas contrastadas el 2026-10-23 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'minciencias-53-cordoba',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 53 · SGR / ASCTeI',
    title: 'Fortalecimiento de capacidades de CTeI en Córdoba — corte 2',
    summary:
      'Banco de proyectos para reactivación agrícola, social y ambiental en Córdoba, alineado con los retos del plan bienal 2025-2026. Ficha oficial: abierta. Recursos: $28.094.792.444. Cierre: 23 de octubre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con domicilio en Córdoba: al menos una IES del departamento, dos entidades territoriales (una debe ser el Departamento), un actor del sector productivo y una organización de sociedad civil, según TdR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$28.094.792.444 COP',
    amountHint: 'Cierre 23 oct 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'agro',
    region: 'caribe',
    tags: ['SGR', 'Córdoba', 'CTeI', 'Cierra 23 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'minciencias 53 cordoba sgr asctei fortalecimiento capacidades',
    accent: 'black',
    closesAt: '2026-10-23',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/plan-convocatorias-asctei-2025-2026/convocatoria-para-el-fortalecimiento-capacidades-0',
  },
  {
    id: 'rionegro-semillas-bienestar-2026',
    initials: 'RN',
    entity: 'Alcaldía de Rionegro',
    entitySub: 'Secretaría de Desarrollo Económico',
    title: 'Semillas del Bienestar Rionegro 2026',
    summary:
      'Incentivos no reembolsables y acompañamiento para 130 emprendimientos del municipio (bolsa $700 millones). Categorías: Validación ($3 millones), Preincubación ($5.875.000), Incubación ($7 millones) y Turismo sostenible ($3 millones). Inscripciones del 13 al 23 de octubre de 2026.',
    requirement:
      'Persona natural mayor de edad, persona jurídica, mipyme, unidad productiva informal o ESAL con residencia o domicilio mínimo de 12 meses en Rionegro, según TdR y Resolución 0893.',
    amountLabel: 'Incentivo (hasta)',
    amountValue: 'Hasta $7.000.000 COP',
    amountHint: '130 cupos · bolsa $700 millones · cierra 23 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'antioquia',
    tags: ['Capital semilla', 'Rionegro', 'No reembolsable', 'Cierra 23 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'rionegro semillas del bienestar capital semilla nodo 360',
    accent: 'yellow',
    closesAt: '2026-10-23',
    basesUrl:
      'https://rionegro.gov.co/desarrolloeconomico/publicaciones/1169/atencion-a-emprendedores-nodo-360/',
  },
  {
    id: 'atenea-cafam-cohorte-13',
    initials: 'AT',
    entity: 'Agencia ATENEA / CAFAM',
    entitySub: 'Piloto 2600 Campus CTIB',
    title: 'Operación secundaria — Cohorte 1.3 (Cafam)',
    summary:
      'Selecciona 2 emprendimientos de alto impacto, 2 de base científica y tecnológica (modalidades A y C) y 26 mipymes con necesidades de innovación. Estado: Abierta. Cierre de postulación técnica: 28 de octubre de 2026, 4:59 p. m. Financiada por CAFAM (Convenio ATENEA-419-2026) para afiliados a esa caja.',
    requirement:
      'Empresas y emprendimientos en la lista de elegibles, afiliados a la Caja de Compensación Familiar Cafam.',
    amountLabel: 'Cupos de la cohorte',
    amountValue: '30 beneficiarios',
    amountHint: '2 EAI · 2 EBCT · 26 mipymes · cierra 28 oct 2026 16:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'tech',
    region: 'bogota',
    tags: ['CTeI', 'Cafam', 'Bogotá', 'Cierra 28 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 28 de octubre',
    keywords: 'atenea cafam 2600 campus cohorte 1.3 emprendimiento alto impacto',
    accent: 'slate',
    closesAt: '2026-10-28',
    basesUrl: 'https://www.agenciaatenea.gov.co/hema/piloto-2600-campus/convocatoria/op-secundaria-cafam',
  },
  {
    id: 'cabuyaro-resolucion-957-2026',
    initials: 'CB',
    entity: 'Alcaldía de Cabuyaro (Meta)',
    entitySub: 'Resolución 957 de 2026',
    title: 'Capital semilla FEM, FODESCA y agro — Cabuyaro',
    summary:
      'Convocatoria municipal de capital semilla: FEM (22 cupos de $875.452,50), FODESCA (15 cupos de $8 millones) y línea agro (12 cupos de $8 millones). El PDF oficial de la Resolución 957 fija el cierre de recepción el 29 de octubre de 2026.',
    requirement: 'Unidades productivas y emprendimientos del municipio de Cabuyaro que cumplan las líneas FEM, FODESCA o agro de la Resolución 957 de 2026.',
    amountLabel: 'Incentivo por cupo',
    amountValue: 'Hasta $8.000.000 COP',
    amountHint: 'FEM $875.452,50 · cierre recepción 29 oct 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'agro',
    region: 'orinoquia',
    tags: ['Capital semilla', 'Meta', 'Cabuyaro', 'Cierra 29 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 29 de octubre',
    keywords: 'cabuyaro meta resolucion 957 fem fodesca capital semilla',
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
      'Formación financiera presencial y mentorías para unidades productivas de víctimas del conflicto en municipios priorizados. Cierre de postulaciones: 30 de octubre de 2026, 11:59 p. m. Selección semanal hasta agotar cupos. La ficha publica Adendas 1 a 6.',
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
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
  },
  {
    id: 'minciencias-56-emergencia',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 56 · SGR / Decreto 1414 de 2026',
    title: 'Emergencia: recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos elegibles para adaptar, validar, transferir o escalar tecnologías e innovaciones en territorios afectados por la emergencia (Antioquia, Bolívar, Caldas, Caquetá, Cauca, Chocó, Cundinamarca, Huila, Nariño, Norte de Santander, Quindío, Risaralda, Santander, Sucre, Tolima y Valle). Ficha: abierta. Bolsa $700.000.000.000. Cierre: 3 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza mínima: una IES, una entidad territorial de un departamento afectado y un actor del SNCTI con reconocimiento vigente, o del sector productivo, o de la sociedad civil con domicilio en un departamento afectado, según TdR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'sostenibilidad',
    region: 'nacional',
    tags: ['SGR', 'Emergencia', 'CTeI', 'Cierra 3 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 3 de noviembre',
    keywords: 'minciencias 56 emergencia sgr capacidades transformadoras decreto 1414',
    accent: 'black',
    closesAt: '2026-11-03',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-emergencia-para-la-recuperacion-y-generacion-capacidades-transformadoras',
  },
  {
    id: 'innpulsa-calidad-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad · ONUDI',
    title: 'Formación IATF 16949:2016 para mipymes automotrices',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de calidad IATF 16949:2016 en la cadena automotriz y de motopartes. Abierta del 30 de septiembre al 4 de noviembre de 2026, 23:59. Territorios: Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda y Valle del Cauca.',
    requirement:
      'Mipyme (Decreto 957 de 2019) con al menos un año de constitución, 5 trabajadores con contrato laboral, registro mercantil activo y actividad en automotriz/motopartes, sin certificación previa IATF, en los departamentos listados.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF 16949',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'IATF', 'Automotriz', 'Cierra 4 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad mipymes automotriz motopartes onudi',
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
      'Línea de redescuento activa para mujeres microempresarias de actividades no agrícolas, con compensación parcial de capital. Tope por operación: hasta 6 SMMLV. El desembolso se gestiona con establecimientos financieros aliados. Estado publicado: Activa (sin fecha de cierre).',
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
      'Convocatoria de banca de inversión para pymes: estructuración y acompañamiento para operaciones de crecimiento. Cierra al agotar el presupuesto disponible de Bancóldex. La fecha límite para ejecutar la Etapa I (diagnóstico y estructuración; Bancóldex asume el 85%) es el 30 de noviembre de 2026.',
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
    id: 'prosperidad-inclusion-financiera',
    initials: 'PS',
    entity: 'Prosperidad Social',
    entitySub: 'Economía popular para el cambio',
    title: 'Inclusión Financiera para la Economía Popular',
    summary:
      'Crédito asociativo de hasta 80 SMMLV ($140.000.000 en 2026), compensación del 14% del desembolso, educación financiera y garantía FNG del 90% sin costo. La ficha oficial mantiene el formulario RIT abierto de manera permanente hasta agotar recursos.',
    requirement:
      'Unidad productiva asociativa de mínimo tres personas, con al menos 61% de población priorizada (Sisbén IV A01–A05, B01–B07 o C01–C18, RUV o comunidades indígenas).',
    amountLabel: 'Tope del crédito',
    amountValue: 'Hasta 80 SMMLV',
    amountHint: '$140.000.000 en 2026 · hasta agotar recursos',
    funding: 'cofinanciacion',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Economía popular', 'Crédito asociativo', 'FNG', 'Hasta agotar recursos'],
    urgency: 'continuous',
    urgencyLabel: 'Inscripción hasta agotar recursos',
    keywords: 'prosperidad social inclusion financiera economia popular rit upa',
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
