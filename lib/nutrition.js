// Deterministic nutrition math — standard formulas, no AI involved.
// Pure functions: used server-side to set plan targets and client-side for
// the "reset to recommended" action when editing targets.

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

// Protein per kg of body weight by goal (evidence range is ~1.2–2.2 g/kg;
// higher end preserves muscle in a deficit or supports growth in a surplus).
const PROTEIN_G_PER_KG = {
  weight_loss: 1.6,
  weight_gain: 1.8,
  maintain: 1.2,
}

const KCAL_PER_KG_BODYWEIGHT = 7700
const FAT_SHARE_OF_CALORIES = 0.25

// Mifflin-St Jeor basal metabolic rate
export function calculateBMR({ weight, height, age, gender }) {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'female' ? base - 161 : base + 5
}

export function calculateTDEE(profile) {
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel] || 1.55
  return calculateBMR(profile) * multiplier
}

export function calculateNutritionTargets(profile) {
  const weight = Number(profile.weight)
  const tdee = calculateTDEE(profile)

  // Daily calorie adjustment from the user's own timeline (1 kg ≈ 7700 kcal),
  // capped at ±25% of TDEE so an aggressive timeline can't produce a crash diet.
  const weeklyChangeKg = (Number(profile.targetWeight) - weight) / Math.max(1, Number(profile.timelineWeeks))
  const rawDailyDelta = (weeklyChangeKg * KCAL_PER_KG_BODYWEIGHT) / 7
  const maxDelta = tdee * 0.25
  const dailyDelta = Math.max(-maxDelta, Math.min(maxDelta, rawDailyDelta))

  // Hard floor so the plan never goes below broadly safe intake levels.
  const floor = profile.gender === 'female' ? 1200 : 1500
  const calorieTarget = Math.round(Math.max(floor, tdee + dailyDelta))

  const proteinPerKg = PROTEIN_G_PER_KG[profile.goal] || 1.4
  const proteinTarget = Math.round(proteinPerKg * weight)

  const fatTarget = Math.round((calorieTarget * FAT_SHARE_OF_CALORIES) / 9)

  // Carbs take whatever calories remain after protein and fat.
  const carbsTarget = Math.max(0, Math.round((calorieTarget - proteinTarget * 4 - fatTarget * 9) / 4))

  // ~35 ml/kg, clamped to a sensible 2–4 L range, in liters.
  const waterIntake = Math.min(4, Math.max(2, Math.round((weight * 35) / 100) / 10))

  return {
    calorieTarget,
    proteinTarget,
    carbsTarget,
    fatTarget,
    waterIntake,
    bmr: Math.round(calculateBMR(profile)),
    tdee: Math.round(tdee),
  }
}
