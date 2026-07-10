'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/store/onboarding'
import { validateProfile } from '@/lib/utils'
import { storePlan, storeProfile, storePlanId, clearStoredQuantities } from '@/lib/planStorage'
import { Leaf, AlertTriangle } from 'lucide-react'

export function StepGenerating() {
  const { data, setStep, reset } = useOnboardingStore()
  const [status, setStatus] = useState('Calculating your nutrition targets...')
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const router = useRouter()
  const hasCalled = useRef(false)

  useEffect(() => {
    const validationError = validateProfile(data)
    if (validationError) {
      setError(`Please complete your profile first (${validationError}). Going back...`)
      setTimeout(() => setStep(1), 2500)
      return
    }

    if (hasCalled.current) return
    hasCalled.current = true

    const generate = async () => {
      try {
        setStatus('Calculating your daily nutrition targets...')
        const metaRes = await fetch('/api/diet/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileData: data }),
        })
        if (!metaRes.ok) {
          const err = await metaRes.json()
          throw new Error(err.error || 'Failed to get nutrition targets')
        }
        const { meta } = await metaRes.json()

        setStatus('Building your Day 1 meal plan...')
        const dayRes = await fetch('/api/diet/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileData: data,
            dayNumber: 1,
            targets: {
              calories: meta.calorieTarget,
              protein: meta.proteinTarget,
              carbs: meta.carbsTarget,
              fat: meta.fatTarget,
            },
            previousFoods: [],
            saveToDb: false,
          }),
        })
        if (!dayRes.ok) {
          const err = await dayRes.json()
          throw new Error(err.error || 'Failed to generate Day 1')
        }
        const { day } = await dayRes.json()

        const plan = { ...meta, days: [day] }

        setStatus('Almost ready!')
        storePlan(plan)
        storeProfile(data)
        storePlanId(null)
        clearStoredQuantities()

        router.push('/diet')
        // Leave the store clean so the next "Generate New Diet Plan" starts
        // fresh at step 1 instead of re-running with this run's data.
        reset()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
      }
    }

    generate()
  }, [retryKey]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 bg-[#FDEDEC] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-[#C0392B]" />
        </div>
        <p className="text-[#C0392B] font-medium mb-2">Something went wrong</p>
        <p className="text-sm text-[#6B6760] mb-6 max-w-xs mx-auto">{error}</p>
        <button
          onClick={() => {
            hasCalled.current = false
            setError('')
            setRetryKey((k) => k + 1)
          }}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-[#D8F3DC] rounded-full flex items-center justify-center">
          <div className="w-16 h-16 bg-[#2D6A4F] rounded-full flex items-center justify-center animate-pulse">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className="absolute w-3 h-3 bg-[#52B788] rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateX(48px) translate(-50%, -50%)`,
              }}
            />
          ))}
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold text-[#1C1C1A] mb-2">
        Building your Day 1 plan
      </h2>
      <p className="text-[#6B6760] mb-6 max-w-xs text-sm">
        Hi <strong>{data.name}</strong>! We're generating your first day's meals.
        You can unlock more days from the plan page.
      </p>
      <p className="text-sm font-medium text-[#2D6A4F]">{status}</p>
      <p className="text-xs text-[#9E9A94] mt-8">Usually takes 10–15 seconds</p>
    </div>
  )
}
