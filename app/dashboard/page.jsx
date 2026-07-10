import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const [profile, plans, weightLogs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.dietPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        weekNumber: true,
        startDate: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.weightLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, weight: true, createdAt: true },
    }),
  ])

  return (
    <DashboardClient
      user={session.user}
      profile={profile}
      plans={plans}
      weightLogs={weightLogs}
    />
  )
}
