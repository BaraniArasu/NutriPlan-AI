'use client'

import { signIn } from 'next-auth/react'
import { Lock, Star, ChevronRight } from 'lucide-react'


export function LoginPromptOverlay({ remainingMeals = 0, showDayPrompt = false, remainingDays = 0 }) {
  // Day prompt: nudge to sign in to unlock more days
  if (showDayPrompt) {
    return (
      <div className="card p-5 border-2 border-dashed border-[#52B788] text-center animate-scale-in">
        <div className="w-12 h-12 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6 text-[#2D6A4F]" />
        </div>
        <h3 className="font-display text-lg font-bold text-[#1C1C1A] mb-1">
          {remainingDays} more days waiting
        </h3>
        <p className="text-sm text-[#6B6760] mb-4">
          Sign in to generate Day {8 - remainingDays} and unlock the rest of your 7-day plan.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/diet' })}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          Sign in with Google
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-[#9E9A94] mt-3 flex items-center justify-center gap-1">
          <Star className="w-3 h-3 text-[#D4A853] fill-current" />
          Free · No credit card needed
        </p>
      </div>
    )
  }

  // Meal prompt: blur overlay over locked meals
  return (
    <div className="relative mt-2">
      {/* Blurred skeleton cards */}
      <div className="space-y-4 blur-sm pointer-events-none opacity-50">
        {Array.from({ length: Math.min(remainingMeals, 2) }).map((_, i) => (
          <div key={i} className="meal-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#F2F0EB] rounded-xl" />
              <div>
                <div className="w-24 h-4 bg-[#F2F0EB] rounded mb-1" />
                <div className="w-16 h-3 bg-[#F2F0EB] rounded" />
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-[#F2F0EB]">
                  <div>
                    <div className="w-32 h-4 bg-[#F2F0EB] rounded mb-1" />
                    <div className="w-48 h-3 bg-[#F2F0EB] rounded" />
                  </div>
                  <div className="w-20 h-8 bg-[#F2F0EB] rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 text-center max-w-sm w-full border border-[#E4E0D8] animate-scale-in">
          <div className="w-14 h-14 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#2D6A4F]" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#1C1C1A] mb-2">
            {remainingMeals} more meals waiting
          </h3>
          <p className="text-sm text-[#6B6760] mb-5 leading-relaxed">
            Sign in to unlock your complete daily meals, full 7-day plan, and save your progress.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/diet' })}
            className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-[#E4E0D8]
                       text-[#1C1C1A] font-semibold px-5 py-3 rounded-xl hover:border-[#2D6A4F]
                       hover:shadow-md transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <p className="text-xs text-[#9E9A94] mt-3 flex items-center justify-center gap-1">
            <Star className="w-3 h-3 text-[#D4A853] fill-current" />
            Free forever · No credit card needed
          </p>
        </div>
      </div>
    </div>
  )
}
