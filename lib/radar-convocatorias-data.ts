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

export const RADAR_REVIEWED_AT = '2026-11-09'

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
 * Fichas contrastadas el 2026-11-09 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'innpulsa-logyca-gs1',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Alianza LOGYCA / GS1',
    title: 'Servicios complementarios logísticos, de colaboración y códigos de barras',
    summary:
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para identificación, colaboración y logística. El API de iNNpulsa la marca abierta hasta el 9 de noviembre de 2026 (cierre el mismo día de esta revisión).',
    requirement: 'Empresarios o emprendedores en Colombia que requieran estándares GS1 / LOGYCA.',
    amountLabel: 'Beneficio principal',
    amountValue: '7 servicios GS1 gratuitos',
    amountHint: 'Cierre 9 nov 2026',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Logística', 'Códigos de barras', 'Nacional', 'Sin costo'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra hoy',
    keywords: 'innpulsa logyca gs1 codigos de barras mincit',
    accent: 'yellow',
    closesAt: '2026-11-09',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
  },
  {
    id: 'fondo-emprender-167-cordoba',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada 167',
    title: '167 — Córdoba productiva',
    summary:
      'Capital semilla para crear o fortalecer iniciativas productivas de todos los sectores en el departamento de Córdoba, en modalidad individual o asociativa. La ficha no muestra banner de cerrada. La Adenda 1 (noviembre 2026) amplía el cierre al 10 de noviembre de 2026. Bolsa: $20.000.000.000.',
    requirement:
      'Emprendedores o unidades productivas domiciliados en Córdoba; completar la Ruta Emprendedora SENA y cumplir los TDR de la convocatoria 167.',
    amountLabel: 'Bolsa de la convocatoria',
    amountValue: '$20.000.000.000 COP',
    amountHint: 'Adenda 1 · cierre 10 nov 2026',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'caribe',
    tags: ['Capital semilla', 'Córdoba', 'SENA', 'Cierra 10 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 10 de noviembre',
    keywords: 'fondo emprender 167 cordoba productiva sena capital semilla monteria adenda',
    accent: 'yellow',
    closesAt: '2026-11-10',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1672026.aspx',
  },
  {
    id: 'minciencias-54-capacidades',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 54 · SGR CTeI',
    title: '54 — Fortalecimiento de capacidades científico-tecnológicas',
    summary:
      'Banco de proyectos regionales elegibles con recursos de la Asignación CTeI del Sistema General de Regalías. Ficha oficial: Abierta. Bolsa: $927.591.817.322. Cierre: 13 de noviembre de 2026, 4:00 p. m. El portal indica 4 días restantes.',
    requirement:
      'Alianzas de entidades del SNCTI (y otras que aporten capacidades). La proponente debe tener reconocimiento vigente de MinCiencias como actor del SNCTI o acreditar actividades de CTeI según el Decreto 1821 de 2020.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$927.591.817.322 COP',
    amountHint: 'Cierre 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'SGR', 'CTeI', 'Cierra 13 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 54 capacidades ctei sgr regalías alianzas regionales',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-54-convocatoria-especial-para-la-financiacion-proyectos-para-el',
  },
  {
    id: 'minciencias-55-macroproyectos',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 55 · SGR CTeI',
    title: '55 — Macroproyectos nacionales de capacidades CTeI',
    summary:
      'Listado de macroproyectos nacionales elegibles para fortalecer capacidades científico-tecnológicas. Ficha oficial: Abierta. Bolsa indicativa: $500.000.000.000 (hasta $50.000.000.000 por macroproyecto; se esperan 10). Cierre: 13 de noviembre de 2026, 4:00 p. m. El portal indica 4 días restantes.',
    requirement:
      'Alianzas de mínimo tres personas jurídicas nacionales distintas (una proponente y al menos dos integrantes). La proponente debe tener reconocimiento vigente de MinCiencias como actor del SNCTI o acreditar trayectoria de CTeI según los TDR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$500.000.000.000 COP',
    amountHint: 'Hasta $50.000 millones por macroproyecto · cierre 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['Cofinanciación', 'SGR', 'Macroproyectos', 'Cierra 13 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 55 macroproyectos ctei sgr regalías alianzas nacionales',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-especial-para-la-financiacion-macroproyectos-nacionales-para-el',
  },
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial y mentorías individuales para unidades productivas de víctimas del conflicto en municipios PDET. La HTML de la ficha aún muestra el 30 de octubre; la Adenda 6 (19 oct 2026) mueve el cierre al 15 de noviembre de 2026, 11:59 p. m. El PDF de la Adenda 6 sigue publicado (HTTP 200).',
    requirement:
      'Unidad productiva de población víctima, domiciliada y en operación en un municipio PDET priorizado en la Adenda 6.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Adenda 6 · cierre 15 nov 2026 · 11:59 p. m.',
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
    id: 'innpulsa-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad',
    title: 'Formación IATF 16949:2016 para mipymes',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de la calidad conforme a IATF 16949:2016 y avanzar en la cadena automotriz y de motopartes. El API de iNNpulsa la marca abierta hasta el 30 de noviembre de 2026 (23:59).',
    requirement:
      'Mipymes de la cadena automotriz o de motopartes, con al menos un año de constitución y 5 trabajadores, ubicadas en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF 16949',
    amountHint: 'Cierre 30 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'Automotriz', 'IATF', 'Cierra 30 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad automotriz motopartes',
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
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Honda y municipios del norte del Tolima, y Guaduas (Cundinamarca). El API de iNNpulsa la marca abierta hasta el 30 de noviembre de 2026 (23:59).',
    requirement:
      'Unidad productiva o MiPymes ubicada en Honda, Ambalema, Armero, Guayabal, Fresno, Casablanca, Herveo, Lérida, Líbano, Mariquita, Murillo, Palocabildo, Villahermosa o Guaduas.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Fortalecimiento ZASCA Tecnologías',
    amountHint: '200 cupos · postulación presencial · cierre 30 nov 2026',
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
      'Postulación presencial para vincular 300 unidades productivas o MiPymes de cualquier sector en municipios de Norte de Santander. El API de iNNpulsa la marca abierta hasta el 2 de diciembre de 2026.',
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
    id: 'fondo-emprender-168-volver-crecer',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada 168',
    title: '168 — Volver a Crecer',
    summary:
      'Capital semilla para fortalecer negocios formales (mínimo un año) en Caldas, Chocó, Quindío, Risaralda, Valle del Cauca y Tolima afectados por el terremoto del 10 de agosto de 2026 o por incendios forestales. Ficha oficial sin banner de cerrada. Cierre: 30 de diciembre de 2026, 6:00 p. m.',
    requirement:
      'Unidad productiva formal con antigüedad no inferior a un año, localizada en los departamentos priorizados, que acredite la afectación (Anexo 25) y cumpla los TDR de la 168.',
    amountLabel: 'Bolsa de la convocatoria',
    amountValue: '$34.140.799.482 COP',
    amountHint: 'Cierre 30 dic 2026 · 6:00 p. m.',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'Volver a Crecer', 'SENA', 'Cierra 30 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'fondo emprender 168 volver a crecer terremoto incendios caldas choco quindio risaralda valle tolima',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1682026.aspx',
  },
  {
    id: 'ccbucaramanga-gef-2026',
    initials: 'CB',
    entity: 'Cámara de Comercio de Bucaramanga',
    entitySub: 'Global Plan Santander',
    title: 'GEF 2026 — Global Events & Fairs',
    summary:
      'Cofinanciación de hasta $5.000.000 COP más IVA para que empresas exportadoras de Santander participen en ferias o eventos internacionales con componente comercial, o en misiones de compradores. Ficha y TDR publicados. Abierta hasta el 31 de diciembre de 2026 o hasta completar 33 cupos.',
    requirement:
      'Empresa registrada en la Cámara de Comercio de Bucaramanga, matrícula renovada a 2026, mínimo dos años de constitución, haber exportado en 2025 y no estar en liquidación o embargo.',
    amountLabel: 'Cofinanciación por empresa',
    amountValue: 'Hasta $5.000.000 COP + IVA',
    amountHint: '33 cupos · cierre 31 dic 2026 o hasta agotar cupos',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'comercio',
    region: 'santanderes',
    tags: ['Exportación', 'Santander', 'Ferias', 'Cierra 31 dic 2026'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 31 de diciembre',
    keywords: 'camara bucaramanga gef 2026 ferias exportacion cofinanciacion santander',
    accent: 'slate',
    closesAt: '2026-12-31',
    basesUrl: 'https://www.camaradirecta.com/convocatorias-basicas/convocatoria-gef-2026',
  },
  {
    id: 'fondo-mujer-a-pulso',
    initials: 'FM',
    entity: 'Fondo Mujer Libre y Productiva',
    entitySub: 'Convenio Bancóldex / Grupo Bicentenario',
    title: 'Línea de crédito A PULSO',
    summary:
      'Línea de redescuento activa para mujeres microempresarias de actividades no agrícolas, con compensación parcial de capital. Tope por operación: hasta 6 SMMLV. El desembolso se gestiona con establecimientos financieros aliados. Estado en ficha: Activa.',
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
      'Asesoría de banca de inversión para pymes colombianas (diagnóstico, estructuración y, en etapa II, consecución de recursos). Abrió el 24 de abril de 2026; cierra al agotar el presupuesto de Bancóldex. La Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026. Bancóldex asume el 85 % del costo de la Etapa I.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025, y que no haya usado Finbi en los últimos 3 años.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Banca de inversión pyme (85 % Etapa I)',
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
