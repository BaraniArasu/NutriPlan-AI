import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { optimizeDietPlan } from '@/lib/ai'
import { rateLimit, rateLimitIdentity } from '@/lib/rate-limit'

const LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 }

export async function POST(req) {
  try {
    const session = await auth()

    const { ok, retryAfterSeconds } = rateLimit(rateLimitIdentity(session, req, 'optimize'), LIMIT)
    if (!ok) {
      return NextResponse.json(
        { error: `Too many questions. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
        { status: 429 }
      )
    }

    const { question, currentPlan, userProfile, planId } = await req.json()
    if (!question?.trim() || !currentPlan || !userProfile) {
      return NextResponse.json({ error: 'Missing question or plan data.' }, { status: 400 })
    }

    const advice = await optimizeDietPlan(question, currentPlan, userProfile)

    // Persist the conversation like the food-query route does — only for
    // logged-in users, and only to a plan they actually own.
    if (session?.user?.id && planId) {
      const plan = await prisma.dietPlan.findUnique({
        where: { id: planId },
        select: { userId: true },
      })
      if (plan?.userId === session.user.id) {
        await prisma.chatMessage.createMany({
          data: [
            { dietPlanId: planId, role: 'user', content: question, context: 'optimize' },
            { dietPlanId: planId, role: 'assistant', content: advice, context: 'optimize' },
          ],
        })
      }
    }

    return NextResponse.json({ advice })
  } catch (error) {
    console.error('Optimize error:', error)
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: `AI provider rejected the API key (expired or invalid). Update the ${process.env.AI_PROVIDER || 'groq'} key in .env and restart.` },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: 'Failed to optimize plan.' }, { status: 500 })
  }
}
