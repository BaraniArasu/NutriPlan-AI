import Link from 'next/link'
import {
  Leaf, ChevronRight, MapPin, Target, Zap, Wallet, ShieldCheck,
  MessageCircleQuestion, Sparkles, Scale, UtensilsCrossed, RefreshCw,
  UserRound, CalendarDays, TrendingUp, Check, X,
} from 'lucide-react'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export const metadata = {
  title: 'How It Works — NutriPlan AI',
  description:
    'See how NutriPlan AI builds a personalized 7-day diet plan around your goals, your city\'s local foods, and your budget — and why it beats generic diet templates.',
}

const STEPS = [
  {
    step: '01',
    icon: <UserRound className="w-6 h-6" />,
    title: 'Tell us about yourself',
    desc: 'Share your age, weight, height, and goal — lose, gain, or maintain. Add your city, diet type (veg / non-veg / vegan), allergies, foods you dislike, and your daily food budget. Takes about 3 minutes, and we warn you if your target timeline is unsafe.',
  },
  {
    step: '02',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI calculates your targets',
    desc: 'From your profile we compute your BMI, daily calorie target, and protein / carbs / fat / water goals — the science-backed foundation your whole plan is built on.',
  },
  {
    step: '03',
    icon: <CalendarDays className="w-6 h-6" />,
    title: 'Your plan is built day by day',
    desc: 'Each day has 7 meal slots from early morning to post-dinner, using foods actually available in your city with real market prices. Every new day deliberately avoids repeating what you already ate — no boring copy-paste weeks.',
  },
  {
    step: '04',
    icon: <RefreshCw className="w-6 h-6" />,
    title: 'Adjust, ask, and optimize',
    desc: 'Increase or reduce any food\'s quantity and watch calories recalculate live. Tap ❓ on any food to ask the AI about it. Had a cheat meal? The plan optimizer tells you exactly how to adjust the rest of your week.',
  },
]

const FEATURES = [
  { icon: <CalendarDays className="w-5 h-5" />, title: '7-day, 7-meal structure', desc: 'Early morning to post-dinner — every slot planned with exact quantities, calories, and macros.' },
  { icon: <MapPin className="w-5 h-5" />, title: 'Local foods, real prices', desc: 'Meals use what\'s in your city\'s markets, priced in your currency. No imported superfoods.' },
  { icon: <Wallet className="w-5 h-5" />, title: 'Budget-aware planning', desc: 'Set a daily food budget and the plan stays inside it. Eating right shouldn\'t be expensive.' },
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Safety-first timelines', desc: 'Targeting more than ~1 kg/week? We flag it and suggest a sustainable timeline instead.' },
  { icon: <UtensilsCrossed className="w-5 h-5" />, title: 'Allergy & preference aware', desc: 'Allergies, dislikes, veg / non-veg / vegan — every meal respects your constraints.' },
  { icon: <Scale className="w-5 h-5" />, title: 'Live quantity adjustment', desc: 'Tune any portion with +/− and see calories, protein, carbs, and price update instantly.' },
  { icon: <MessageCircleQuestion className="w-5 h-5" />, title: 'Ask about any food', desc: 'Preparation, alternatives, min/max portions — an AI nutritionist answers, scoped to your goal.' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Plan optimizer', desc: 'Cheat meals, skipped breakfasts, travel days — ask and get practical adjustments for your week.' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Real progress tracking', desc: 'Log your weight and watch your goal progress bar and BMI update from actual data.' },
]

const COMPARISONS = [
  { them: 'Generic PDF templates reused for everyone', us: 'A unique plan generated from your body, goal, city, and budget' },
  { them: 'Recommends quinoa and kale you can\'t find or afford', us: 'Foods from your local market with realistic prices' },
  { them: 'Static charts you can\'t change', us: 'Interactive plan — adjust portions, swap with alternates, regenerate days' },
  { them: 'No answers when you have questions', us: 'Built-in AI nutritionist for any food or plan question, anytime' },
  { them: 'Crash diets that promise 5 kg in 2 weeks', us: 'Safety checks that warn you and suggest sustainable timelines' },
  { them: 'Pay or register before you see anything', us: 'Generate your plan first — sign in only to unlock and save it' },
]

const BENEFITS = [
  { title: 'You save money', desc: 'The plan respects your daily budget and uses affordable local foods — many users spend less than before.' },
  { title: 'Results that last', desc: 'Sustainable calorie targets and safe weekly rates mean you keep the weight off instead of yo-yoing.' },
  { title: 'Zero guesswork', desc: 'Exact foods, exact quantities, exact times — you always know what to eat next.' },
  { title: 'Never stuck or confused', desc: 'Every food is one tap away from answers, and deviations get practical fixes — not guilt.' },
  { title: 'Progress you can see', desc: 'Weight logs, BMI, and a live goal progress bar keep you motivated with real numbers.' },
  { title: 'Try before you commit', desc: 'Your first meals are free to see without an account. Log in only when you want the full plan saved.' },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-sm border-b border-[#E4E0D8]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-[#1C1C1A]">NutriPlan AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <GoogleSignInButton />
            <Link href="/onboarding" className="btn-primary text-sm py-2 px-5">
              Get My Plan
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#2D6A4F] px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            From your details to your dinner table in ~3 minutes
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1C1C1A] mb-5 animate-slide-up leading-tight">
            How <span className="gradient-text">NutriPlan AI</span> works
          </h1>
          <p className="text-lg text-[#6B6760] max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            No generic templates. NutriPlan uses AI to build a diet plan around <strong>your</strong> body,
            <strong> your</strong> goals, <strong>your</strong> city&apos;s foods, and <strong>your</strong> budget —
            then stays with you to answer questions and adapt when life happens.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex gap-5 items-start card p-6 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="font-display text-4xl font-bold text-[#E4E0D8] shrink-0">{s.step}</span>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-9 h-9 bg-[#D8F3DC] text-[#2D6A4F] rounded-xl flex items-center justify-center shrink-0">
                    {s.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1C1C1A]">{s.title}</h3>
                </div>
                <p className="text-[#6B6760] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white border-t border-b border-[#E4E0D8]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1C1C1A] mb-4">
            Everything you get
          </h2>
          <p className="text-center text-[#6B6760] mb-12 text-lg">
            One app for planning, adjusting, asking, and tracking.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-hover p-5 animate-slide-up">
                <div className="w-10 h-10 bg-[#D8F3DC] text-[#2D6A4F] rounded-xl flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-1">{f.title}</h3>
                <p className="text-[#6B6760] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we're different */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1C1C1A] mb-4">
            Why NutriPlan is different
          </h2>
          <p className="text-center text-[#6B6760] mb-12 text-lg">
            Most diet apps hand you a template. We build yours from scratch.
          </p>
          <div className="space-y-3">
            {COMPARISONS.map((row) => (
              <div key={row.us} className="grid md:grid-cols-2 gap-3">
                <div className="card p-4 flex items-start gap-3 bg-[#FDEDEC]/40 border-[#E8C6C2]">
                  <X className="w-4 h-4 text-[#C0392B] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#6B6760]">{row.them}</p>
                </div>
                <div className="card p-4 flex items-start gap-3 bg-[#D8F3DC]/40 border-[#B7E4C7]">
                  <Check className="w-4 h-4 text-[#2D6A4F] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#1C1C1A] font-medium">{row.us}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white border-t border-b border-[#E4E0D8]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1C1C1A] mb-12">
            What that means for you
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card p-5 animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#D4A853] shrink-0" />
                  <h3 className="font-display text-lg font-bold">{b.title}</h3>
                </div>
                <p className="text-[#6B6760] text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1C1C1A] mb-4">
            Ready to see your plan?
          </h2>
          <p className="text-[#6B6760] text-lg mb-8">
            Answer a few questions and get your first day of meals in under a minute — free, no account needed.
          </p>
          <Link href="/onboarding" className="btn-primary text-base py-4 px-10 inline-flex items-center gap-2">
            Generate My Diet Plan
            <ChevronRight className="w-4 h-4" />
          </Link>
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
