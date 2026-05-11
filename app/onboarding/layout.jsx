import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <header className="border-b border-[#E4E0D8] bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-[#1C1C1A]">NutriPlan AI</span>
          </Link>
          <span className="text-xs text-[#9E9A94]">Setup your plan</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
