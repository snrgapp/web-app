export type LessonResource = {
  id: string
  title: string
  meta: string
  kind: 'pdf' | 'chart' | 'repo' | 'article'
}

export type CourseLesson = {
  id: string
  title: string
  duration: string
  durationSeconds: number
  about: string
  resources: LessonResource[]
  videoUrl?: string
}

const LESSONS: Record<string, CourseLesson[]> = {
  b2b: [
    {
      id: 'icp',
      title: 'Cómo se ve un ICP enterprise que el equipo sí usa',
      duration: '12:40',
      durationSeconds: 760,
      about:
        'Definimos un ICP que sales puede ejecutar: señales de cuenta, buyer committee y filtros que evitan perseguir logos que no cierran.',
      resources: [
        { id: 'pdf', title: 'Plantilla de ICP enterprise (PDF)', meta: '1.8 MB', kind: 'pdf' },
        { id: 'chart', title: 'Mapa de buyer committee', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Scorecard de cuentas en Sheets', meta: 'Plantilla', kind: 'repo' },
        { id: 'read', title: 'Lectura: cualificar antes de outbound', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'discovery',
      title: 'Discovery en deals de ciclo largo',
      duration: '14:19',
      durationSeconds: 859,
      about:
        'Cómo estructurar discovery para un deal de 6 a 12 meses: preguntas, criterios de avance y notas que el AE siguiente puede usar.',
      resources: [
        { id: 'pdf', title: 'Guión de discovery B2B (PDF)', meta: '2.1 MB', kind: 'pdf' },
        { id: 'chart', title: 'Etapas del ciclo largo', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Checklist de next step', meta: 'Notion', kind: 'repo' },
        { id: 'read', title: 'Lectura: MEDDICC sin teatro', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'equipo',
      title: 'Del founder-led sales al primer equipo de AEs',
      duration: '11:05',
      durationSeconds: 665,
      about:
        'Cuándo contratar, qué habilitar primero y cómo no perder el close rate cuando dejas de vender tú todas las oportunidades.',
      resources: [
        { id: 'pdf', title: 'Playbook de onboarding AE (PDF)', meta: '1.4 MB', kind: 'pdf' },
        { id: 'chart', title: 'Ramp de 90 días', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Call library de ejemplo', meta: 'Carpeta', kind: 'repo' },
        { id: 'read', title: 'Lectura: founder-led a team-led', meta: 'Artículo', kind: 'article' },
      ],
    },
  ],
  finance: [
    {
      id: 'modelo',
      title: 'El esqueleto de un modelo de 3 estados',
      duration: '15:10',
      durationSeconds: 910,
      about:
        'Armamos P&L, balance y cash flow conectados, con supuestos visibles y sin celdas mágicas que se rompen al cambiar un input.',
      resources: [
        { id: 'pdf', title: 'Guía del modelo de 3 estados (PDF)', meta: '2.6 MB', kind: 'pdf' },
        { id: 'chart', title: 'Flujo entre estados', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Modelo base en Sheets', meta: 'Plantilla', kind: 'repo' },
        { id: 'read', title: 'Lectura: supuestos que resisten due diligence', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'unit',
      title: 'Unit economics que no se rompen al escalar',
      duration: '13:22',
      durationSeconds: 802,
      about:
        'CAC, LTV, payback y contribución con definiciones que un inversionista no te va a devolver. Incluye trampas típicas de SaaS B2B.',
      resources: [
        { id: 'pdf', title: 'Diccionario de unit economics (PDF)', meta: '1.2 MB', kind: 'pdf' },
        { id: 'chart', title: 'Cohortes y payback', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Calculadora de LTV', meta: 'Sheets', kind: 'repo' },
        { id: 'read', title: 'Lectura: contribución vs. vanidad', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'ronda',
      title: 'Escenarios y la historia para inversionistas',
      duration: '10:48',
      durationSeconds: 648,
      about:
        'Base, upside y downside con una narrativa coherente: qué tiene que pasar, qué rompe el modelo y cómo se lo cuentas en 8 minutos.',
      resources: [
        { id: 'pdf', title: 'Paquete de ronda (PDF)', meta: '3.1 MB', kind: 'pdf' },
        { id: 'chart', title: 'Tres escenarios en una página', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Deck de supuestos', meta: 'Slides', kind: 'repo' },
        { id: 'read', title: 'Lectura: runway sin autoengaño', meta: 'Artículo', kind: 'article' },
      ],
    },
  ],
  pmf: [
    {
      id: 'senales',
      title: 'Señales de retención vs. opiniones',
      duration: '12:05',
      durationSeconds: 725,
      about:
        'Cómo distinguir PMF real de un buen pitch: retención, frecuencia de uso y evidencia que sobrevive a una semana mala de ventas.',
      resources: [
        { id: 'pdf', title: 'Tablero de evidencia PMF (PDF)', meta: '1.6 MB', kind: 'pdf' },
        { id: 'chart', title: 'Señales de retención', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Encuesta Sean Ellis adaptada', meta: 'Formulario', kind: 'repo' },
        { id: 'read', title: 'Lectura: PMF no es un momento', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'entrevistas',
      title: 'Entrevistas de discovery que no inducen la respuesta',
      duration: '14:50',
      durationSeconds: 890,
      about:
        'Preguntas, silencio y notas para no confirmar tu tesis. Incluye cómo separar problema, workaround y feature request.',
      resources: [
        { id: 'pdf', title: 'Guión de entrevista (PDF)', meta: '900 KB', kind: 'pdf' },
        { id: 'chart', title: 'Mapa problema-workaround', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Plantilla de notas', meta: 'Notion', kind: 'repo' },
        { id: 'read', title: 'Lectura: The Mom Test en B2B', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'decision',
      title: 'Cuándo insistir, pivotar o pausar',
      duration: '09:36',
      durationSeconds: 576,
      about:
        'Un marco corto para decidir con el equipo y el board, sin convertir cada duda en un rebrand ni cada señal débil en un pivot.',
      resources: [
        { id: 'pdf', title: 'Matriz insistir / pivotar (PDF)', meta: '1.1 MB', kind: 'pdf' },
        { id: 'chart', title: 'Señales de salida', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Memo de decisión', meta: 'Doc', kind: 'repo' },
        { id: 'read', title: 'Lectura: kill criteria', meta: 'Artículo', kind: 'article' },
      ],
    },
  ],
  ai: [
    {
      id: 'agente',
      title: 'De un prompt a un agente con herramientas',
      duration: '16:20',
      durationSeconds: 980,
      about:
        'Objetivo, herramientas y límites: cómo pasar de un chat suelto a un agente que ejecuta una tarea de operación sin inventar pasos.',
      resources: [
        { id: 'pdf', title: 'Arquitectura de un agente (PDF)', meta: '2.4 MB', kind: 'pdf' },
        { id: 'chart', title: 'Loop pensar-actuar-observar', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Repo de agentes de ejemplo', meta: 'GitHub', kind: 'repo' },
        { id: 'read', title: 'Lectura: tool use sin humo', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'memoria',
      title: 'Memoria, contexto y costo',
      duration: '13:44',
      durationSeconds: 824,
      about:
        'Qué guardar, qué olvidar y cómo no inflar tokens. Casos reales de startups que rompieron el presupuesto en la semana 2.',
      resources: [
        { id: 'pdf', title: 'Guía de contexto y memoria (PDF)', meta: '1.7 MB', kind: 'pdf' },
        { id: 'chart', title: 'Costo por tarea', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Checklist de tokens', meta: 'Doc', kind: 'repo' },
        { id: 'read', title: 'Lectura: RAG vs. memoria', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'prod',
      title: 'Evaluación y puesta en producción',
      duration: '12:18',
      durationSeconds: 738,
      about:
        'Evals, logs, fallbacks y un criterio mínimo para decir que el agente está listo. Sin demo de escenario único.',
      resources: [
        { id: 'pdf', title: 'Playbook de evals (PDF)', meta: '2.0 MB', kind: 'pdf' },
        { id: 'chart', title: 'Regresiones típicas', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Harness de evaluación', meta: 'GitHub', kind: 'repo' },
        { id: 'read', title: 'Lectura: fallbacks que salvan la cuenta', meta: 'Artículo', kind: 'article' },
      ],
    },
  ],
  lead: [
    {
      id: 'foco',
      title: 'Priorizar lo que solo tú puedes hacer',
      duration: '10:12',
      durationSeconds: 612,
      about:
        'Un filtro semanal para founders seed: qué delegar, qué matar y qué no puede salir de tu calendario esta semana.',
      resources: [
        { id: 'pdf', title: 'Filtro de prioridades (PDF)', meta: '800 KB', kind: 'pdf' },
        { id: 'chart', title: 'Matriz solo-yo / delegable', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Plantilla de semana', meta: 'Notion', kind: 'repo' },
        { id: 'read', title: 'Lectura: agenda de founder', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'feedback',
      title: 'Feedback que cambia conducta',
      duration: '11:55',
      durationSeconds: 715,
      about:
        'Cómo dar feedback específico, a tiempo y sin teatro. Incluye 1:1s que no se convierten en status meeting.',
      resources: [
        { id: 'pdf', title: 'Guía de 1:1 (PDF)', meta: '1.3 MB', kind: 'pdf' },
        { id: 'chart', title: 'Tipos de feedback', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Notas de 1:1', meta: 'Plantilla', kind: 'repo' },
        { id: 'read', title: 'Lectura: feedback en equipos chicos', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'lideres',
      title: 'Primeros líderes sin diluir la cultura',
      duration: '13:08',
      durationSeconds: 788,
      about:
        'Contratar el primer manager, transferir contexto y no perder el estándar cuando dejas de revisar cada detalle.',
      resources: [
        { id: 'pdf', title: 'Scorecard de primer líder (PDF)', meta: '1.5 MB', kind: 'pdf' },
        { id: 'chart', title: 'Ramp de un manager', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Preguntas de entrevista', meta: 'Doc', kind: 'repo' },
        { id: 'read', title: 'Lectura: cultura que escala', meta: 'Artículo', kind: 'article' },
      ],
    },
  ],
  ux: [
    {
      id: 'ritmo',
      title: 'Ritmo semanal de entrevistas',
      duration: '11:30',
      durationSeconds: 690,
      about:
        'Cómo instalar discovery continuo sin parar el roadmap: cupo semanal, dueños y un ritual de 45 minutos que el equipo respeta.',
      resources: [
        { id: 'pdf', title: 'Cadencia de discovery (PDF)', meta: '1.0 MB', kind: 'pdf' },
        { id: 'chart', title: 'Semana tipo', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Calendario de entrevistas', meta: 'Plantilla', kind: 'repo' },
        { id: 'read', title: 'Lectura: continuous discovery', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'oportunidad',
      title: 'De hallazgo a oportunidad',
      duration: '13:15',
      durationSeconds: 795,
      about:
        'Traducir notas de entrevista a oportunidades priorizables, no a un backlog de features con nombre de cliente.',
      resources: [
        { id: 'pdf', title: 'Canvas de oportunidad (PDF)', meta: '1.9 MB', kind: 'pdf' },
        { id: 'chart', title: 'De quote a insight', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Tablero de evidencia', meta: 'FigJam', kind: 'repo' },
        { id: 'read', title: 'Lectura: opportunity solution tree', meta: 'Artículo', kind: 'article' },
      ],
    },
    {
      id: 'alinear',
      title: 'Alinear sales, CS y producto',
      duration: '10:42',
      durationSeconds: 642,
      about:
        'Un ritual compartido para que lo que oye sales no se pierda y lo que construye producto no sorprenda a CS en el renewal.',
      resources: [
        { id: 'pdf', title: 'Ritual de triad (PDF)', meta: '1.2 MB', kind: 'pdf' },
        { id: 'chart', title: 'Flujos de evidencia', meta: 'Infografía', kind: 'chart' },
        { id: 'repo', title: 'Agenda de sync semanal', meta: 'Doc', kind: 'repo' },
        { id: 'read', title: 'Lectura: GTM y producto en la misma mesa', meta: 'Artículo', kind: 'article' },
      ],
    },
  ],
}

export function getCourseLessons(courseId: string | undefined) {
  if (!courseId) return []
  return LESSONS[courseId] ?? []
}

export function getCourseLesson(courseId: string | undefined, lessonId: string | undefined) {
  return getCourseLessons(courseId).find((lesson) => lesson.id === lessonId)
}

export function getFirstLessonId(courseId: string | undefined) {
  return getCourseLessons(courseId)[0]?.id
}

export function getAdjacentLessonIds(courseId: string | undefined, lessonId: string | undefined) {
  const lessons = getCourseLessons(courseId)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)
  return {
    prevId: index > 0 ? lessons[index - 1]?.id : undefined,
    nextId: index >= 0 ? lessons[index + 1]?.id : undefined,
  }
}
