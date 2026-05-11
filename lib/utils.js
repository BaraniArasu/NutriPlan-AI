import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100
  return (weight / (heightM * heightM)).toFixed(1)
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' }
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' }
  return { label: 'Obese', color: 'text-red-500' }
}

export function getTimelineWarning(currentWeight, targetWeight, weeks) {
  const diff = Math.abs(targetWeight - currentWeight)
  const weeklyChange = diff / weeks

  if (weeklyChange > 1.5) {
    return {
      safe: false,
      message: `⚠️ Losing/gaining more than 1.5 kg/week is unsafe. At this rate you'd change ${weeklyChange.toFixed(1)} kg/week. This may cause muscle loss, nutrient deficiencies and fatigue. Consider extending to at least ${Math.ceil(diff / 0.75)} weeks.`,
    }
  }
  if (weeklyChange > 1) {
    return {
      safe: false,
      message: `⚠️ You're targeting ${weeklyChange.toFixed(1)} kg/week. The recommended safe rate is 0.5–0.75 kg/week. Consider extending to ${Math.ceil(diff / 0.75)} weeks for sustainable results.`,
    }
  }
  return null
}

export function validateProfile(profile) {
  if (!profile.name?.trim()) return 'Missing name'
  if (!profile.age || profile.age < 5 || profile.age > 120) return 'Invalid age'
  if (!profile.gender) return 'Missing gender'
  if (!profile.weight || profile.weight < 20) return 'Invalid weight'
  if (!profile.height || profile.height < 100) return 'Invalid height'
  if (!profile.targetWeight || profile.targetWeight < 20) return 'Invalid target weight'
  if (!profile.timelineWeeks || profile.timelineWeeks < 1) return 'Invalid timeline'
  if (!profile.goal) return 'Missing goal'
  if (!profile.dietType) return 'Missing diet type'
  if (!profile.city?.trim()) return 'Missing city'
  if (!profile.activityLevel) return 'Missing activity level'
  return null
}
