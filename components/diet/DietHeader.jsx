'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Leaf, LogOut, LogIn, User, RefreshCw, Droplets } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'


export function DietHeader({ plan, userProfile }) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E4E0D8]">
      <div className="max-w-3xl mx-auto px-4">
        {/* Top nav */}
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-[#1C1C1A] hidden sm:block">NutriPlan AI</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-ghost text-xs flex items-center gap-1.5 py-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Plan
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-[#E4E0D8]"
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#2D6A4F]" />
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-ghost py-2 px-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google', { callbackUrl: '/diet' })}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Save Plan
              </button>
            )}
          </div>
        </div>

        {/* Plan summary */}
        <div className="pb-3">
          <h1 className="font-display text-lg font-bold text-[#1C1C1A] truncate">{plan.title}</h1>
          <div className="flex items-center gap-4 mt-1 text-xs text-[#6B6760] flex-wrap">
            <span className="flex items-center gap-1">
              🔥 <strong className="text-[#1C1C1A]">{plan.calorieTarget}</strong> kcal/day
            </span>
            <span className="flex items-center gap-1">
              💪 <strong className="text-[#1C1C1A]">{plan.proteinTarget}g</strong> protein
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              <strong className="text-[#1C1C1A]">{plan.waterIntake}L</strong> water
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
