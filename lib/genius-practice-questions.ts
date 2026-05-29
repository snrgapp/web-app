import type { QuestionWithCategory } from '@/types/database.types'

/** Preguntas de prueba Genius FEST; sustituir o ampliar desde BD cuando haga falta. */
const cat = {
  id: '00000000-0000-4000-8000-00000000c0de',
  name: 'Genius · Conexión',
  slug: 'genius-practice' as string | null,
  color_hex: '#694aff',
  icon_slug: 'sparkles',
  organizacion_id: null,
  created_at: new Date().toISOString(),
}

const base = {
  category_id: cat.id,
  difficulty_level: 'easy' as const,
  created_at: new Date().toISOString(),
}

export const GENIUS_PRACTICE_QUESTIONS: QuestionWithCategory[] = [
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000001',
    content: '¿Qué te trajo al Genius FEST hoy y qué esperas llevarte a casa?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000002',
    content: '¿Qué proyecto, idea o reto te quitó el sueño recientemente?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000003',
    content: 'Si pudieras conectar con una sola persona en esta sala, ¿qué buscarías?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000004',
    content: '¿Qué habilidad o fortaleza tuya te gustaría que más gente conociera?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000005',
    content: 'Describe tu "marca personal" en una sola frase.',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000006',
    content: '¿Cuál es la colaboración de tu vida que todavía no ha pasado?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000007',
    content: 'Si tu trabajo fuera una canción, ¿de qué género sería y por qué?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000008',
    content: '¿Qué consejo le darías a tu yo de hace cinco años sobre construir red de contactos?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000009',
    content: '¿Cuál es la pregunta que más te incomoda responder en una entrevista o pitch?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000010',
    content: '¿Qué problema del mundo crees que tu trabajo o talento podría resolver?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000011',
    content: 'Nombra algo que aprendiste este año que cambió tu forma de trabajar.',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000012',
    content: '¿Qué recurso, contacto o conocimiento tienes hoy que desearías haber tenido al comenzar?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000013',
    content: '¿Cuál es tu superpoder silencioso — ese que la gente tarda en notar?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000014',
    content: '¿Qué proyecto abandonaste y que en el fondo aún quisieras retomar?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000015',
    content: 'Si tuvieras que explicar tu trabajo a un niño de 8 años, ¿cómo lo harías?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000016',
    content: '¿Qué tendencia del sector te emociona y cuál te preocupa?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000017',
    content: '¿Cuál fue el "no" que más agradeces haber recibido?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000018',
    content: '¿Qué tipo de persona complementa mejor tu forma de trabajar?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000019',
    content: 'Si pudieras teletransportarte a cualquier ciudad del mundo para trabajar un mes, ¿cuál sería?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000020',
    content: '¿Qué mito sobre tu industria estás cansado/a de escuchar?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000021',
    content: '¿Cuál es la decisión más arriesgada que tomaste en tu carrera y cómo resultó?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000022',
    content: '¿Qué libro, podcast o conversación te cambió la perspectiva este año?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000023',
    content: '¿Con qué parte de tu trabajo entras en "modo flujo" sin darte cuenta?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000024',
    content: '¿Qué le pedirías a la IA que hiciera por ti si fuera perfecta?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000025',
    content: '¿Cuál es tu definición personal de éxito en este momento de tu vida?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000026',
    content: '¿Qué comunidad, movimiento o causa merece más atención de la que recibe hoy?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000027',
    content: 'Si lanzaras un producto o servicio mañana sin miedo al fracaso, ¿qué sería?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000028',
    content: '¿Qué hábito o ritual te ayuda a mantenerte creativo/a cuando todo se complica?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000029',
    content: '¿Qué le cambiarías al sistema educativo para que prepare mejor a los innovadores?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000030',
    content: '¿Cuál es la conversación que crees que más falta en tu industria o comunidad?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000031',
    content: '¿Qué momento de tu vida cambió para siempre tu visión sobre el trabajo en equipo?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000032',
    content: '¿Cuál es la habilidad que nunca estudiaste formalmente pero que más te ha servido?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000033',
    content: '¿Qué harías diferente si comenzaras tu proyecto o carrera desde cero hoy?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000034',
    content: '¿Cuál es la colaboración entre mundos muy distintos que crees que podría generar algo increíble?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000035',
    content: 'Comparte una creencia sobre el futuro del trabajo que muy poca gente compartiría contigo.',
    category: cat,
  },
]
