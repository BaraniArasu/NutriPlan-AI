'use client'

import { formatCurrency } from '@/lib/utils'

export function DietSummaryBar({ day, target }) {
  const pct = Math.min(100, Math.round((day.totalCalories / target) * 100))

  const stats = [
    { label: 'Calories', value: `${day.totalCalories} kcal`, color: '#2D6A4F' },
    { label: 'Protein', value: `${day.totalProtein}g`, color: '#2980B9' },
    { label: 'Carbs', value: `${day.totalCarbs}g`, color: '#D4A853' },
    { label: 'Fat', value: `${day.totalFat}g`, color: '#E67E22' },
    { label: 'Cost', value: formatCurrency(day.totalPrice), color: '#8E44AD' },
  ]

  const barColor = pct > 110 ? '#C0392B' : pct < 80 ? '#E67E22' : undefined

  return (
    <div className="card p-4 mb-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[#6B6760] uppercase tracking-wide">Daily Summary</p>
        <span className="text-xs text-[#9E9A94]">{pct}% of target</span>
      </div>
      <div className="progress-bar mb-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xs font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#9E9A94] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
