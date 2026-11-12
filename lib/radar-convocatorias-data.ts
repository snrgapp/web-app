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

export const RADAR_REVIEWED_AT = '2026-11-12'

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
 * Fichas contrastadas el 2026-11-12 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'minciencias-054-2026',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 54 · SGR CTeI',
    title: 'Proyectos regionales para fortalecer capacidades científico-tecnológicas',
    summary:
      'Banco de proyectos elegibles de alcance regional con $927.591.817.322 del SGR, repartidos entre las seis regiones. Cada proyecto debe ejecutarse en al menos dos departamentos de una misma región y puede solicitar hasta $17.177.626.246. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza de al menos una IES, otra entidad del SNCTI, una entidad territorial y un actor usuario o adoptante de los resultados, según los TDR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$927.591.817.322 COP',
    amountHint: 'Hasta $17.177.626.246 por proyecto · cierre 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['SGR', 'CTeI', 'Alianzas', 'Cierra 13 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias convocatoria 54 sgr capacidades cientifico tecnologicas regalías',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://www.minciencias.gov.co/convocatorias/convocatoria-54-convocatoria-especial-para-la-financiacion-proyectos-para-el',
  },
  {
    id: 'minciencias-055-2026',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 55 · SGR CTeI',
    title: 'Macroproyectos nacionales para capacidades científico-tecnológicas',
    summary:
      'Listado de hasta diez macroproyectos nacionales elegibles con $500.000 millones del SGR. Cada uno puede financiar hasta $50.000 millones e interviene al menos dos regiones. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianza de mínimo tres personas jurídicas nacionales: proponente con reconocimiento o trayectoria SNCTI e integrantes que incluyan entidad territorial, empresa u organización social.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$500.000.000.000 COP',
    amountHint: 'Hasta $50.000 millones por macroproyecto · cierre 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['SGR', 'Macroproyectos', 'CTeI', 'Cierra 13 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias convocatoria 55 macroproyectos sgr capacidades cientifico tecnologicas',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-especial-para-la-financiacion-macroproyectos-nacionales-para-el',
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
    urgency: 'soon',
    urgencyLabel: 'Cierra el 2 de diciembre',
    keywords: 'innpulsa zasca norte de santander cucuta tecnologias cohorte 2',
    accent: 'slate',
    closesAt: '2026-12-02',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69f3d045a338026cc9d9e0f2',
  },
  {
    id: 'fondo-emprender-168',
    initials: 'FE',
    entity: 'Fondo Emprender (SENA)',
    entitySub: 'Convocatoria focalizada 168 · Volver a Crecer',
    title: 'Volver a Crecer — capital semilla para territorios afectados',
    summary:
      'Capital semilla para fortalecer negocios formales de Caldas, Chocó, Quindío, Risaralda, Valle del Cauca y Tolima afectados por el terremoto del 10 de agosto de 2026 o por incendios forestales. Bolsa: $34.140.799.482. Cierre: 30 de diciembre de 2026, 6:00 p. m.',
    requirement:
      'Iniciativa o unidad productiva formalmente constituida en esos departamentos, con afectación acreditada y postulada en modalidad individual o asociativa.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$34.140.799.482 COP',
    amountHint: 'Cierre 30 dic 2026 · 6:00 p. m.',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'SENA', 'Recuperación', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'fondo emprender 168 volver a crecer sena caldas choco quindio risaralda valle tolima',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1682026.aspx',
  },
  {
    id: 'finagro-lec-nino-2026',
    initials: 'FG',
    entity: 'Finagro',
    entitySub: 'LEC Desarrollo Productivo · Fenómeno del Niño',
    title: 'LEC Fenómeno del Niño 2026',
    summary:
      'La Circular Externa 128 de 2026 abre el subsidio a la tasa para créditos de redescuento en riego, drenaje, manejo del agua e infraestructura hídrica. Operaciones desde el 5 de noviembre hasta el 30 de diciembre de 2026 o hasta agotar recursos.',
    requirement:
      'Productor agropecuario, acuícola o de pesca que acceda vía intermediario financiero, con destino elegible de los 12 códigos publicados en la circular.',
    amountLabel: 'Instrumento',
    amountValue: 'Crédito LEC con subsidio a la tasa',
    amountHint: 'Circular Externa 128 de 2026 · hasta 30 dic 2026',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'agro',
    region: 'nacional',
    tags: ['Agroindustria', 'LEC', 'Fenómeno del Niño', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'finagro lec fenomeno del nino 2026 riego drenaje circular 128',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl: 'https://www.finagro.com.co/sites/default/files/2026-10/Circular%20Externa%20No.%20128%20de%202026.pdf',
  },
  {
    id: 'bancoldex-gobierno-corporativo',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Fortalecimiento empresarial',
    title: 'Gobierno corporativo para crear valor',
    summary:
      'Formación ejecutiva virtual gratuita de 16 horas (ocho sesiones) y un toolkit de siete herramientas. 80 cupos para empresas colombianas. Inscripciones abiertas desde el 23 de septiembre de 2026 hasta el 8 de enero de 2027.',
    requirement:
      'Empresa colombiana legalmente constituida, de cualquier tamaño y macrosector. Quien se inscribe debe ser representante legal o empleado de la empresa.',
    amountLabel: 'Beneficio principal',
    amountValue: '16 horas + toolkit (80 cupos)',
    amountHint: 'Gratuito · cierre 8 ene 2027',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Formación', 'Gobierno corporativo', 'Gratuito', 'Cierra 8 ene 2027'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 8 de enero de 2027',
    keywords: 'bancoldex gobierno corporativo crear valor formacion eafit',
    accent: 'black',
    closesAt: '2027-01-08',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/gobierno-corporativo-para-crear-valor',
  },
  {
    id: 'bancoldex-finbi-2026',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'Banca de inversión para pymes',
    title: 'Finbi 2026',
    summary:
      'Asesoría financiera para pymes en diagnóstico, estructuración y consecución de recursos. La ficha oficial mantiene el cierre hasta agotar el presupuesto de Bancóldex. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026.',
    requirement:
      'Persona jurídica colombiana de comercio, manufactura o servicios, con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, y estados financieros 2023-2025. No haber usado Finbi en los últimos 3 años.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Banca de inversión pyme',
    amountHint: 'Hasta agotar presupuesto · Etapa I hasta 30 nov 2026',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Pymes', 'Banca de inversión', 'Hasta agotar cupo'],
    urgency: 'soon',
    urgencyLabel: 'Etapa I hasta el 30 de noviembre',
    keywords: 'bancoldex finbi 2026 banca inversion pymes',
    accent: 'black',
    closesAt: '2026-11-30',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/finbi-banca-de-inversion-para-pymes-2026',
  },
  {
    id: 'innpulsa-cfp-bucaramanga-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Bucaramanga 2026',
    summary:
      'El listado de iNNpulsa mantiene abiertos 500 cupos para asistencia técnica, formación y apropiación tecnológica de unidades productivas y MiPymes de Bucaramanga y municipios aledaños, hasta agotar beneficiarios.',
    requirement:
      'Persona natural o jurídica, emprendedor, micronegocio o MiPymes de cualquier sector, ubicada en Bucaramanga o municipios aledaños.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '500 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'santanderes',
    tags: ['ZASCA', 'Bucaramanga', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar cupos',
    keywords: 'innpulsa zasca bucaramanga tecnologias cfp 2026',
    accent: 'slate',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-bucaramanga-2026-inscribete-500-cupos-disponibles-cpts-92coq',
  },
  {
    id: 'innpulsa-cfp-cucuta-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías',
    title: 'CFP Tecnologías Cúcuta 2026',
    summary:
      'El listado de iNNpulsa mantiene abiertos 60 cupos para fortalecer capacidades tecnológicas de unidades productivas y MiPymes de Cúcuta y municipios aledaños, hasta agotar beneficiarios.',
    requirement:
      'Persona natural o jurídica, emprendedor, micronegocio o MiPymes de cualquier sector, ubicada en Cúcuta o municipios aledaños.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '60 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'santanderes',
    tags: ['ZASCA', 'Cúcuta', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar cupos',
    keywords: 'innpulsa zasca cucuta tecnologias cfp 2026',
    accent: 'slate',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-cucuta-2026-inscribete-60-cupos-disponibles-byputq',
  },
  {
    id: 'innpulsa-jovenes-valledupar-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías Jóvenes',
    title: 'CFP Tecnologías Jóvenes Valledupar 2026',
    summary:
      'Acompañamiento, formación y acceso a tecnologías para jóvenes de 15 a 28 años en software y hardware, con 65 cupos en Valledupar y municipios aledaños, hasta agotar beneficiarios.',
    requirement:
      'Joven colombiano entre 15 y 28 años cumplidos, ubicado en Valledupar o municipios aledaños, interesado en habilidades de software y hardware.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Formación + acceso a tecnología',
    amountHint: '65 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'tech',
    region: 'caribe',
    tags: ['Jóvenes', 'Valledupar', 'Software', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar cupos',
    keywords: 'innpulsa zasca jovenes valledupar tecnologias software hardware',
    accent: 'yellow',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-jovenes-valledupar-2026-inscribete-65-cupos-disponibles-twadw',
  },
  {
    id: 'innpulsa-jovenes-floridablanca-2026',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'ZASCA Tecnologías Jóvenes',
    title: 'CFP Tecnologías Jóvenes Floridablanca 2026',
    summary:
      'Acompañamiento, formación y acceso a tecnologías para jóvenes de 15 a 28 años en software y hardware, con 100 cupos en Floridablanca y municipios aledaños, hasta agotar beneficiarios.',
    requirement:
      'Joven colombiano entre 15 y 28 años cumplidos, ubicado en Floridablanca o municipios aledaños, interesado en habilidades de software y hardware.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Formación + acceso a tecnología',
    amountHint: '100 cupos · hasta agotar beneficiarios',
    funding: 'aceleradora',
    stage: 'temprana',
    sector: 'tech',
    region: 'santanderes',
    tags: ['Jóvenes', 'Floridablanca', 'Software', 'Hasta agotar cupos'],
    urgency: 'continuous',
    urgencyLabel: 'Abierta hasta agotar cupos',
    keywords: 'innpulsa zasca jovenes floridablanca tecnologias software hardware',
    accent: 'yellow',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/zasca-tecnologias-jovenes-floridablanca-2026-inscribete-100-cupos-disponibles-umdquq',
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
    amountHint: 'Ventanilla activa · cupo Bancóldex $180.000 millones',
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
]

export function matchesRegion(item: Convocatoria, region: string) {
  if (region === 'all') return true
  if (item.region === 'nacional') return true
  return item.region === region
}

export function isOpenToday(item: Convocatoria) {
  return item.urgency !== 'upcoming' && item.urgency !== 'closed'
}
