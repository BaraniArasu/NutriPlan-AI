import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Leaf, Target, MapPin, Zap, ChevronRight, Star } from 'lucide-react'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export default async function HomePage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-[#FAFAF7] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-sm border-b border-[#E4E0D8]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-[#1C1C1A]">NutriPlan AI</span>
          </div>
          <div className="flex items-center gap-2">
            <GoogleSignInButton />
            <Link href="/onboarding" className="btn-primary text-sm py-2 px-5">
              Get My Plan
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#2D6A4F] px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            <Star className="w-3.5 h-3.5 fill-current" />
            AI-Powered Nutrition • Local Foods • Real Prices
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[#1C1C1A] mb-6 animate-slide-up leading-tight">
            Your Diet Plan,
            <br />
            <span className="gradient-text">Perfectly Tailored</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B6760] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Get a personalized 7-day diet chart built around your goals, your city's local foods, and your budget. Powered by Groq AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/onboarding" className="btn-primary text-base py-4 px-8 flex items-center justify-center gap-2">
              Generate My Diet Plan
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-base py-4 px-8">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white border-t border-b border-[#E4E0D8]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1C1C1A] mb-4">
            Everything you need to eat right
          </h2>
          <p className="text-center text-[#6B6760] mb-14 text-lg">No generic templates. No guesswork. Just science-backed, locally-relevant nutrition.</p>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Local Foods & Real Prices',
                desc: 'We use foods available in your city with actual market prices in ₹. No imported superfoods you can\'t find.',
                color: 'bg-[#D8F3DC] text-[#2D6A4F]',
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Goal-Driven Planning',
                desc: 'Whether it\'s weight loss, gain, or maintenance — the plan adapts to your target timeline with safety checks.',
                color: 'bg-[#FFF3CD] text-[#D4A853]',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Interactive & Adjustable',
                desc: 'Increase or reduce food quantities, ask questions about any food, and optimize your plan on the fly.',
                color: 'bg-[#EBF5FB] text-[#2980B9]',
              },
            ].map((f) => (
              <div key={f.title} className="card-hover p-6 animate-slide-up">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-[#6B6760] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1C1C1A] mb-14">
            Ready in 3 simple steps
          </h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Tell us about yourself', desc: 'Share your age, weight, height, goals, and dietary preferences. Takes about 3 minutes.' },
              { step: '02', title: 'We generate your plan', desc: 'AI creates a unique 7-day plan with local foods, realistic prices, and exact quantities.' },
              { step: '03', title: 'Track, adjust & improve', desc: 'Modify quantities, ask food questions, and optimize your plan for any day\'s deviation.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-6 items-start card p-6">
                <span className="font-display text-4xl font-bold text-[#E4E0D8] shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-display text-xl font-bold mb-1">{s.title}</h3>
                  <p className="text-[#6B6760]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/onboarding" className="btn-primary text-base py-4 px-10 inline-flex items-center gap-2">
              Start Now — It's Free
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E4E0D8] py-8 px-4 text-center text-sm text-[#9E9A94]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-[#2D6A4F] rounded-md flex items-center justify-center">
            <Leaf className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-bold text-[#1C1C1A]">NutriPlan AI</span>
        </div>
        <p>© {new Date().getFullYear()} NutriPlan AI. Built with care for your health.</p>
      </footer>
    </main>
  )
}
