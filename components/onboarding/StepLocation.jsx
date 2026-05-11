'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { useState } from 'react'
import { ChevronLeft, MapPin, Loader2, Plus, X } from 'lucide-react'

const DIET_TYPES = [
  { value: 'veg', label: '🥦 Vegetarian', desc: 'Plant-based, dairy & eggs OK' },
  { value: 'non-veg', label: '🍗 Non-Vegetarian', desc: 'All foods including meat & fish' },
  { value: 'vegan', label: '🌱 Vegan', desc: 'Strictly plant-based only' },
]

const COMMON_ALLERGIES = ['Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Shellfish', 'Tree Nuts', 'Soy', 'Sesame']

export function StepLocation() {
  const { data, updateData, setStep } = useOnboardingStore()
  const [locating, setLocating] = useState(false)
  const [newAllergy, setNewAllergy] = useState('')
  const [newDislike, setNewDislike] = useState('')
  const [errors, setErrors] = useState({})

  const getLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        updateData({ latitude, longitude })
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const geo = await res.json()
          const city = geo.address?.city || geo.address?.town || geo.address?.village || ''
          const country = geo.address?.country || 'India'
          updateData({ city, country, location: `${city}, ${country}` })
        } catch {
          // silently fail
        }
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const toggleAllergy = (a) => {
    const current = data.allergies || []
    updateData({
      allergies: current.includes(a) ? current.filter((x) => x !== a) : [...current, a],
    })
  }

  const addCustomAllergy = () => {
    if (newAllergy.trim()) {
      updateData({ allergies: [...(data.allergies || []), newAllergy.trim()] })
      setNewAllergy('')
    }
  }

  const addCustomDislike = () => {
    if (newDislike.trim()) {
      updateData({ dislikedFoods: [...(data.dislikedFoods || []), newDislike.trim()] })
      setNewDislike('')
    }
  }

  const validate = () => {
    const e = {}
    if (!data.city || !data.city.trim()) e.city = 'Please enter your city'
    if (!data.dietType) e.dietType = 'Please select your diet type'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleGenerate = () => {
    if (validate()) setStep(4)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#EBF5FB] rounded-2xl flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-[#2980B9]" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1C1C1A] mb-2">Location & Food Preferences</h1>
        <p className="text-[#6B6760]">We'll find local foods available in your area at affordable prices.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="label">Your City</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Chennai, Mumbai, Bangalore"
              className="input-field flex-1"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value, location: `${e.target.value}, ${data.country}` })}
            />
            <button
              onClick={getLocation}
              disabled={locating}
              className="btn-secondary py-3 px-4 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span className="text-sm hidden sm:inline">Auto-detect</span>
            </button>
          </div>
          {errors.city && <p className="text-[#C0392B] text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="label">Country</label>
          <input
            type="text"
            placeholder="India"
            className="input-field"
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Diet Type</label>
          <div className="space-y-2">
            {DIET_TYPES.map((d) => (
              <button
                key={d.value}
                onClick={() => updateData({ dietType: d.value })}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  data.dietType === d.value
                    ? 'border-[#2D6A4F] bg-[#D8F3DC]'
                    : 'border-[#E4E0D8] bg-white hover:border-[#52B788]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                  data.dietType === d.value ? 'border-[#2D6A4F] bg-[#2D6A4F]' : 'border-[#E4E0D8]'
                }`} />
                <div>
                  <p className="text-sm font-semibold">{d.label}</p>
                  <p className="text-xs text-[#6B6760]">{d.desc}</p>
                </div>
              </button>
            ))}
          </div>
          {errors.dietType && <p className="text-[#C0392B] text-xs mt-1">{errors.dietType}</p>}
        </div>

        <div>
          <label className="label">Daily Food Budget (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9A94] font-medium">₹</span>
            <input
              type="number"
              placeholder="200"
              className="input-field pl-8"
              value={data.budgetPerDay || ''}
              onChange={(e) => updateData({ budgetPerDay: Number(e.target.value) })}
            />
          </div>
          <p className="text-xs text-[#9E9A94] mt-1">Approximate daily spending on food ingredients</p>
        </div>

        <div>
          <label className="label">Allergies & Restrictions</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COMMON_ALLERGIES.map((a) => (
              <button
                key={a}
                onClick={() => toggleAllergy(a)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  (data.allergies || []).includes(a)
                    ? 'bg-[#FDEDEC] border-[#C0392B] text-[#C0392B]'
                    : 'bg-white border-[#E4E0D8] text-[#6B6760] hover:border-[#C0392B]'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom allergy..."
              className="input-field flex-1 text-sm"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomAllergy()}
            />
            <button onClick={addCustomAllergy} className="btn-ghost px-3">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {data.allergies && data.allergies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.allergies.map((a) => (
                <span key={a} className="badge badge-red gap-1 flex items-center">
                  {a}
                  <button onClick={() => updateData({ allergies: data.allergies.filter((x) => x !== a) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="label">Foods You Dislike (Optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Bitter gourd, Brussels sprouts..."
              className="input-field flex-1 text-sm"
              value={newDislike}
              onChange={(e) => setNewDislike(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomDislike()}
            />
            <button onClick={addCustomDislike} className="btn-ghost px-3">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {data.dislikedFoods && data.dislikedFoods.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.dislikedFoods.map((f) => (
                <span key={f} className="badge badge-amber gap-1 flex items-center">
                  {f}
                  <button onClick={() => updateData({ dislikedFoods: data.dislikedFoods.filter((x) => x !== f) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleGenerate}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-base"
          >
            ✨ Generate My Diet Plan
          </button>
        </div>
      </div>
    </div>
  )
}
