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

export const RADAR_REVIEWED_AT = '2026-11-03'

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
 * Fichas contrastadas el 2026-11-03 en listados públicos (sin login).
 * Solo convocatorias con cierre vigente o ventanilla activa y URL de ficha/TDR.
 * Portales sin respuesta o sin llamado abierto verificable no tienen ficha.
 */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: 'minciencias-56',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 56 · SGR / Decreto 1414 de 2026',
    title: 'Emergencia: recuperación y capacidades transformadoras',
    summary:
      'Banco de proyectos elegibles con recursos de la Asignación para CTeI del SGR, orientados a adaptar, validar, transferir, apropiar o escalar tecnologías e innovaciones para la atención y recuperación. La ficha la marca Abierta. Cierre: 3 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianzas y entidades ejecutoras del SNCTI según TDR de la Convocatoria 56, con formulación en la PIIP.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$700.000.000.000 COP',
    amountHint: 'Cierre 3 nov 2026 · 4:00 p. m.',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['CTeI', 'Regalías', 'Emergencia', 'Cierra 3 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra hoy a las 4:00 p. m.',
    keywords: 'minciencias 56 emergencia sgr ctei decreto 1414',
    accent: 'black',
    closesAt: '2026-11-03',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-emergencia-para-la-recuperacion-y-generacion-capacidades-transformadoras',
  },
  {
    id: 'innpulsa-iatf-16949',
    initials: 'iN',
    entity: 'iNNpulsa Colombia / MinCIT',
    entitySub: 'Asistencia técnica en calidad · ONUDI',
    title: 'Calidad IATF 16949:2016 para mipymes automotriz',
    summary:
      'Asistencia técnica para implementar un sistema de gestión de la calidad conforme a IATF 16949:2016 en la cadena automotriz y de motopartes. El API de iNNpulsa la marca abierta hasta el 4 de noviembre de 2026 (23:59).',
    requirement:
      'Mipymes con al menos un año de constitución, 5 trabajadores con contrato laboral, ubicadas en Antioquia, Bogotá D.C., Caldas, Cundinamarca, Quindío, Risaralda o Valle del Cauca, del sector automotriz o de motopartes.',
    amountLabel: 'Beneficio principal',
    amountValue: 'Asistencia técnica IATF 16949',
    amountHint: 'Cierre 4 nov 2026 · 23:59',
    funding: 'aceleradora',
    stage: 'ambas',
    sector: 'comercio',
    region: 'nacional',
    tags: ['Calidad', 'Automotriz', 'IATF', 'Cierra 4 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 4 de noviembre',
    keywords: 'innpulsa iatf 16949 calidad automotriz motopartes onudi',
    accent: 'yellow',
    closesAt: '2026-11-04',
    basesUrl:
      'https://convocatorias.innpulsacolombia.com/convocatoria/formacion-y-asistencia-tecnica-en-calidad-para-mipymes-convocatoria-territorial--o2q9yw',
  },
  {
    id: 'fondo-emprender-167-cordoba',
    initials: 'FE',
    entity: 'Fondo Emprender / SENA',
    entitySub: 'Convocatoria focalizada 167',
    title: '167 — Córdoba productiva',
    summary:
      'Capital semilla para crear o fortalecer iniciativas productivas de todos los sectores en el departamento de Córdoba, en modalidad individual o asociativa. Ficha oficial sin banner de cerrada. Bolsa: $20.000.000.000. Cierre: 6 de noviembre de 2026.',
    requirement:
      'Emprendedores o unidades productivas domiciliados en Córdoba; completar la Ruta Emprendedora SENA y cumplir los TDR de la convocatoria 167.',
    amountLabel: 'Bolsa de la convocatoria',
    amountValue: '$20.000.000.000 COP',
    amountHint: '$15.000 millones municipios · $5.000 millones Montería',
    funding: 'semilla',
    stage: 'temprana',
    sector: 'multi',
    region: 'caribe',
    tags: ['Capital semilla', 'Córdoba', 'SENA', 'Cierra 6 nov 2026'],
    urgency: 'urgent',
    urgencyLabel: 'Cierra el 6 de noviembre',
    keywords: 'fondo emprender 167 cordoba productiva sena capital semilla monteria',
    accent: 'yellow',
    closesAt: '2026-11-06',
    basesUrl: 'https://www.fondoemprender.com/SitePages/FondoEmprenderConv1672026.aspx',
  },
  {
    id: 'minciencias-54',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 54 · SGR',
    title: 'Proyectos regionales de capacidades científico-tecnológicas',
    summary:
      'Banco especial de proyectos elegibles de alcance regional para fortalecer capacidades científico-tecnológicas, ejecutados en al menos dos departamentos de una misma región del SGR. Ficha Abierta. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianzas del SNCTI según TDR; proyectos de alcance regional (mínimo dos departamentos de una misma región SGR).',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$927.591.817.322 COP',
    amountHint: 'Hasta $17.177.626.246 por proyecto · cierre 13 nov 16:00',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['CTeI', 'Regalías', 'Regional', 'Cierra 13 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 54 sgr capacidades cientifico tecnologicas regional',
    accent: 'black',
    closesAt: '2026-11-13',
    basesUrl:
      'https://minciencias.gov.co/convocatorias/convocatoria-54-convocatoria-especial-para-la-financiacion-proyectos-para-el',
  },
  {
    id: 'minciencias-55',
    initials: 'MC',
    entity: 'MinCiencias',
    entitySub: 'Convocatoria 55 · SGR',
    title: 'Macroproyectos nacionales de capacidades científico-tecnológicas',
    summary:
      'Listado de macroproyectos nacionales elegibles con la Asignación para CTeI del SGR (bienio 2025-2026), para atender demandas territoriales con intervenciones en varias regiones. Ficha Abierta. Se esperan 10 macroproyectos. Cierre: 13 de noviembre de 2026, 4:00 p. m.',
    requirement:
      'Alianzas nacionales del SNCTI según TDR de la Convocatoria 55, con gobernanza y formulación en la PIIP.',
    amountLabel: 'Recursos de la convocatoria',
    amountValue: '$500.000.000.000 COP',
    amountHint: 'Hasta $50.000.000.000 por macroproyecto · 10 cupos indicativos',
    funding: 'cofinanciacion',
    stage: 'mediana',
    sector: 'multi',
    region: 'nacional',
    tags: ['CTeI', 'Regalías', 'Macroproyectos', 'Cierra 13 nov 2026'],
    urgency: 'soon',
    urgencyLabel: 'Cierra el 13 de noviembre',
    keywords: 'minciencias 55 macroproyectos nacionales sgr ctei',
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
      'Formación financiera presencial (hasta 4 horas) y mentorías individuales para unidades productivas de víctimas del conflicto en municipios PDET. La HTML de la ficha aún muestra el 30 de octubre; la Adenda 6 (19 oct 2026) mueve el cierre al 15 de noviembre de 2026, 11:59 p. m.',
    requirement:
      'Unidad productiva de población víctima, domiciliada y en operación en un municipio PDET priorizado en la Adenda 6.',
    amountLabel: 'Cupos de fortalecimiento',
    amountValue: '600 formación · 360 mentoría',
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
