'use client'

import { useState } from 'react'
import { X, RotateCcw, Target } from 'lucide-react'
import { calculateNutritionTargets } from '@/lib/nutrition'

const FIELDS = [
  { key: 'calorieTarget', label: 'Calories', unit: 'kcal', min: 800, max: 6000 },
  { key: 'proteinTarget', label: 'Protein', unit: 'g', min: 20, max: 400 },
  { key: 'carbsTarget', label: 'Carbs', unit: 'g', min: 0, max: 800 },
  { key: 'fatTarget', label: 'Fat', unit: 'g', min: 10, max: 300 },
  { key: 'waterIntake', label: 'Water', unit: 'L', min: 1, max: 8, step: 0.1 },
]

export function EditTargetsModal({ plan, userProfile, onSave, onClose }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(FIELDS.map((f) => [f.key, plan[f.key] ?? '']))
  )
  const [errors, setErrors] = useState({})

  const setField = (key, raw) => {
    setValues((v) => ({ ...v, [key]: raw }))
  }

  const resetToRecommended = () => {
    if (!userProfile) return
    const computed = calculateNutritionTargets(userProfile)
    setValues({
      calorieTarget: computed.calorieTarget,
      proteinTarget: computed.proteinTarget,
      carbsTarget: computed.carbsTarget,
      fatTarget: computed.fatTarget,
      waterIntake: computed.waterIntake,
    })
    setErrors({})
  }

  const handleSave = () => {
    const parsed = {}
    const errs = {}
    for (const f of FIELDS) {
      const n = Number(values[f.key])
      if (!Number.isFinite(n) || n < f.min || n > f.max) {
        errs[f.key] = `${f.min}–${f.max} ${f.unit}`
      } else {
        parsed[f.key] = f.step ? Math.round(n * 10) / 10 : Math.round(n)
      }
    }
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSave(parsed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-slide-up">
        <div className="flex items-start justify-between p-5 border-b border-[#E4E0D8]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#2D6A4F]" />
              <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wide">Daily Targets</p>
            </div>
            <h3 className="font-display text-xl font-bold text-[#1C1C1A]">Edit your nutrient goals</h3>
            <p className="text-sm text-[#6B6760]">New days you generate will aim at these targets.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F0EB] flex items-center justify-center hover:bg-[#E4E0D8] transition-colors ml-2 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#6B6760]" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label htmlFor={`target-${f.key}`} className="block text-sm font-medium text-[#1C1C1A] mb-1">
                {f.label} <span className="text-[#9E9A94] font-normal">({f.unit})</span>
              </label>
              <input
                id={`target-${f.key}`}
                type="number"
                inputMode="decimal"
                min={f.min}
                max={f.max}
                step={f.step || 1}
                className="input-field w-full text-sm"
                value={values[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
              />
              {errors[f.key] && (
                <p className="text-xs text-[#C0392B] mt-1">Enter a value between {errors[f.key]}</p>
              )}
            </div>
          ))}

          {userProfile && (
            <button
              onClick={resetToRecommended}
              className="btn-ghost text-xs flex items-center gap-1.5 py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to recommended (calculated from your profile)
            </button>
          )}
        </div>

        <div className="p-4 border-t border-[#E4E0D8] flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1 py-3 text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex-1 py-3 text-sm">
            Save Targets
          </button>
        </div>
      </div>
    </div>
  )
}
