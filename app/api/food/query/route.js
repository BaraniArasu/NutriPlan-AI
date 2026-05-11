import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { askFoodQuestion } from '@/lib/openai'

export async function POST(req) {
  try {
    const { question, foodContext, userProfile, planId } = await req.json()
    const answer = await askFoodQuestion(question, foodContext, userProfile)

    // Save chat only if logged in and planId provided
    const session = await auth()
    if (session?.user?.id && planId) {
      await prisma.chatMessage.createMany({
        data: [
          { dietPlanId: planId, role: 'user', content: question, context: foodContext },
          { dietPlanId: planId, role: 'assistant', content: answer, context: foodContext },
        ],
      })
    }

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Food query error:', error)
    return NextResponse.json({ error: 'Failed to get answer.' }, { status: 500 })
  }
}
