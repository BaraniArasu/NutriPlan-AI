'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { useState } from 'react'
import { ChevronRight, ChevronLeft, Target, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { getTimelineWarning } from '@/lib/utils'

const GOALS = [
  { value: 'weight_loss', label: 'Lose Weight', emoji: '🔥', desc: 'Burn fat, reduce body weight' },
  { value: 'weight_gain', label: 'Gain Weight', emoji: '💪', desc: 'Build muscle, increase mass' },
  { value: 'maintain', label: 'Maintain Weight', emoji: '⚖️', desc: 'Stay fit, eat healthy' },
]

const TIMELINE_OPTIONS = [4, 8, 12, 16, 20, 24]

export function StepGoals() {
  const { data, updateData, setStep } = useOnboardingStore()
  const [errors, setErrors] = useState({})

  const warning = data.currentWeight && data.targetWeight && data.timelineWeeks
    ? getTimelineWarning(data.currentWeight, data.targetWeight, data.timelineWeeks)
    : null

  const weightDiff = data.targetWeight && data.currentWeight
    ? (data.targetWeight - data.currentWeight).toFixed(1)
    : null

  const validate = () => {
    const e = {}
    if (!data.goal) e.goal = 'Please select a goal'
    if (!data.targetWeight || data.targetWeight < 20) e.targetWeight = 'Enter a valid target weight'
    if (!data.timelineWeeks) e.timelineWeeks = 'Please select a timeline'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep(3)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#FFF3CD] rounded-2xl flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-[#D4A853]" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1C1C1A] mb-2">What's your goal?</h1>
        <p className="text-[#6B6760]">We'll build a safe, effective plan to get you there.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="label">Primary Goal</label>
          <div className="grid grid-cols-3 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => updateData({ goal: g.value })}
                className={`flex flex-col items-center p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  data.goal === g.value
                    ? 'border-[#2D6A4F] bg-[#D8F3DC]'
                    : 'border-[#E4E0D8] bg-white hover:border-[#52B788]'
                }`}
              >
                <span className="text-2xl mb-1">{g.emoji}</span>
                <span className="text-xs font-bold text-[#1C1C1A]">{g.label}</span>
                <span className="text-[10px] text-[#6B6760] mt-0.5">{g.desc}</span>
              </button>
            ))}
          </div>
          {errors.goal && <p className="text-[#C0392B] text-xs mt-1">{errors.goal}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Current Weight (kg)</label>
            <div className="relative">
              <input
                type="number"
                className="input-field pr-10"
                value={data.currentWeight || data.weight || ''}
                onChange={(e) => updateData({ currentWeight: Number(e.target.value), weight: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9A94] font-medium">kg</span>
            </div>
          </div>
          <div>
            <label className="label">Target Weight (kg)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 65"
                className="input-field pr-10"
                value={data.targetWeight || ''}
                onChange={(e) => updateData({ targetWeight: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9A94] font-medium">kg</span>
            </div>
            {errors.targetWeight && <p className="text-[#C0392B] text-xs mt-1">{errors.targetWeight}</p>}
          </div>
        </div>

        {weightDiff && (
          <div className={`flex items-center gap-3 p-3.5 rounded-xl ${
            Number(weightDiff) < 0 ? 'bg-[#D8F3DC]' : Number(weightDiff) > 0 ? 'bg-[#FFF3CD]' : 'bg-[#F2F0EB]'
          }`}>
            {Number(weightDiff) < 0
              ? <TrendingDown className="w-5 h-5 text-[#2D6A4F]" />
              : Number(weightDiff) > 0
              ? <TrendingUp className="w-5 h-5 text-[#D4A853]" />
              : <Minus className="w-5 h-5 text-[#6B6760]" />}
            <p className="text-sm font-medium text-[#1C1C1A]">
              {Number(weightDiff) < 0
                ? `Lose ${Math.abs(Number(weightDiff))} kg total`
                : Number(weightDiff) > 0
                ? `Gain ${weightDiff} kg total`
                : 'Maintain current weight'}
            </p>
          </div>
        )}

        <div>
          <label className="label">Timeline (weeks)</label>
          <div className="grid grid-cols-3 gap-2">
            {TIMELINE_OPTIONS.map((weeks) => (
              <button
                key={weeks}
                onClick={() => updateData({ timelineWeeks: weeks })}
                className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                  data.timelineWeeks === weeks
                    ? 'border-[#2D6A4F] bg-[#D8F3DC] text-[#2D6A4F]'
                    : 'border-[#E4E0D8] bg-white hover:border-[#52B788] text-[#1C1C1A]'
                }`}
              >
                {weeks}w
                <span className="block text-[10px] text-[#6B6760] font-normal">
                  {weeks <= 8 ? '~2 months' : weeks <= 16 ? '~4 months' : '~6 months'}
                </span>
              </button>
            ))}
          </div>
          {errors.timelineWeeks && <p className="text-[#C0392B] text-xs mt-1">{errors.timelineWeeks}</p>}
        </div>

        {warning && (
          <div className={`p-4 rounded-xl border-2 ${warning.safe ? 'border-[#2D6A4F] bg-[#D8F3DC]' : 'border-[#E67E22] bg-[#FEF9E7]'} animate-scale-in`}>
            <div className="flex items-start gap-3">
              {warning.safe
                ? <CheckCircle className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                : <AlertTriangle className="w-5 h-5 text-[#E67E22] shrink-0 mt-0.5" />}
              <p className="text-sm text-[#1C1C1A] leading-relaxed">{warning.message}</p>
            </div>
          </div>
        )}

        {data.currentWeight && data.targetWeight && data.timelineWeeks && (
          <div className="card p-4 bg-[#F2F0EB]">
            <p className="text-xs text-[#6B6760] font-medium uppercase tracking-wide mb-2">Your Plan Summary</p>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B6760]">Weekly change needed</span>
              <span className="font-bold text-[#1C1C1A]">
                {Math.abs((data.targetWeight - data.currentWeight) / data.timelineWeeks).toFixed(2)} kg/week
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#6B6760]">Daily calorie adjustment</span>
              <span className="font-bold text-[#1C1C1A]">
                ~{Math.round(Math.abs((data.targetWeight - data.currentWeight) / data.timelineWeeks) * 7700 / 7)} kcal/day
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2 py-4">
            Continue to Food Preferences
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
