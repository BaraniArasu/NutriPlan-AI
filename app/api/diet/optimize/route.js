import { NextResponse } from 'next/server'
import { optimizeDietPlan } from '@/lib/openai'

export async function POST(req) {
  try {
    const { question, currentPlan, userProfile } = await req.json()
    const advice = await optimizeDietPlan(question, currentPlan, userProfile)
    return NextResponse.json({ advice })
  } catch (error) {
    console.error('Optimize error:', error)
    return NextResponse.json({ error: 'Failed to optimize plan.' }, { status: 500 })
  }
}
