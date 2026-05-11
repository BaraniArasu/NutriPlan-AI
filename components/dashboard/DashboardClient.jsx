'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency, calculateBMI, getBMICategory } from '@/lib/utils'
import { Leaf, Plus, LogOut, Calendar, Target, Scale, Activity, ChevronRight, Clock, User } from 'lucide-react'
import { format } from 'date-fns'

export function DashboardClient({ user, profile, plans }) {
  const router = useRouter()

  const bmi = profile ? Number(calculateBMI(profile.weight, profile.height)) : null
  const bmiInfo = bmi ? getBMICategory(bmi) : null
  const weightDiff = profile ? (profile.targetWeight - profile.weight).toFixed(1) : null

  const goalLabel = {
    weight_loss: '🔥 Weight Loss',
    weight_gain: '💪 Weight Gain',
    maintain: '⚖️ Maintain',
  }[profile?.goal || ''] || '—'

  const activityLabel = {
    sedentary: 'Sedentary',
    lightly_active: 'Lightly Active',
    moderately_active: 'Moderately Active',
    very_active: 'Very Active',
    extra_active: 'Extra Active',
  }[profile?.activityLevel || ''] || '—'

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <header className="bg-white border-b border-[#E4E0D8] sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-[#1C1C1A] hidden sm:block">NutriPlan AI</span>
          </Link>
          <div className="flex items-center gap-3">
            {user.image ? (
              <Image src={user.image} alt={user.name || ''} width={32} height={32} className="rounded-full border-2 border-[#E4E0D8]" />
            ) : (
              <div className="w-8 h-8 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#2D6A4F]" />
              </div>
            )}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost py-2 px-2 text-xs flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="animate-slide-up">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1C1C1A]">
            Hello, {user.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-[#6B6760] mt-1">
            {profile
              ? `${profile.city}, ${profile.country} · ${profile.dietType === 'veg' ? '🥦 Vegetarian' : profile.dietType === 'vegan' ? '🌱 Vegan' : '🍗 Non-Vegetarian'}`
              : 'Set up your profile to get started'}
          </p>
        </div>

        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '80ms' }}>
            <div className="card p-4 text-center">
              <Scale className="w-5 h-5 text-[#2D6A4F] mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-[#1C1C1A]">{profile.weight} kg</p>
              <p className="text-xs text-[#9E9A94]">Current</p>
            </div>
            <div className="card p-4 text-center">
              <Target className="w-5 h-5 text-[#D4A853] mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-[#1C1C1A]">{profile.targetWeight} kg</p>
              <p className="text-xs text-[#9E9A94]">Target</p>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl mx-auto mb-1 text-center">
                {bmi && bmi < 18.5 ? '📉' : bmi && bmi < 25 ? '✅' : bmi && bmi < 30 ? '⚠️' : '🔴'}
              </div>
              <p className={`font-display text-xl font-bold ${bmiInfo?.color || 'text-[#1C1C1A]'}`}>{bmi}</p>
              <p className="text-xs text-[#9E9A94]">BMI · {bmiInfo?.label}</p>
            </div>
            <div className="card p-4 text-center">
              <Activity className="w-5 h-5 text-[#2980B9] mx-auto mb-2" />
              <p className="font-display text-base font-bold text-[#1C1C1A] leading-tight">{activityLabel}</p>
              <p className="text-xs text-[#9E9A94]">Activity</p>
            </div>
          </div>
        )}

        {profile && weightDiff && (
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-[#1C1C1A]">Goal Progress</h2>
              <span className="badge badge-green">{goalLabel}</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-[#9E9A94] mb-1">
                  <span>{profile.weight} kg</span>
                  <span>{profile.targetWeight} kg</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.max(5, Math.min(95, 20))}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[#F2F0EB] rounded-xl p-3">
                <p className="text-xs text-[#9E9A94] mb-1">To {profile.goal === 'weight_loss' ? 'lose' : 'gain'}</p>
                <p className="font-bold text-[#1C1C1A]">{Math.abs(Number(weightDiff))} kg</p>
              </div>
              <div className="bg-[#F2F0EB] rounded-xl p-3">
                <p className="text-xs text-[#9E9A94] mb-1">Timeline</p>
                <p className="font-bold text-[#1C1C1A]">{profile.timelineWeeks} weeks</p>
              </div>
              <div className="bg-[#F2F0EB] rounded-xl p-3">
                <p className="text-xs text-[#9E9A94] mb-1">Daily budget</p>
                <p className="font-bold text-[#1C1C1A]">{formatCurrency(profile.budgetPerDay)}</p>
              </div>
              <div className="bg-[#F2F0EB] rounded-xl p-3">
                <p className="text-xs text-[#9E9A94] mb-1">Weekly target</p>
                <p className="font-bold text-[#1C1C1A]">
                  {Math.abs(Number(weightDiff) / profile.timelineWeeks).toFixed(2)} kg/wk
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push('/onboarding')}
          className="w-full card-hover p-5 flex items-center gap-4 text-left animate-slide-up"
          style={{ animationDelay: '160ms' }}
        >
          <div className="w-12 h-12 bg-[#D8F3DC] rounded-2xl flex items-center justify-center shrink-0">
            <Plus className="w-6 h-6 text-[#2D6A4F]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#1C1C1A]">Generate New Diet Plan</p>
            <p className="text-sm text-[#6B6760]">Create a fresh 7-day personalized plan</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9E9A94]" />
        </button>

        {plans.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-[#1C1C1A]">Your Diet Plans</h2>
              <span className="text-xs text-[#9E9A94]">{plans.length} plan{plans.length > 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {plans.map((p) => (
                <div key={p.id} className="card-hover p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F2F0EB] rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#6B6760]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1C1C1A] text-sm truncate">{p.title}</p>
                    <p className="text-xs text-[#9E9A94] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {format(new Date(p.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {p.isActive && <span className="badge badge-green shrink-0">Active</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {plans.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-[#9E9A94]" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1C1C1A] mb-2">No plans yet</h3>
            <p className="text-[#6B6760] text-sm mb-6">Generate your first personalized diet plan to get started.</p>
            <button onClick={() => router.push('/onboarding')} className="btn-primary">
              Create My First Plan
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
