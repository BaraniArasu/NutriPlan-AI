'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { useState } from 'react'
import { ChevronRight, Ruler, User } from 'lucide-react'

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise, desk job' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1–3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3–5 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6–7 days/week' },
  { value: 'extra_active', label: 'Extra Active', desc: 'Very hard exercise + physical job' },
]

export function StepPersonalInfo() {
  const { data, updateData, setStep } = useOnboardingStore()
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!data.name || !data.name.trim()) e.name = 'Name is required'
    if (!data.age || data.age < 10 || data.age > 100) e.age = 'Enter a valid age (10–100)'
    if (!data.gender) e.gender = 'Please select your gender'
    if (!data.weight || data.weight < 20 || data.weight > 300) e.weight = 'Enter a valid weight'
    if (!data.height || data.height < 100 || data.height > 250) e.height = 'Enter a valid height (cm)'
    if (!data.activityLevel) e.activityLevel = 'Please select your activity level'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep(2)
  }

  const measurements = [
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist' },
    { key: 'hips', label: 'Hips' },
    { key: 'arms', label: 'Arms' },
    { key: 'thighs', label: 'Thighs' },
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mb-4">
          <User className="w-6 h-6 text-[#2D6A4F]" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1C1C1A] mb-2">Tell us about yourself</h1>
        <p className="text-[#6B6760]">This helps us calculate your exact calorie and nutrient targets.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="label">Your Name</label>
          <input
            type="text"
            placeholder="e.g. Arjun Kumar"
            className="input-field"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
          {errors.name && <p className="text-[#C0392B] text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Age</label>
            <input
              type="number"
              placeholder="25"
              className="input-field"
              value={data.age || ''}
              onChange={(e) => updateData({ age: Number(e.target.value) })}
            />
            {errors.age && <p className="text-[#C0392B] text-xs mt-1">{errors.age}</p>}
          </div>
          <div>
            <label className="label">Gender</label>
            <select
              className="input-field"
              value={data.gender}
              onChange={(e) => updateData({ gender: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-[#C0392B] text-xs mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Current Weight (kg)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="70"
                className="input-field pr-10"
                value={data.weight || ''}
                onChange={(e) => updateData({ weight: Number(e.target.value), currentWeight: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9A94] font-medium">kg</span>
            </div>
            {errors.weight && <p className="text-[#C0392B] text-xs mt-1">{errors.weight}</p>}
          </div>
          <div>
            <label className="label">Height (cm)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="170"
                className="input-field pr-10"
                value={data.height || ''}
                onChange={(e) => updateData({ height: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9A94] font-medium">cm</span>
            </div>
            {errors.height && <p className="text-[#C0392B] text-xs mt-1">{errors.height}</p>}
          </div>
        </div>

        <div>
          <label className="label">Activity Level</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => updateData({ activityLevel: level.value })}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                  data.activityLevel === level.value
                    ? 'border-[#2D6A4F] bg-[#D8F3DC]'
                    : 'border-[#E4E0D8] bg-white hover:border-[#52B788]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${
                  data.activityLevel === level.value
                    ? 'border-[#2D6A4F] bg-[#2D6A4F]'
                    : 'border-[#E4E0D8]'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1A]">{level.label}</p>
                  <p className="text-xs text-[#6B6760]">{level.desc}</p>
                </div>
              </button>
            ))}
          </div>
          {errors.activityLevel && <p className="text-[#C0392B] text-xs mt-1">{errors.activityLevel}</p>}
        </div>

        <div className="card p-4">
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className="w-full flex items-center justify-between text-sm font-medium text-[#2D6A4F]"
          >
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Body Measurements (Optional)
            </div>
            <span className="text-[#9E9A94] text-xs">{showMeasurements ? 'Hide' : 'Add for better tracking'}</span>
          </button>

          {showMeasurements && (
            <div className="mt-4 grid grid-cols-2 gap-3 animate-fade-in">
              {measurements.map(({ key, label }) => (
                <div key={key}>
                  <label className="label">{label} (cm)</label>
                  <input
                    type="number"
                    placeholder="—"
                    className="input-field"
                    value={data[key] || ''}
                    onChange={(e) => updateData({ [key]: Number(e.target.value) || null })}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
          Continue to Goals
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
