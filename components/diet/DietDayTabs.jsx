'use client'

import { Lock, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function DietDayTabs({ days, totalDays, activeDay, onDayChange, isLoggedIn, generatingDay }) {
  return (
    <div className="py-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {Array.from({ length: totalDays }).map((_, idx) => {
          const generated = idx < days.length
          const day = generated ? days[idx] : null
          const isActive = activeDay === idx
          const isGenerating = generatingDay && idx === days.length
          const locked = !generated && !isGenerating

          let btnClass = 'border-[#E4E0D8] bg-white text-[#1C1C1A] hover:border-[#52B788]'
          if (isActive) btnClass = 'border-[#2D6A4F] bg-[#2D6A4F] text-white'
          else if (isGenerating) btnClass = 'border-[#52B788] bg-[#D8F3DC] text-[#2D6A4F]'
          else if (locked) btnClass = 'border-dashed border-[#E4E0D8] bg-[#FAFAF7] text-[#C8C4BE]'

          return (
            <button
              key={idx}
              onClick={() => generated && onDayChange(idx)}
              disabled={locked || isGenerating}
              className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border-2 transition-all duration-200 min-w-[64px] ${btnClass}`}
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 mb-1 animate-spin" />
              ) : locked ? (
                <Lock className="w-3 h-3 mb-1 opacity-40" />
              ) : (
                <span className="text-xs font-bold">{DAY_LABELS[idx]}</span>
              )}
              <span className="text-[10px] opacity-75">Day {idx + 1}</span>
              {generated && !isActive && day && (
                <span className="text-[9px] mt-0.5 opacity-50">
                  {formatCurrency(day.totalPrice)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
