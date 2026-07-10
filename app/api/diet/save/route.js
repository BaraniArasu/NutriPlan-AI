import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Creates or updates the user's plan record — no AI call, login required.
// The diet page calls this whenever the plan changes (first save, each new
// day generated), so the DB always holds the full plan as generated so far.
export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required to save plan' }, { status: 401 })
    }

    const { plan, profileData, planId } = await req.json()
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

    // Record the onboarding weight as a weight-log entry when it changed,
    // so goal progress on the dashboard has a real starting point.
    const weight = profileData.weight || profileData.currentWeight
    if (weight) {
      const latest = await prisma.weightLog.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      })
      if (!latest || latest.weight !== weight) {
        await prisma.weightLog.create({
          data: { userId: session.user.id, weight },
        })
      }
    }

    // Update the existing plan when the client already has a planId —
    // but only if that plan actually belongs to this user.
    if (planId) {
      const existing = await prisma.dietPlan.findUnique({
        where: { id: planId },
        select: { userId: true },
      })
      if (existing && existing.userId === session.user.id) {
        await prisma.dietPlan.update({
          where: { id: planId },
          data: { planData: plan, title: plan.title || 'Diet Plan' },
        })
        return NextResponse.json({ planId })
      }
      // Unknown or foreign planId — fall through and create a fresh record.
    }

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
