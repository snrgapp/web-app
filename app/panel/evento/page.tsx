'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { Users, Zap, MessageCircle, Star, RefreshCw, TrendingUp } from 'lucide-react'
import { getGeniusDashboardData } from '@/app/actions/genius-networking'

type DashData = Awaited<ReturnType<typeof getGeniusDashboardData>>

const ARCHETYPE_COLORS: Record<string, string> = {
  'El líder que quiere mover la aguja': '#ed702d',
  'El creador de futuro': '#41df82',
  'El explorador tech': '#dfff00',
  'El conector estratégico': '#694aff',
  'La tejedor/a de transformación territorial': '#fe82f2',
}

const ARCHETYPE_SHORT: Record<string, string> = {
  'El líder que quiere mover la aguja': 'Líder',
  'El creador de futuro': 'Creador',
  'El explorador tech': 'Tech',
  'El conector estratégico': 'Conector',
  'La tejedor/a de transformación territorial': 'Tejedor/a',
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 shadow-[4px_4px_0]"
      style={{ boxShadow: `4px 4px 0 ${color}55` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border"
          style={{ background: `${color}22`, borderColor: `${color}44`, color }}
        >
          <Icon size={20} />
        </div>
        <span
          className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          en vivo
        </span>
      </div>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-white/65">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-white/35">{sub}</p>}
    </motion.div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/12 bg-[#242424] px-3 py-2 text-xs text-white shadow-lg">
      <p className="mb-1 font-medium text-white/55">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: p.color ?? '#fff' }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function GeniusEventoDashboard() {
  const [data, setData] = useState<DashData>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    const d = await getGeniusDashboardData()
    setData(d)
    setLastUpdate(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [fetchData])

  const arquetiposData = data
    ? Object.entries(data.arquetipos).map(([name, count]) => ({
        name: ARCHETYPE_SHORT[name] ?? name,
        fullName: name,
        count,
        color: ARCHETYPE_COLORS[name] ?? '#694aff',
      }))
    : []

  const conexionesData = [
    { name: 'Ninguna', value: data?.conexionesDist[0] ?? 0, color: '#ffffff33' },
    { name: '1 persona', value: data?.conexionesDist[1] ?? 0, color: '#41df82' },
    { name: '2 personas', value: data?.conexionesDist[2] ?? 0, color: '#694aff' },
    { name: '3 o más', value: data?.conexionesDist[3] ?? 0, color: '#fe82f2' },
  ]

  const rondasData = [
    {
      ronda: 'Mañana',
      Matches: data?.matchesPorRonda[1] ?? 0,
      'Clicks WA': data?.clicksPorRonda[1] ?? 0,
    },
    {
      ronda: 'Tarde',
      Matches: data?.matchesPorRonda[2] ?? 0,
      'Clicks WA': data?.clicksPorRonda[2] ?? 0,
    },
  ]

  const registrosPorHoraData = data
    ? Object.entries(data.registrosPorHora)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([hora, count]) => ({
          hora: new Date(hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          Registros: count,
        }))
    : []

  return (
    <div className="min-h-screen bg-[#161616] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p
            className="text-[0.65rem] uppercase tracking-[0.18em] text-white/40"
            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            Panel · Genius FEST 2026
          </p>
          <h1
            className="mt-1 text-2xl font-black text-white sm:text-3xl"
            style={{ fontFamily: 'var(--font-fraunces-genius), serif' }}
          >
            Dashboard del Evento
          </h1>
          {lastUpdate && (
            <p className="mt-1 text-xs text-white/30">
              Actualizado: {lastUpdate.toLocaleTimeString('es-CO')} · auto-refresh 30s
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={fetchData}
          className="flex items-center gap-2 self-start rounded-xl border border-white/12 bg-[#1c1c1c] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-white/65 transition hover:border-white/25 hover:text-white sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </motion.div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#694aff]" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={Users}
              label="Registrados"
              value={data?.totalRegistros ?? 0}
              sub="formulario completo"
              color="#694aff"
              delay={0}
            />
            <StatCard
              icon={TrendingUp}
              label="Matches generados"
              value={data?.totalMatches ?? 0}
              sub={`Mañana ${data?.matchesPorRonda[1] ?? 0} · Tarde ${data?.matchesPorRonda[2] ?? 0}`}
              color="#41df82"
              delay={0.07}
            />
            <StatCard
              icon={MessageCircle}
              label="Clicks WhatsApp"
              value={data?.totalWaClicks ?? 0}
              sub={`Mañana ${data?.clicksPorRonda[1] ?? 0} · Tarde ${data?.clicksPorRonda[2] ?? 0}`}
              color="#fe82f2"
              delay={0.14}
            />
            <StatCard
              icon={Star}
              label="Rating promedio"
              value={
                data?.avgRating != null ? `${data.avgRating.toFixed(1)} ★` : '—'
              }
              sub={`${data?.totalFeedbacks ?? 0} respuestas`}
              color="#ed702d"
              delay={0.21}
            />
          </div>

          {/* Gráficos fila 1 */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Registros por hora */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5"
            >
              <p className="mb-4 text-sm font-semibold text-white">Registros por hora</p>
              {registrosPorHoraData.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm text-white/30">
                  Sin datos aún
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={registrosPorHoraData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="hora" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="Registros"
                      stroke="#694aff"
                      strokeWidth={2.5}
                      dot={{ fill: '#694aff', r: 4 }}
                      activeDot={{ r: 6, fill: '#fe82f2' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Arquetipos */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5"
            >
              <p className="mb-4 text-sm font-semibold text-white">Distribución de arquetipos</p>
              {arquetiposData.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm text-white/30">
                  Sin datos aún
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={arquetiposData} layout="vertical" margin={{ left: 4, right: 16 }}>
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                      width={72}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Personas" radius={[0, 6, 6, 0]}>
                      {arquetiposData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* Gráficos fila 2 */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Matches y WA clicks por ronda */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5"
            >
              <p className="mb-4 text-sm font-semibold text-white">Matches vs. WhatsApp por ronda</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rondasData} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="ronda" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{value}</span>
                    )}
                  />
                  <Bar dataKey="Matches" fill="#694aff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Clicks WA" fill="#41df82" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Conexiones declaradas */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.49 }}
              className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">¿Con cuántas personas conectaron?</p>
                {data?.avgConexiones != null && (
                  <span className="rounded-lg border border-white/10 bg-[#694aff]/20 px-2.5 py-1 text-xs font-bold text-[#694aff]">
                    Prom: {data.avgConexiones.toFixed(1)}
                  </span>
                )}
              </div>
              {conexionesData.every((d) => d.value === 0) ? (
                <div className="flex h-48 items-center justify-center text-sm text-white/30">
                  Sin respuestas aún
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={conexionesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {conexionesData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
