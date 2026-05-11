'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DietHeader } from '@/components/diet/DietHeader'
import { DietDayTabs } from '@/components/diet/DietDayTabs'
import { DietMealCard } from '@/components/diet/DietMealCard'
import { LoginPromptOverlay } from '@/components/diet/LoginPromptOverlay'
import { DietOptimizeButton } from '@/components/diet/DietOptimizeButton'
import { DietSummaryBar } from '@/components/diet/DietSummaryBar'
import { Leaf, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DietPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [plan, setPlan] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [planId, setPlanId] = useState(null)
  const [activeDay, setActiveDay] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generatingDay, setGeneratingDay] = useState(false)
  const hasSaved = useRef(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('dietPlan')
    const profile = sessionStorage.getItem('userProfile')
    const id = sessionStorage.getItem('planId')

    if (!stored) {
      router.push('/onboarding')
      return
    }

    setPlan(JSON.parse(stored))
    if (profile) setUserProfile(JSON.parse(profile))
    if (id) setPlanId(id)
    setLoading(false)
  }, [])

  // Save plan to DB once when user logs in — no re-generation
  useEffect(() => {
    if (!session?.user || !plan || planId || hasSaved.current) return
    hasSaved.current = true

    fetch('/api/diet/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, profileData: userProfile }),
    })
      .then((r) => r.json())
      .then(({ planId: id }) => {
        if (id) {
          setPlanId(id)
          sessionStorage.setItem('planId', id)
        }
      })
      .catch(() => {})
  }, [session, plan])

  const handleGenerateNextDay = async () => {
    if (!plan || !userProfile || generatingDay) return
    const nextDayNumber = plan.days.length + 1
    if (nextDayNumber > 7) return

    setGeneratingDay(true)
    const toastId = toast.loading(`Generating Day ${nextDayNumber}...`)

    try {
      const previousFoods = plan.days.flatMap((d) =>
        d.meals.flatMap((m) => m.foods.map((f) => f.name))
      )

      const res = await fetch('/api/diet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileData: userProfile,
          dayNumber: nextDayNumber,
          calorieTarget: plan.calorieTarget,
          previousFoods,
          saveToDb: false,
        }),
      })

      if (!res.ok) throw new Error('Generation failed')
      const { day } = await res.json()

      const updatedPlan = { ...plan, days: [...plan.days, day] }
      setPlan(updatedPlan)
      sessionStorage.setItem('dietPlan', JSON.stringify(updatedPlan))
      setActiveDay(nextDayNumber - 1)
      toast.success(`Day ${nextDayNumber} ready!`, { id: toastId })
    } catch {
      toast.error('Failed to generate next day. Please try again.', { id: toastId })
    } finally {
      setGeneratingDay(false)
    }
  }

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#2D6A4F] rounded-full flex items-center justify-center animate-pulse">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <p className="text-[#6B6760] text-sm">Loading your plan...</p>
        </div>
      </div>
    )
  }

  const currentDay = plan.days[activeDay]
  const isLoggedIn = status === 'authenticated'
  const mealsToShow = isLoggedIn ? currentDay.meals : currentDay.meals.slice(0, 2)
  const hasMoreMeals = !isLoggedIn && currentDay.meals.length > 2
  const canGenerateMore = plan.days.length < 7
  const isViewingLastGeneratedDay = activeDay === plan.days.length - 1

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <DietHeader plan={plan} userProfile={userProfile} />

      <div className="max-w-3xl mx-auto px-4 pb-32">
        <DietDayTabs
          days={plan.days}
          totalDays={7}
          activeDay={activeDay}
          onDayChange={setActiveDay}
          isLoggedIn={isLoggedIn}
          generatingDay={generatingDay}
        />

        {currentDay.dailyTip && (
          <div className="mb-4 p-4 bg-[#FFF3CD] border border-[#D4A853]/30 rounded-xl flex gap-3 animate-fade-in">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-sm text-[#6B6760]">{currentDay.dailyTip}</p>
          </div>
        )}

        <DietSummaryBar day={currentDay} target={plan.calorieTarget} />

        <div className="space-y-4 mt-4">
          {mealsToShow.map((meal, idx) => (
            <div key={meal.mealId} className="animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <DietMealCard
                meal={meal}
                userProfile={userProfile}
                planId={planId}
                isLoggedIn={isLoggedIn}
              />
            </div>
          ))}
        </div>

        {hasMoreMeals && (
          <LoginPromptOverlay remainingMeals={currentDay.meals.length - 2} />
        )}

        {isViewingLastGeneratedDay && canGenerateMore && isLoggedIn && (
          <div className="mt-6 animate-slide-up">
            <button
              onClick={handleGenerateNextDay}
              disabled={generatingDay}
              className="w-full card p-5 flex items-center gap-4 border-2 border-dashed border-[#52B788]
                         hover:border-[#2D6A4F] hover:bg-[#D8F3DC]/30 transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              <div className="w-12 h-12 bg-[#D8F3DC] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#2D6A4F] transition-colors">
                {generatingDay
                  ? <Loader2 className="w-5 h-5 text-[#2D6A4F] animate-spin group-hover:text-white" />
                  : <ChevronRight className="w-5 h-5 text-[#2D6A4F] group-hover:text-white" />
                }
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#1C1C1A]">
                  {generatingDay ? `Generating Day ${plan.days.length + 1}...` : `Generate Day ${plan.days.length + 1}`}
                </p>
                <p className="text-sm text-[#6B6760]">
                  {generatingDay
                    ? 'Please wait, building your meals...'
                    : `${7 - plan.days.length} days remaining · Takes ~10 seconds`}
                </p>
              </div>
            </button>
          </div>
        )}

        {isViewingLastGeneratedDay && canGenerateMore && !isLoggedIn && (
          <div className="mt-6">
            <LoginPromptOverlay showDayPrompt={true} remainingDays={7 - plan.days.length} />
          </div>
        )}

        {plan.days.length === 7 && isViewingLastGeneratedDay && (
          <div className="mt-6 card p-5 text-center bg-[#D8F3DC] border-[#52B788]">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-display font-bold text-[#2D6A4F]">Full 7-day plan complete!</p>
            <p className="text-sm text-[#6B6760] mt-1">Use the optimize button below for any adjustments.</p>
          </div>
        )}

        {isLoggedIn && (
          <DietOptimizeButton plan={plan} userProfile={userProfile} />
        )}
      </div>
    </div>
  )
}
