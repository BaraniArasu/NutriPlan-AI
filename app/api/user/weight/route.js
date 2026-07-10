import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { weight } = await req.json()
    const value = Number(weight)
    if (!Number.isFinite(value) || value < 20 || value > 400) {
      return NextResponse.json({ error: 'Please enter a weight between 20 and 400 kg.' }, { status: 400 })
    }

    const log = await prisma.weightLog.create({
      data: { userId: session.user.id, weight: value },
    })

    // Keep the profile's current weight in step so BMI and stats stay live.
    await prisma.userProfile.updateMany({
      where: { userId: session.user.id },
      data: { weight: value },
    })

    return NextResponse.json({ log })
  } catch (error) {
    console.error('Weight log error:', error)
    return NextResponse.json({ error: 'Failed to save weight.' }, { status: 500 })
  }
}
