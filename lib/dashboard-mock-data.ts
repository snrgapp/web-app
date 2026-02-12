// Datos mock para el dashboard - se conectarán a Supabase después

export interface AsistentesDataPoint {
  day: number
  value: number
}

export interface Segmento {
  name: string
  users: number
  color: string
}

export interface TotalEventos {
  online: number
  offline: number
}

export interface Patrocinador {
  name: string
  iconColor: string
}

// Total Asistentes: 30 días de datos (valor = cantidad de personas)
export const totalAsistentesData: AsistentesDataPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    day: i + 1,
    value: Math.min(80, Math.max(5, Math.floor(20 + Math.sin(i * 0.4) * 25 + (i % 5) * 8))),
  })
)

// Punto destacado para tooltip
export const asistentesHighlight = { day: 15, value: 45, month: "Enero" }

// Segmentos para el gráfico donut (users para lista, value para proporción del total)
export const segmentosData: Segmento[] = [
  { name: "Tecnología", users: 530, color: "#6d28d9" },
  { name: "Agencias", users: 100, color: "#8b5cf6" },
  { name: "Construcción", users: 70, color: "#a78bfa" },
]

// Total para el centro del donut (según imagen de referencia)
export const segmentosTotal = 5824213

// Total suma de eventos
export const totalEventosData: TotalEventos = {
  online: 179,
  offline: 394,
}

// Patrocinadores
export const patrocinadoresData: Patrocinador[] = [
  { name: "Foursquare", iconColor: "#ec4899" },
  { name: "Kickstarter", iconColor: "#10b981" },
]
