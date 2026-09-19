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
}

export const RADAR_REVIEWED_AT = '2026-09-19'

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
 * Fichas contrastadas el 2026-09-19 en listados públicos (sin login).
 * Si un portal no respondió, se conservó el último enlace oficial válido.
 * No se inventaron convocatorias. Apps.co devolvió error 500; se conserva su ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'innpulsa-cfp-popayan-c4',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Centros de Fortalecimiento Productivo',
    title: 'CFP Manufactura Popayán — Cohorte 4',
    summary:
      'iNNpulsa busca vincular 60 MiPymes o unidades productivas de confección de prendas de vestir en el Cauca. Fortalecimiento productivo presencial en el centro CFP/ZASCA de Popayán.',
    requirement: 'MiPymes o unidades productivas de manufactura-confección ubicadas en el Cauca.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento productivo CFP',
    amountHint: '60 cupos · listado público iNNpulsa',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Manufactura', 'Cauca', 'Cierra 24 sep 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 24 de septiembre',
    keywords: 'innpulsa mincit zasca popayan manufactura confeccion cauca',
    accent: 'yellow',
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
      'Convocatoria abierta para vincular 40 MiPymes o unidades productivas de agroindustria de cacao en Tumaco, Nariño, al Centro de Fortalecimiento Productivo.',
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
      'Formación financiera presencial y mentorías para unidades productivas de víctimas del conflicto en municipios priorizados. El cierre de esta convocatoria de fortalecimiento es el 30 de septiembre de 2026 (Adenda 4). La línea de crédito asociada se tramita por intermediarios financieros.',
    requirement:
      'Unidad productiva domiciliada y en operación en un municipio priorizado, con condición de víctima verificable.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Cierre 30 sep 2026 · 11:59 p. m.',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Crédito blando aparte', 'Víctimas', 'Territorios priorizados'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de septiembre',
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria',
    accent: 'black',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/transformacion-financiera-territorios-de-paz',
  },
  {
    id: 'minciencias-salud-desastre-001-2026',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 001-2026',
    title: 'CTeI para desafíos en salud derivados de la situación de desastre',
    summary:
      'Convocatoria abierta de I+D+i en salud (salud mental, brotes, ENT/cáncer y salud ambiental). Bolsa publicada: $109.000 millones. Pueden postular personas jurídicas colombianas —incluidas empresas— solas, en alianza o con cooperantes. Cierra el 13 de octubre de 2026 a las 5:00 p. m.',
    requirement:
      'Entidad ejecutora domiciliada en Colombia (IES, empresa u otro actor del SNCTI). Centros e institutos con reconocimiento vigente de MinCiencias cuando aplique.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$109.000.000.000 COP',
    amountHint: 'Cierre 13 oct 2026 · 5:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'salud',
    region: 'nacional',
    tags: ['Cofinanciación', 'Salud', 'I+D+i', 'Cierra 13 oct 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 13 de octubre',
    keywords: 'minciencias 001 2026 cte i salud desastre sismo cofinanciacion',
    accent: 'black',
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
      'Postulación presencial para vincular 275 unidades productivas o MiPymes de cualquier sector en Casanare, en el ZASCA Tecnologías de la Cámara de Comercio de Casanare (Yopal). El listado público marca cierre el 16 de octubre de 2026.',
    requirement: 'Unidad productiva o MiPymes ubicada en Casanare. Postulación presencial en Yopal.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '275 cupos · postulación presencial',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'orinoquia',
    tags: ['ZASCA', 'Casanare', 'Yopal', 'Cierra 16 oct 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 16 de octubre',
    keywords: 'innpulsa zasca casanare yopal tecnologias cfp',
    accent: 'yellow',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69dd1274c108508aebd0c608',
  },
  {
    id: 'innpulsa-logyca-gs1',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Alianza LOGYCA / GS1',
    title: 'Servicios complementarios logísticos, de colaboración y códigos de barras',
    summary:
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para que empresarios y emprendedores mejoren identificación, colaboración y logística. Listada como abierta hasta el 31 de octubre de 2026.',
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
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
  },
  {
    id: 'innpulsa-cfp-honda',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Honda, norte del Tolima y Guaduas',
    summary:
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Honda, municipios del norte del Tolima y Guaduas. El listado público marca cierre el 30 de noviembre de 2026.',
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
      'Postulación presencial para vincular 300 unidades productivas o MiPymes de cualquier sector en los municipios de Norte de Santander. El listado público de iNNpulsa marca cierre el 2 de diciembre de 2026.',
    requirement: 'Unidad productiva o MiPymes ubicada en Norte de Santander. Postulación presencial.',
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
    keywords: 'innpulsa zasca cucuta norte de santander tecnologias cfp',
    accent: 'slate',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69f3d045a338026cc9d9e0f2',
  },
  {
    id: 'ruta-emprendimiento-medellin-2026',
    initials: 'RN',
    entity: 'Ruta del Emprendimiento / Alcaldía de Medellín',
    entitySub: 'Distrito de CTeI de Medellín',
    title: 'Ruta del Emprendimiento 2026',
    summary:
      'Convocatoria abierta permanente hasta agotar 700 cupos: acompañamiento en ideación, preincubación, incubación, aceleración y consolidación para iniciativas de base tecnológica en Medellín. La Alcaldía anunció 60 incentivos de capital semilla en especie (hasta $15 millones) para preincubación e incubación.',
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
    id: 'ccb-ruta-bogota-cundinamarca-emprende',
    initials: 'CCB',
    entity: 'Cámara de Comercio de Bogotá',
    entitySub: 'Ruta Bogotá Cundinamarca Emprende',
    title: 'Ruta Ágil de Emprendimiento (RAE)',
    summary:
      'Acompañamiento gratuito (virtual) para estructurar ideas de negocio: talleres, asesoría grupal y consultor. La CCB publica la convocatoria habilitada de manera permanente, con nuevas rutas cada mes hasta noviembre de 2026.',
    requirement:
      'Persona emprendedora con idea o negocio en etapa temprana, según los términos de cada intervención de la Ruta (RAE, Emprendelab o Genera Tracción).',
    amountLabel: 'Beneficio principal',
    amountValue: 'Acompañamiento gratuito CCB',
    amountHint: 'Rutas mensuales hasta noviembre 2026',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'multi',
    region: 'bogota',
    tags: ['Incubación', 'Bogotá', 'Cundinamarca', 'Permanente'],
    urgency: 'continuous',
    urgencyLabel: 'Convocatoria permanente',
    keywords: 'ccb camara comercio bogota ruta emprende rae emprendelab',
    accent: 'yellow',
    basesUrl:
      'https://www.ccb.org.co/es/servicios/crea-tu-empresa/preparate-para-crear-tu-empresa/ruta-emprender',
  },
  {
    id: 'fiveonelabs-ignite-2026',
    initials: '51',
    entity: 'Five One Labs',
    entitySub: 'Preincubación IGNITE — Barranquilla',
    title: 'Preincubación IGNITE 2026',
    summary:
      'Programa presencial y gratuito en Barranquilla: factibilidad, pitch e innovación aplicada. Five One Labs anuncia tres cohortes en 2026 con selección continua. Un fundador por negocio; no pueden postular quienes ya cursaron Ignite, Incubación o FEM 2023-2025.',
    requirement:
      'Emprendedor o emprendedora con una idea de nuevo producto o expansión de mercado, disponible para sesiones presenciales en Barranquilla.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Preincubación presencial gratuita',
    amountHint: '3 cohortes 2026 · selección continua',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'multi',
    region: 'caribe',
    tags: ['Preincubación', 'Barranquilla', 'Gratuito', 'Selección continua'],
    urgency: 'continuous',
    urgencyLabel: 'Selección continua en 2026',
    keywords: 'five one labs ignite barranquilla preincubacion caribe',
    accent: 'slate',
    basesUrl: 'https://fiveonelabs.org/ignite-2026',
  },
  {
    id: 'fondo-mujer-a-pulso',
    initials: 'FM',
    entity: 'Fondo Mujer Libre y Productiva',
    entitySub: 'Convenio Bancóldex / Grupo Bicentenario',
    title: 'Línea de crédito A PULSO',
    summary:
      'Línea de redescuento para mujeres microempresarias de actividades no agrícolas, con posible compensación parcial de capital. La ficha pública del Fondo Mujer permanece publicada; el desembolso se gestiona con establecimientos financieros aliados.',
    requirement:
      'Mujer con micronegocio; SISBEN IV A, B o C o ingresos anuales inferiores a 50 SMMLV; destinar el crédito al micronegocio.',
    amountLabel: 'Tope publicado',
    amountValue: 'Hasta 6 SMMLV',
    amountHint: 'Más alivio a capital en operaciones de hasta 2 SMMLV',
    funding: 'cofinanciacion',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Crédito blando', 'Mujeres', 'Microempresa', 'Ventanilla financiera'],
    urgency: 'continuous',
    urgencyLabel: 'Línea publicada',
    keywords: 'fondo mujer a pulso bancoldex credito microempresarias',
    accent: 'black',
    basesUrl: 'https://fondomujer.gov.co/portfolio/linea-de-credito-creo-un-credito-para-conocernos/',
  },
  {
    id: 'sena-fondo-emprender',
    initials: 'S',
    entity: 'SENA — Fondo Emprender',
    entitySub: 'Gobierno de Colombia',
    title: 'Convocatoria nacional No. 153 Multisectorial',
    summary:
      'Términos oficiales 2026: financiar creación o fortalecimiento de iniciativas en todos los sectores, individual o asociativa. Presupuesto de la convocatoria: $18.000 millones. Cerró el 6 de abril de 2026. El listado de vigentes aún muestra la 165 Guatapé, pero su ficha oficial indica cierre el 6 de julio de 2026. Se conserva el PDF de la 153 como último TDR nacional válido.',
    requirement: 'Plan de negocio o de inversión según modalidad CREACIÓN o FORTALECIMIENTO, vía plataforma Fondo Emprender.',
    amountLabel: 'Tope por plan (TDR)',
    amountValue: 'Hasta 500 SMMLV',
    amountHint: 'Bolsa $18.000 M · cerró 6 abr 2026',
    funding: 'capital',
    stage: 'temprana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital no reembolsable', 'Cerrada', 'Multisectorial', 'Nacional'],
    urgency: 'closed',
    urgencyLabel: 'Cerrada el 6 de abril',
    keywords: 'sena fondo emprender 153 multisectorial semilla',
    accent: 'black',
    basesUrl:
      'https://www.sena.edu.co/es-co/trabajo/FONDOEMPRENDER1/2026/MARZO/Convocatoria%20No%20153_Multisectorial.pdf',
  },
  {
    id: 'minciencias-cofinancia',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 976',
    title: 'ColombIA Inteligente 2026',
    summary:
      'Cofinanciación de I+D+i en inteligencia artificial y tecnologías cuánticas. Alianza mínima: IES (ejecutora) + empresa nacional + organización local-regional. Bolsa publicada: $24.000 millones. Cerró el 13 de abril de 2026; se conserva la ficha oficial.',
    requirement: 'Alianza IES + empresa nacional + organización local-regional, con domicilio regional según TDR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$24.000.000.000 COP',
    amountHint: 'Cerró 13 abr 2026',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'tech',
    region: 'nacional',
    tags: ['Cofinanciación', 'IA', 'Cerrada', 'Alianzas'],
    urgency: 'closed',
    urgencyLabel: 'Cerrada el 13 de abril',
    keywords: 'minciencias 976 colombia inteligente ia cuantica',
    accent: 'black',
    basesUrl: 'https://minciencias.gov.co/convocatorias/convocatoria-colombia-inteligente-2026',
  },
  {
    id: 'appsco-mintic',
    initials: 'AP',
    entity: 'Apps.co / MinTIC / iNNpulsa',
    entitySub: 'Emprendimiento Digital 2026',
    title: 'Emprendimiento Digital 2026 — Modelo de negocio',
    summary:
      'Ruta oficial MinTIC–MinCIT–iNNpulsa para 110 empresas digitales con producto validado: 26 horas de asistencia y toolkit de hasta $2.000.000 COP para la mitad de los beneficiarios. El listado iNNpulsa la marca cerrada (plazo público de postulación: 22 de mayo de 2026). El portal apps.co no respondió (HTTP 500) en esta pasada; no hay otra convocatoria 2026 distinta verificable.',
    requirement:
      'Empresa legalmente constituida, producto digital propio validado y ventas ≥ $1.000.000 COP en el último año.',
    amountLabel: 'Toolkit (50% de cupos)',
    amountValue: 'Hasta $2.000.000 COP',
    amountHint: '110 cupos · convocatoria cerrada',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'tech',
    region: 'nacional',
    tags: ['Aceleración digital', 'MinTIC', 'Cerrada', 'Producto digital'],
    urgency: 'closed',
    urgencyLabel: 'Cerrada el 22 de mayo',
    keywords: 'apps.co mintic emprendimiento digital modelo de negocio innulsa',
    accent: 'yellow',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69d9786a6191167cbf5a8b99',
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
