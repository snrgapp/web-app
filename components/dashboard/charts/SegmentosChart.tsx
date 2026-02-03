'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { segmentosData, segmentosTotal } from '@/lib/dashboard-mock-data'

// Proporciones basadas en users (530:100:70)
const totalUsers = segmentosData.reduce((acc, s) => acc + s.users, 0)
const chartData = segmentosData.map((s) => ({
  name: s.name,
  value: Math.round((s.users / totalUsers) * segmentosTotal),
  color: s.color,
}))

export function SegmentosChart() {

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      <div className="relative w-48 h-48 min-h-[192px] flex-shrink-0">
        <ResponsiveContainer width={192} height={192}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-hero text-black">
            {segmentosTotal.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-400">Label</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        {segmentosData.map((segmento) => (
          <div key={segmento.name} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: segmento.color }}
            />
            <span className="text-sm text-zinc-600 truncate">{segmento.name}</span>
            <span className="text-sm font-medium text-zinc-900 ml-auto">
              {segmento.users} users
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
