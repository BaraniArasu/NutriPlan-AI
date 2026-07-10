'use client'

import { formatCurrency } from '@/lib/utils'
import { Pencil } from 'lucide-react'

export function DietSummaryBar({ plan, day, onEditTargets }) {
  const pct = Math.min(100, Math.round((day.totalCalories / plan.calorieTarget) * 100))

  const stats = [
    { label: 'Calories', value: day.totalCalories, target: plan.calorieTarget, unit: '', color: '#2D6A4F' },
    { label: 'Protein', value: day.totalProtein, target: plan.proteinTarget, unit: 'g', color: '#2980B9' },
    { label: 'Carbs', value: day.totalCarbs, target: plan.carbsTarget, unit: 'g', color: '#D4A853' },
    { label: 'Fat', value: day.totalFat, target: plan.fatTarget, unit: 'g', color: '#E67E22' },
  ]

  const barColor = pct > 110 ? '#C0392B' : pct < 80 ? '#E67E22' : undefined

  return (
    <div className="card p-4 mb-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[#6B6760] uppercase tracking-wide">Daily Summary</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9E9A94]">{pct}% of target</span>
          {onEditTargets && (
            <button
              onClick={onEditTargets}
              className="flex items-center gap-1 text-xs font-medium text-[#2D6A4F] hover:underline"
              aria-label="Edit nutrient targets"
            >
              <Pencil className="w-3 h-3" />
              Edit targets
            </button>
          )}
        </div>
      </div>
      <div className="progress-bar mb-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {stats.map((s) => {
          const macroPct = s.target ? Math.round((s.value / s.target) * 100) : null
          return (
            <div key={s.label} className="text-center">
              <p className="text-xs font-bold" style={{ color: s.color }}>
                {s.value}{s.unit}
                {s.target ? <span className="font-normal text-[#9E9A94]"> / {s.target}{s.unit}</span> : null}
              </p>
              <p className="text-[10px] text-[#9E9A94] mt-0.5">
                {s.label}{macroPct !== null ? ` · ${macroPct}%` : ''}
              </p>
            </div>
          )
        })}
        <div className="text-center">
          <p className="text-xs font-bold" style={{ color: '#8E44AD' }}>{formatCurrency(day.totalPrice)}</p>
          <p className="text-[10px] text-[#9E9A94] mt-0.5">Cost</p>
        </div>
      </div>
    </div>
  )
}
