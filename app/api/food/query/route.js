import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { askFoodQuestion } from '@/lib/ai'
import { rateLimit, rateLimitIdentity } from '@/lib/rate-limit'

const LIMIT = { limit: 30, windowMs: 60 * 60 * 1000 }

export async function POST(req) {
  try {
    const session = await auth()

    const { ok, retryAfterSeconds } = rateLimit(rateLimitIdentity(session, req, 'food-query'), LIMIT)
    if (!ok) {
      return NextResponse.json(
        { error: `Too many questions. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
        { status: 429 }
      )
    }

    const { question, foodContext, userProfile, planId } = await req.json()
    if (!question?.trim() || !userProfile) {
      return NextResponse.json({ error: 'Missing question or profile data.' }, { status: 400 })
    }

    const answer = await askFoodQuestion(question, foodContext, userProfile)

    // Save chat only if logged in, planId provided, and the plan is theirs —
    // an arbitrary planId must not let anyone write into another user's chat.
    if (session?.user?.id && planId) {
      const plan = await prisma.dietPlan.findUnique({
        where: { id: planId },
        select: { userId: true },
      })
      if (plan?.userId === session.user.id) {
        await prisma.chatMessage.createMany({
          data: [
            { dietPlanId: planId, role: 'user', content: question, context: foodContext },
            { dietPlanId: planId, role: 'assistant', content: answer, context: foodContext },
          ],
        })
      }
    }

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Food query error:', error)
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: `AI provider rejected the API key (expired or invalid). Update the ${process.env.AI_PROVIDER || 'groq'} key in .env and restart.` },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: 'Failed to get answer.' }, { status: 500 })
  }
}
