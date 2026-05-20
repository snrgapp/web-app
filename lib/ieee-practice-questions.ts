import type { QuestionWithCategory } from '@/types/database.types'

/** Preguntas icebreaker IEEE / tecnología; mismas tarjetas que Genius, otro copy. */
const cat = {
  id: '00000000-0000-4000-8000-00000000ee01',
  name: 'IEEE · Conexión',
  slug: 'ieee-practice' as string | null,
  color_hex: '#00629B',
  icon_slug: 'cpu',
  organizacion_id: null,
  created_at: new Date().toISOString(),
}

const base = {
  category_id: cat.id,
  difficulty_level: 'easy' as const,
  created_at: new Date().toISOString(),
}

export const IEEE_PRACTICE_QUESTIONS: QuestionWithCategory[] = [
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000001',
    content: '¿Qué problema técnico o de ingeniería te mueve más en este momento de tu camino?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000002',
    content:
      'Cuéntale algo que hayas construido, probado en laboratorio o aprendido por tu cuenta estos meses.',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000003',
    content: 'Si pudieras sumar una persona de otra carrera al proyecto ideal, ¿de qué disciplina sería y por qué?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000004',
    content: '¿Qué curso en línea, software, estándar o comunidad profesional más te ayudó a crecer como ingeniero o estudiante?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000005',
    content: 'Háblale de tu último proyecto importante: ¿qué hicieron y qué experiencia les dejó a ustedes al terminar?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000006',
    content: '¿Qué habilidad técnica prefieres reforzar de aquí en adelante? Menciona también por qué te importa.',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000007',
    content: 'En un equipo de ingeniería, ¿en qué fase encajas mejor: definir diseño, implementar, probar prototipos u organizar?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000008',
    content:
      '¿Alguna vez te falló un experimento, una placa o un código importante? ¿Qué ocurrió después y qué aprendizaje conservas?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000009',
    content: 'Con un plazo ajustado: ¿priorizas entregar rápido o frenar por documentación y pruebas? ¿Cómo repartirías ese equilibrio?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000010',
    content:
      'Antes de usar hardware en campo o despachar firmware, ¿cuál es el chequeo profesional que nunca te saltarías aun presionado?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000011',
    content:
      'Imagina tus próximos años: ¿industria aplicada, laboratorio o docencia universitaria, o empezar algo propio?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000012',
    content: '¿Has tenido que leer alguna norma o estándar (seguridad, EMC, calidad)? ¿Cuál y cómo cambió cómo trabajas?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000013',
    content: 'Imagina cliente o jefe no técnicos: ¿cómo explicarías en pocas palabras qué problema resuelves y cómo?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000014',
    content: 'Los proyectos se alargan: ¿qué mantienes igual de serio año tras año (riesgos, trazabilidad, revisiones junto al equipo)?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000015',
    content: 'Da un ejemplo de problema de eficiencia o sostenibilidad propio de tu rama que te gustaría atacar con ingeniería aplicada.',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000016',
    content:
      '¿Qué cambió en tus hábitos técnicos luego de trabajar cerca de alguien con mucha trayectoria en la práctica?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000017',
    content: 'A veces llegan alcances borrosos: ¿cómo avanzas en el diseño o el análisis cuando faltan datos al inicio?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000018',
    content: '¿Cuántas tareas rutinarias automatizarías y dónde crees indispensable el criterio humano experimentado?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000019',
    content: 'En datos, dispositivos o instalaciones físicas: ¿cuál es un límite de seguridad que no cruzas aunque apuren los plazos?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000020',
    content:
      'Si rotaras un año con un colega de otra ingeniería, ¿qué práctica cotidiana tuya admirarían y cuál te gustaría copiar?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000021',
    content: '¿Hay algún proyecto de facultad u horas de práctica que sí te sirvieron después, más allá de la calificación?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000022',
    content:
      '¿Cómo llevas hoy tus notas, diagramas o versionado, y qué mejorarías para que otro equipo reproduzca tu trabajo?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000023',
    content: '¿Qué tendencia tecnológica de tu sector crees infraestimada hoy pero con impacto claro dentro de algunos años?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000024',
    content: 'Imagina tres minutos con reclutamiento técnico: ¿cuál resultado con número concreto destacarías (ahorro tiempo, menor fallo)?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000025',
    content: 'Antes del próximo sprint o laboratorio conjunto: ¿qué hábitos o límites comunicarías a tu nueva pareja técnica?',
    category: cat,
  },
]
