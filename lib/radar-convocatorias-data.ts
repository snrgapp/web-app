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

export const RADAR_REVIEWED_AT = '2026-09-22'

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
 * Fichas contrastadas el 2026-09-22 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'innpulsa-cfp-popayan-c4',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Centros de Fortalecimiento Productivo',
    title: 'CFP Manufactura Popayán — Cohorte 4',
    summary:
      'iNNpulsa busca vincular 60 MiPymes o unidades productivas de confección de prendas de vestir en el Cauca al centro CFP/ZASCA de Popayán. El listado público la marca abierta hasta el 24 de septiembre de 2026 (12:00).',
    requirement: 'MiPymes o unidades productivas de manufactura-confección ubicadas en el Cauca.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento productivo CFP',
    amountHint: '60 cupos · cierre 24 sep 2026 · 12:00',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Manufactura', 'Cauca', 'Cierra 24 sep 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 24 de septiembre',
    keywords: 'innpulsa mincit zasca popayan manufactura confeccion cauca',
    accent: 'yellow',
    closesAt: '2026-09-24',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/centros-de-fortalecimiento-productivo-popayan-cohorte-4-66uzna',
  },
  {
    id: 'innpulsa-cfp-tumaco-cacao-c4',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Centros de Fortalecimiento Productivo',
    title: 'CFP Agroindustria Tumaco Cacao — Cohorte 4',
    summary:
      'Convocatoria abierta para vincular 40 MiPymes o unidades productivas de agroindustria de cacao en Tumaco, Nariño. Cierre publicado: 30 de septiembre de 2026.',
    requirement: 'Unidad productiva o MiPymes de cacao con operación en Tumaco, Nariño.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Acompañamiento CFP cacao',
    amountHint: '40 cupos · cierre 30 sep 2026',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'agro',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Agroindustria', 'Tumaco', 'Cacao'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de septiembre',
    keywords: 'innpulsa tumaco cacao agroindustria nariño zasca',
    accent: 'yellow',
    closesAt: '2026-09-30',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/centros-de-fortalecimiento-productivo-agroindustria-tumaco-cacao-cohorte-4-6atp9q',
  },
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial y mentorías para unidades productivas de víctimas del conflicto en municipios priorizados. Cierre de postulaciones: 30 de septiembre de 2026, 11:59 p. m. (Adenda 4). Cupos limitados, selección semanal.',
    requirement:
      'Unidad productiva domiciliada y en operación en un municipio priorizado, con condición de víctima verificable.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Cierre 30 sep 2026 · 11:59 p. m.',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Víctimas', 'Territorios priorizados', 'Gratuito'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de septiembre',
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria',
    accent: 'black',
    closesAt: '2026-09-30',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/transformacion-financiera-territorios-de-paz',
  },
  {
    id: 'innpulsa-calidad-iso',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad',
    title: 'Formación ISO 22716 e ISO 13485 para mipymes',
    summary:
      'Formación y asistencia técnica en estándares de calidad para mipymes de salud, cosméticos y aseo en los 32 departamentos. El listado iNNpulsa la marca abierta hasta el 5 de octubre de 2026 (23:59).',
    requirement: 'Mipymes de salud, cosméticos o aseo ubicadas en Colombia.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica ISO',
    amountHint: 'Cierre 5 oct 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'salud',
    region: 'nacional',
    tags: ['Calidad', 'ISO', 'Salud', 'Cosméticos'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 5 de octubre',
    keywords: 'innpulsa iso 22716 13485 calidad mipymes salud cosmeticos',
    accent: 'yellow',
    closesAt: '2026-10-05',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/formacion-y-asistencia-tecnica-en-calidad-para-mipymes-estandares-iso-22716-e-is-ktf9hw',
  },
  {
    id: 'innpulsa-cfp-caqueta-c2',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Caquetá — Cohorte 2',
    summary:
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Florencia, Caquetá. Cierre publicado: 10 de octubre de 2026.',
    requirement: 'Unidad productiva o MiPymes ubicada en Florencia, Caquetá.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '200 cupos · postulación presencial',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'orinoquia',
    tags: ['ZASCA', 'Caquetá', 'Florencia', 'Cierra 10 oct 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 10 de octubre',
    keywords: 'innpulsa zasca caqueta florencia tecnologias cohorte 2',
    accent: 'slate',
    closesAt: '2026-10-10',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69efa85c8424b649dec9fb15',
  },
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
    urgency: 'open',
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
    urgency: 'open',
    urgencyLabel: 'Cierra el 16 de octubre',
    keywords: 'innpulsa zasca casanare yopal tecnologias cohorte 2',
    accent: 'slate',
    closesAt: '2026-10-16',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69dd1274c108508aebd0c608',
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
    urgency: 'open',
    urgencyLabel: 'Cierra el 31 de octubre',
    keywords: 'innpulsa logyca gs1 codigos de barras mincit',
    accent: 'yellow',
    closesAt: '2026-10-31',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
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
    id: 'finagro-lec-2026',
    initials: 'FG',
    entity: 'Finagro',
    entitySub: 'Líneas Especiales de Crédito',
    title: 'LEC Finagro 2026',
    summary:
      'Líneas Especiales de Crédito 2026 con tasa subsidiada para productores y empresas del sector agropecuario, acuícola y rural. La ficha y la Circular Externa 25 de 2026 están publicadas en el portal de Finagro.',
    requirement: 'Actividad agropecuaria, acuícola o rural elegible ante Finagro, vía intermediario financiero.',
    amountLabel: 'Instrumento',
    amountValue: 'Crédito de fomento LEC',
    amountHint: 'Circular Externa 25 de 2026',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'agro',
    region: 'nacional',
    tags: ['Agroindustria', 'LEC', 'Crédito de fomento', '2026'],
    urgency: 'continuous',
    urgencyLabel: 'Línea 2026 publicada',
    keywords: 'finagro lec 2026 credito agro rural circular 25',
    accent: 'yellow',
    basesUrl: 'https://www.finagro.com.co/lineas-especiales-credito-lec-finagro-2026',
  },
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Convocatoria de banca de inversión para pymes: estructuración y acompañamiento para operaciones de crecimiento. Apertura el 24 de abril de 2026; cierra al agotar el presupuesto disponible de Bancóldex.',
    requirement: 'Empresa pyme que complete el formulario de postulación y ranking de indicadores financieros.',
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
