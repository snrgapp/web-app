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

export const RADAR_REVIEWED_AT = '2026-10-11'

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
 * Fichas contrastadas el 2026-10-11 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'minciencias-001-2026',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 001-2026',
    title: 'CTeI para desafíos en salud derivados de desastre',
    summary:
      'Cofinanciación de I+D+i en salud mental, enfermedades transmisibles y no transmisibles, y salud ambiental en contextos de desastre. Bolsa publicada: $109.000 millones. Cierre: 13 de octubre de 2026, 5:00 p. m.',
    requirement:
      'Entidad ejecutora domiciliada en Colombia (IES, centros, empresas y demás actores del SNCTI según TDR).',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$109.000.000.000 COP',
    amountHint: 'Cierre 13 oct 2026 · 5:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'salud',
    region: 'nacional',
    tags: ['Cofinanciación', 'Salud', 'CTeI', 'Cierra 13 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de octubre',
    keywords: 'minciencias 001-2026 ctei salud desastre soberania sanitaria',
    accent: 'black',
    closesAt: '2026-10-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-ctei-para-la-atencion-desafios-en-salud-derivados-la-situacion-desastre',
  },
  {
    id: 'innpulsa-cfp-casanare-c2',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Casanare — Cohorte 2',
    summary:
      'Postulación presencial para vincular 275 unidades productivas o MiPymes de cualquier sector en Casanare, en el ZASCA de la Cámara de Comercio de Casanare (Yopal). Cierre publicado: 16 de octubre de 2026.',
    requirement: 'Unidad productiva o MiPymes con operación en Casanare.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '275 cupos · postulación presencial en Yopal',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'orinoquia',
    tags: ['ZASCA', 'Casanare', 'Yopal', 'Cierra 16 oct 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 16 de octubre',
    keywords: 'innpulsa zasca casanare yopal tecnologias cohorte 2',
    accent: 'slate',
    closesAt: '2026-10-16',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69dd1274c108508aebd0c608',
  },
  {
    id: 'minciencias-53-cordoba',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 53 SGR — Corte 2',
    title: 'Fortalecimiento de capacidades CTeI en Córdoba',
    summary:
      'Corte 2 de la convocatoria SGR para proyectos de reactivación agrícola, social y ambiental en Córdoba. Bolsa publicada: $28.094.792.444. Cierre: 23 de octubre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con IES domiciliada en Córdoba, dos entidades territoriales (una el Departamento), un actor productivo y una organización de sociedad civil en Córdoba.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$28.094.792.444 COP',
    amountHint: 'Cierre 23 oct 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'caribe',
    tags: ['SGR', 'Córdoba', 'CTeI', 'Cierra 23 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 23 de octubre',
    keywords: 'minciencias 53 cordoba sgr capacidades ctei corte 2',
    accent: 'black',
    closesAt: '2026-10-23',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/plan-convocatorias-asctei-2025-2026/convocatoria-para-el-fortalecimiento-capacidades-0',
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
    entitySub: 'Convocatoria 56 SGR',
    title: 'Emergencia: recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos CTeI con recursos SGR para adaptar, validar, transferir o escalar soluciones en territorios afectados por la emergencia. Bolsa publicada: $700.000 millones. Cierre: 3 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza con al menos una IES, una entidad territorial de departamento afectado y un actor SNCTI, del sector productivo o de la sociedad civil en el territorio.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['SGR', 'Emergencia', 'CTeI', 'Cierra 3 nov 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 3 de noviembre',
    keywords: 'minciencias 56 emergencia sgr recuperacion capacidades transformadoras',
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
    title: 'Formación IATF 16949:2016 para mipymes automotrices',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de calidad IATF 16949:2016 en la cadena automotriz y de motopartes. El listado iNNpulsa la marca abierta hasta el 4 de noviembre de 2026 (23:59).',
    requirement:
      'Mipyme con al menos un año, 5 trabajadores y registro mercantil, en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca, del sector automotriz o de motopartes.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'IATF 16949', 'Automotriz', 'Cierra 4 nov 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad automotriz motopartes mipymes',
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
      'Asesoría de banca de inversión para pymes: diagnóstico, estructuración y acompañamiento para consecución de recursos. Abierta el 24 de abril de 2026; cierra al agotar el presupuesto. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025 y sin haber usado Finbi en los últimos 3 años.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Banca de inversión pyme',
    amountHint: 'Hasta agotar presupuesto Bancóldex',
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
