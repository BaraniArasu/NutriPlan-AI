import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Saves an already-generated plan to DB — no AI call, login required
export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required to save plan' }, { status: 401 })
    }

    const { plan, profileData } = await req.json()
    if (!plan || !profileData) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        age: profileData.age, gender: profileData.gender,
        weight: profileData.weight || profileData.currentWeight,
        height: profileData.height, targetWeight: profileData.targetWeight,
        timelineWeeks: profileData.timelineWeeks, activityLevel: profileData.activityLevel,
        dietType: profileData.dietType, goal: profileData.goal,
        city: profileData.city, country: profileData.country || 'India',
        allergies: profileData.allergies || [], dislikedFoods: profileData.dislikedFoods || [],
        budgetPerDay: profileData.budgetPerDay || 200,
        preferredCuisine: profileData.preferredCuisine || 'local',
        location: `${profileData.city}, ${profileData.country || 'India'}`,
      },
      create: {
        userId: session.user.id,
        age: profileData.age, gender: profileData.gender,
        weight: profileData.weight || profileData.currentWeight,
        height: profileData.height, targetWeight: profileData.targetWeight,
        timelineWeeks: profileData.timelineWeeks, activityLevel: profileData.activityLevel,
        dietType: profileData.dietType, goal: profileData.goal,
        city: profileData.city, country: profileData.country || 'India',
        allergies: profileData.allergies || [], dislikedFoods: profileData.dislikedFoods || [],
        budgetPerDay: profileData.budgetPerDay || 200,
        preferredCuisine: profileData.preferredCuisine || 'local',
        location: `${profileData.city}, ${profileData.country || 'India'}`,
      },
    })

    const saved = await prisma.dietPlan.create({
      data: {
        userId: session.user.id,
        title: plan.title || 'Diet Plan',
        planData: plan,
        isActive: true,
      },
    })

    return NextResponse.json({ planId: saved.id })
  } catch (error) {
    console.error('Save plan error:', error)
    return NextResponse.json({ error: 'Failed to save plan.' }, { status: 500 })
  }
}
