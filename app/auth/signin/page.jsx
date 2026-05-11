'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { Suspense } from 'react'

function SignInContent() {
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/dashboard'

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#1C1C1A] mb-2">Welcome to NutriPlan AI</h1>
          <p className="text-[#6B6760]">Sign in to save your diet plan and access your full history</p>
        </div>

        <div className="card p-8 shadow-lg">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#E4E0D8] 
                       text-[#1C1C1A] font-semibold px-6 py-4 rounded-xl hover:border-[#2D6A4F] 
                       hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 pt-6 border-t border-[#E4E0D8]">
            <p className="text-xs text-center text-[#9E9A94]">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              Your diet data is stored securely and never shared.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#6B6760] mt-4">
          Just browsing?{' '}
          <a href="/onboarding" className="text-[#2D6A4F] font-semibold hover:underline">
            Get a free plan without signing in
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center"><div className="shimmer w-80 h-64 rounded-2xl" /></div>}>
      <SignInContent />
    </Suspense>
  )
}
