import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePlanMeta, generateDayPlan } from '@/lib/ai'
import { validateProfile } from '@/lib/utils'
import { calculateNutritionTargets } from '@/lib/nutrition'
import { rateLimit, rateLimitIdentity } from '@/lib/rate-limit'

// 20/hour covers ~2 full plan generations (1 meta + 7 day calls each)
const LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 }

export async function POST(req) {
  try {
    const session = await auth()

    const { ok, retryAfterSeconds } = rateLimit(rateLimitIdentity(session, req, 'generate'), LIMIT)
    if (!ok) {
      return NextResponse.json(
        { error: `Too many plan generations. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { profileData, dayNumber, targets, calorieTarget, previousFoods } = body

    // Validate profile completeness
    const validationError = validateProfile(profileData)
    if (validationError) {
      return NextResponse.json({ error: `Incomplete profile: ${validationError}` }, { status: 400 })
    }

    const profile = {
      name: profileData.name,
      age: profileData.age,
      gender: profileData.gender,
      weight: profileData.weight || profileData.currentWeight,
      height: profileData.height,
      targetWeight: profileData.targetWeight,
      timelineWeeks: profileData.timelineWeeks,
      activityLevel: profileData.activityLevel,
      dietType: profileData.dietType,
      goal: profileData.goal,
      city: profileData.city,
      country: profileData.country || 'India',
      currency: 'INR',
      allergies: profileData.allergies || [],
      dislikedFoods: profileData.dislikedFoods || [],
      budgetPerDay: profileData.budgetPerDay || 200,
      preferredCuisine: profileData.preferredCuisine || 'local',
    }

    // Case 1: Plan metadata. Nutrition numbers come from deterministic math
    // (Mifflin-St Jeor BMR, TDEE, timeline-based calorie adjustment, g/kg
    // protein) — the AI only writes the summary text and weekly tips, and
    // its numbers are always overridden. If the AI text call fails, fall
    // back to a plain template so target calculation never depends on it.
    if (dayNumber === undefined || dayNumber === null) {
      const computed = calculateNutritionTargets(profile)
      let text = {
        title: `Personalized Diet Plan for ${profile.name}`,
        summary: `A ${profile.goal.replace('_', ' ')} plan built around ${profile.city}'s local foods within your daily budget. Targets are calculated from your BMR, activity level, and timeline.`,
        weeklyNotes: [
          'Drink water before every meal to help portion control.',
          'Eat slowly — it takes ~20 minutes for fullness to register.',
          'A short walk after meals helps digestion and blood sugar.',
        ],
      }
      try {
        const aiMeta = await generatePlanMeta(profile)
        text = { title: aiMeta.title || text.title, summary: aiMeta.summary || text.summary, weeklyNotes: aiMeta.weeklyNotes || text.weeklyNotes }
      } catch (err) {
        console.error('AI meta text failed, using template:', err?.message)
      }
      return NextResponse.json({ meta: { ...text, ...computed } })
    }

    // Case 2: Generate a specific day, aiming at all macro targets (falls
    // back to computing them if an older client only sent calorieTarget).
    const dayTargets = targets || {
      calories: calorieTarget,
      ...(() => {
        const c = calculateNutritionTargets(profile)
        return { protein: c.proteinTarget, carbs: c.carbsTarget, fat: c.fatTarget }
      })(),
    }
    const day = await generateDayPlan(profile, dayNumber, dayTargets, previousFoods || [])

    // Keep the logged-in user's profile current on Day 1. The DietPlan record
    // itself is created/updated by /api/diet/save (the client syncs the full
    // plan there) — creating it here with empty planData left orphaned rows.
    if (session?.user?.id && dayNumber === 1) {
      await prisma.userProfile.upsert({
        where: { userId: session.user.id },
        update: {
          age: profile.age, gender: profile.gender,
          weight: profile.weight, height: profile.height,
          targetWeight: profile.targetWeight, timelineWeeks: profile.timelineWeeks,
          activityLevel: profile.activityLevel, dietType: profile.dietType,
          goal: profile.goal, city: profile.city, country: profile.country,
          allergies: profile.allergies, dislikedFoods: profile.dislikedFoods,
          budgetPerDay: profile.budgetPerDay, preferredCuisine: profile.preferredCuisine,
          location: `${profile.city}, ${profile.country}`,
        },
        create: {
          userId: session.user.id,
          age: profile.age, gender: profile.gender,
          weight: profile.weight, height: profile.height,
          targetWeight: profile.targetWeight, timelineWeeks: profile.timelineWeeks,
          activityLevel: profile.activityLevel, dietType: profile.dietType,
          goal: profile.goal, city: profile.city, country: profile.country,
          allergies: profile.allergies, dislikedFoods: profile.dislikedFoods,
          budgetPerDay: profile.budgetPerDay, preferredCuisine: profile.preferredCuisine,
          location: `${profile.city}, ${profile.country}`,
        },
      })
    }

    return NextResponse.json({ day })
  } catch (error) {
    console.error('Diet generation error:', error)
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: `AI provider rejected the API key (expired or invalid). Update the ${process.env.AI_PROVIDER || 'groq'} key in .env and restart.` },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: 'Failed to generate diet plan. Please try again.' }, { status: 500 })
  }
}
