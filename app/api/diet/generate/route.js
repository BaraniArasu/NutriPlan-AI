import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePlanMeta, generateDayPlan } from '@/lib/openai'
import { validateProfile } from '@/lib/utils'

export async function POST(req) {
  try {
    const body = await req.json()
    const { profileData, dayNumber, calorieTarget, previousFoods } = body

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

    // Case 1: Generate plan metadata only
    if (dayNumber === undefined || dayNumber === null) {
      const meta = await generatePlanMeta(profile)
      return NextResponse.json({ meta })
    }

    // Case 2: Generate a specific day
    const day = await generateDayPlan(profile, dayNumber, calorieTarget, previousFoods || [])

    // Save to DB only if user is logged in — Day 1 creates the plan record
    const session = await auth()
    let planId = null

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

      const saved = await prisma.dietPlan.create({
        data: {
          userId: session.user.id,
          title: `Diet Plan for ${profile.name}`,
          planData: {},
          isActive: true,
        },
      })
      planId = saved.id
    }

    return NextResponse.json({ day, planId })
  } catch (error) {
    console.error('Diet generation error:', error)
    return NextResponse.json({ error: 'Failed to generate diet plan. Please try again.' }, { status: 500 })
  }
}
