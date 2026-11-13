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

export const RADAR_REVIEWED_AT = '2026-11-13'

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
 * Fichas contrastadas el 2026-11-13 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'minciencias-54-sgr',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 54 · SGR / ACTeI',
    title: 'Fortalecimiento de capacidades científico-tecnológicas',
    summary:
      'Banco de proyectos regionales elegibles con recursos de regalías. Cada proyecto se ejecuta en al menos dos departamentos de una misma región del SGR. Tope por proyecto: $17.177.626.246. La ficha marca estado Abierta; cierra hoy 13 de noviembre de 2026 a las 4:00 p. m.',
    requirement:
      'Alianza con al menos una IES, otra entidad del SNCTI, una entidad territorial y un actor usuario o adoptante de los resultados.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$927.591.817.322 COP',
    amountHint: 'Cierre 13 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['SGR', 'CTeI', 'Regiones', 'Cierra hoy'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra hoy a las 4:00 p. m.',
    keywords: 'minciencias 54 sgr capacidades cientifico tecnologicas regalías',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://www.minciencias.gov.co/convocatorias/convocatoria-54-convocatoria-especial-para-la-financiacion-proyectos-para-el',
  },
  {
    id: 'minciencias-55-macroproyectos',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 55 · SGR / ACTeI',
    title: 'Macroproyectos nacionales de capacidades científico-tecnológicas',
    summary:
      'Hasta diez macroproyectos nacionales (hasta $50.000 millones cada uno) con intervención en al menos dos regiones del SGR. La ficha marca estado Abierta; cierra hoy 13 de noviembre de 2026 a las 4:00 p. m.',
    requirement:
      'Alianza de al menos tres personas jurídicas nacionales distintas, con intervención directa en mínimo dos regiones del SGR.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$500.000.000.000 COP',
    amountHint: 'Hasta $50.000 millones por macroproyecto · cierra 13 nov 16:00',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['SGR', 'Macroproyectos', 'CTeI', 'Cierra hoy'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra hoy a las 4:00 p. m.',
    keywords: 'minciencias 55 macroproyectos sgr capacidades ctei',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://www.minciencias.gov.co/convocatorias/convocatoria-especial-para-la-financiacion-macroproyectos-nacionales-para-el',
  },
  {
    id: 'bancoldex-territorios-paz',
    initials: 'BX',
    entity: 'Bancóldex',
    entitySub: 'PNUD y Unidad para las Víctimas',
    title: 'Transformación Financiera, Territorios de Paz',
    summary:
      'Formación financiera presencial (600 cupos) y mentorías individuales (360 cupos) para unidades productivas de víctimas del conflicto en municipios PDET. Gratuito. La ficha y la Adenda 7 publican cierre el 19 de noviembre de 2026 a las 11:59 p. m. Selección semanal hasta agotar cupos.',
    requirement:
      'Unidad productiva de población víctima, domiciliada y en operación en un municipio priorizado, con compromiso de asistencia presencial.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: 'Formación + mentoría',
    amountHint: 'Cierre 19 nov 2026 · 11:59 p. m. · Adenda 7',
    funding: 'cofinanciacion',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Fortalecimiento', 'Víctimas', 'PDET', 'Gratuito'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 19 de noviembre',
    keywords: 'bancoldex territorios paz pnud victimas formacion mentoria adenda 7',
    accent: 'black',
    closesAt: '2026-11-19',
    basesUrl:
      'https://www.bancoldex.com/soluciones-de-fortalecimiento-empresarial/transformacion-financiera-territorios-de-paz',
  },
  {
    id: 'innpulsa-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad',
    title: 'Formación IATF 16949:2016 para mipymes automotrices',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de calidad IATF 16949:2016 en la cadena automotriz y de motopartes. El API de iNNpulsa la marca abierta hasta el 30 de noviembre de 2026 a las 23:59.',
    requirement:
      'Mipyme con al menos un año de constitución, 5 trabajadores con contrato laboral, registro mercantil activo y operación en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca, en la cadena automotriz o de motopartes.',
    amountLabel: 'Beneficio principal',
    amountValue: '50 horas de asistencia técnica',
    amountHint: 'Cierre 30 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'IATF', 'Automotriz', 'Cierra 30 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 30 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad mipymes automotriz motopartes',
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
      'Postulación presencial para vincular 200 unidades productivas o MiPymes de cualquier sector en Honda y municipios del norte del Tolima, y Guaduas (Cundinamarca). Cierre publicado: 30 de noviembre de 2026 a las 23:59.',
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
    id: 'fondo-emprender-168-volver-a-crecer',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada No. 168',
    title: 'Volver a Crecer — territorios afectados',
    summary:
      'Capital semilla para fortalecer iniciativas productivas formalmente constituidas en Caldas, Chocó, Quindío, Risaralda, Valle del Cauca y Tolima, que acrediten afectación por el terremoto del 10 de agosto de 2026 o por incendios forestales. Bolsa: $34.140.799.482. Cierre: 30 de diciembre de 2026 a las 6:00 p. m.',
    requirement:
      'Persona natural, grupo asociativo u organización constituida, con operación en los departamentos priorizados y prueba de la afectación. Modalidades individual y asociativa de fortalecimiento.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$34.140.799.482 COP',
    amountHint: 'Cierre 30 dic 2026 · 6:00 p. m.',
    funding: 'semilla',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Capital semilla', 'Eje cafetero', 'Valle', 'Tolima', 'Chocó'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 30 de diciembre',
    keywords: 'fondo emprender 168 volver a crecer sena terremoto incendios capital semilla',
    accent: 'yellow',
    closesAt: '2026-12-30',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1682026.aspx',
  },
  {
    id: 'ccbucaramanga-gef-2026',
    initials: 'CB',
    entity: 'Cámara de Comercio de Bucaramanga',
    entitySub: 'Global Events & Fairs',
    title: 'Convocatoria GEF 2026',
    summary:
      'Cofinanciación para que empresas exportadoras de Santander participen en ferias, agendas comerciales o misiones de compradores. Hasta $5.000.000 COP más IVA; 33 cupos. Abierta hasta el 31 de diciembre de 2026 o hasta agotar cupos. TDR publicados en la ficha.',
    requirement:
      'Empresa registrada en la Cámara de Comercio de Bucaramanga, matrícula renovada, mínimo dos años de antigüedad y no estar en liquidación o embargo.',
    amountLabel: 'Cofinanciación por empresa',
    amountValue: 'Hasta $5.000.000 COP + IVA',
    amountHint: '33 cupos · cierra 31 dic 2026 o al agotar cupos',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'comercio',
    region: 'santanderes',
    tags: ['Exportación', 'Santander', 'Ferias', 'Cofinanciación'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 31 de diciembre o al agotar cupos',
    keywords: 'camara bucaramanga gef 2026 exportacion ferias cofinanciacion',
    accent: 'slate',
    closesAt: '2026-12-31',
    basesUrl: 'https://www.camaradirecta.com/convocatorias-basicas/convocatoria-gef-2026',
  },
  {
    id: 'innpulsa-logyca-gs1',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Alianza LOGYCA / GS1',
    title: 'Servicios complementarios logísticos, de colaboración y códigos de barras',
    summary:
      'Alianza MinCIT, iNNpulsa y LOGYCA/ASOCIACIÓN: siete servicios gratuitos bajo el estándar GS1 para identificación, colaboración y logística. El API de iNNpulsa publica cierre el 31 de octubre de 2027.',
    requirement: 'Empresarios o emprendedores en Colombia que requieran estándares GS1 / LOGYCA.',
    amountLabel: 'Beneficio principal',
    amountValue: '7 servicios GS1 gratuitos',
    amountHint: 'Cierre 31 oct 2027',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'multi',
    region: 'nacional',
    tags: ['Logística', 'Códigos de barras', 'Nacional', 'Sin costo'],
    urgency: 'open',
    urgencyLabel: 'Cierra el 31 de octubre de 2027',
    keywords: 'innpulsa logyca gs1 codigos de barras mincit',
    accent: 'yellow',
    closesAt: '2027-10-31',
    basesUrl: 'https://convocatorias.innpulsacolombia.com/convocatoria/69bb119298e5068a5213f26c',
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
      'Asesoría de banca de inversión para pymes: diagnóstico y estructuración financiera (Etapa I) y acompañamiento para consecución de recursos (Etapa II). Bancóldex asume el 85 % de la Etapa I. Cierra al agotar el presupuesto; la Etapa I debe ejecutarse a más tardar el 30 de noviembre de 2026.',
    requirement:
      'Persona jurídica colombiana con al menos 3 años, ventas 2025 entre $2.500 y $78.451 millones, estados financieros 2023-2025 y que no haya tomado Finbi en los últimos 3 años.',
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
