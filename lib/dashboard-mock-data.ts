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

// Total Asistentes: 30 días de datos
export const totalAsistentesData: AsistentesDataPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    day: i + 1,
    value: Math.floor(150 + Math.sin(i * 0.3) * 200 + Math.random() * 150),
  })
)

// Punto destacado para tooltip (día 13, valor 350)
export const asistentesHighlight = { day: 13, value: 350, month: "Mayo" }

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
