import type { QuestionWithCategory } from '@/types/database.types'

/** Icebreakers hackathon: perfil, experiencia y conexión (texto corto para tarjetas). */
const cat = {
  id: '30000000-0000-4000-b000-000000000001',
  name: 'Hackathon · Conectar',
  slug: 'hackathon-practice' as string | null,
  color_hex: '#7B35FF',
  icon_slug: 'code-2',
  organizacion_id: null,
  created_at: new Date().toISOString(),
}

const base = {
  category_id: cat.id,
  difficulty_level: 'easy' as const,
  created_at: new Date().toISOString(),
}

const PROMPTS = [
  '¿Qué significa tu perfil (front/back/full stack/datos) en el equipo que imaginas?',
  '¿Tu primer proyecto con código fue personal, clase o trabajo? ¿Qué hizo especial?',
  '¿Qué stack o herramienta dominas mejor hoy?',
  '¿Alguna tecnología nueva que quieras probar en un fin de semana?',
  '¿Prefieres empezar por UI, API o modelo de datos? ¿Por qué?',
  'Cuéntanos un bug o incidente técnico que te enseñó más que un tutorial.',
  '¿Qué validarías antes de presentar demo en vivo?',
  '¿Cómo repartirías tiempo si te queda una hora y falta una feature?',
  '¿Tu mayor fortaleza al trabajar sin dormir tanto: código, comunicación u organización?',
  '¿Ya participaste en hackathon o jam? ¿Qué te llevaste?',
  '¿Qué rol te asignarías si el equipo es desconocido al inicio?',
  'Nombre un recurso gratuito que recomiendas a otros devs.',
  '¿Versión corta de lo que sueles hacer en tu día técnico (estudio o empresa)?',
  '¿Hay un proyecto personal que sí quieras contar entre compañeros?',
  '¿Cómo pides ayuda cuando te atascas con algo que no compiló?',
  '¿Algo que no negocias en calidad antes de hacer merge?',
  '¿Cliente interno vs. producto propio? ¿Cuál conoces mejor?',
  '¿Qué automatizarías en un equipo agotado con plazos de 48 h?',
  '¿Ejemplo rápido de cómo mejoraste rendimiento en algo que tocaste?',
  '¿Cómo explicas tu perfil técnico a alguien de negocio en una frase?',
  '¿Librería o framework que te sorprendió por su comunidad?',
  '¿Algo que cambió tu forma de leer errores en consola o logs?',
  '¿Preferirías hacer pitch técnico o demo en vivo ante jurado?',
  '¿Tu mayor aprendizaje al trabajar remoto vs. presencial en código?',
  '¿Área donde te gustaría tener un mentor estos meses?',
  '¿Decisiones rápidas: documentas en el mismo repo o sólo verbal?',
  '¿Ejemplo claro donde tests o revisión salvó el sprint?',
  '¿Cómo eliges prioridad cuando dos tareas chocan en el backlog?',
  '¿Qué te motiva a seguir aprendiendo fuera de obligaciones académicas?',
  '¿Proyecto colaborativo que te enseñó convivir código de otros?',
  '¿Sensación después de hacer deploy bien hecho?',
  '¿Manejo favorito ante un compañero con otro nivel de experiencia?',
  '¿Snippet o patrón que repites porque te ahorra tiempo?',
  '¿Tema que te gustaría exponer corto ante compañeros de hackathon?',
  '¿Versión práctica de “qué problema resolviste” cuando te presentas?',
  '¿Herramienta de prototipado rápido que usarías antes de desarrollar full?',
  '¿Culturalmente: escuchas música, silencio o pomodoros cuando programas?',
  '¿Valor que quieras que otros noten trabajando contigo estos días?',
  '¿Historia breve tras elegir especializarte donde estás?',
  '¿Qué esperas descubrir de los demás antes de cerrar esta ronda de networking?',
] as const

function idForIndex(i: number): string {
  const n = i + 1
  const tail = String(n).padStart(12, '0')
  return `30000000-0000-4000-a000-${tail}`
}

export const HACKATHON_PRACTICE_QUESTIONS: QuestionWithCategory[] = PROMPTS.map((content, i) => ({
  ...base,
  id: idForIndex(i),
  content,
  category: cat,
}))
