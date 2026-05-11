import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const plans = await prisma.dietPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, title: true, weekNumber: true, startDate: true, isActive: true, createdAt: true },
    })
    return NextResponse.json({ plans })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans.' }, { status: 500 })
  }
}
