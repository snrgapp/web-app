'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import { totalAsistentesData, asistentesHighlight } from '@/lib/dashboard-mock-data'

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-zinc-200 p-3">
      <p className="text-xs text-zinc-400 mb-1">Este Mes</p>
      <p className="text-2xl font-hero text-black">{payload[0].value}</p>
      <p className="text-xs text-zinc-400">{asistentesHighlight.month}</p>
    </div>
  )
}

export function TotalAsistentesChart() {
  const highlightPoint = totalAsistentesData.find(
    (d) => d.day === asistentesHighlight.day
  )

  return (
    <div className="h-[280px] min-h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={totalAsistentesData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            domain={[1, 30]}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            domain={[100, 800]}
            tickFormatter={(v) => v.toString()}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a1a1aa', strokeDasharray: '4 4' }} />
          <ReferenceLine
            x={asistentesHighlight.day}
            stroke="#a1a1aa"
            strokeDasharray="4 4"
          />
          <ReferenceDot
            x={asistentesHighlight.day}
            y={highlightPoint?.value ?? asistentesHighlight.value}
            r={4}
            fill="#8b5cf6"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#8b5cf6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
