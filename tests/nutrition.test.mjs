import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateBMR, calculateTDEE, calculateNutritionTargets } from '../lib/nutrition.js'

const HEAVY_USER = {
  weight: 98, height: 178, age: 32, gender: 'male',
  targetWeight: 88, timelineWeeks: 16,
  activityLevel: 'moderately_active', goal: 'weight_loss',
}

test('BMR follows Mifflin-St Jeor', () => {
  // male: 10*98 + 6.25*178 - 5*32 + 5 = 980 + 1112.5 - 160 + 5 = 1937.5
  assert.equal(calculateBMR(HEAVY_USER), 1937.5)
  // female variant: -161 instead of +5
  assert.equal(calculateBMR({ ...HEAVY_USER, gender: 'female' }), 1771.5)
})

test('TDEE applies the activity multiplier', () => {
  assert.equal(calculateTDEE(HEAVY_USER), 1937.5 * 1.55)
  assert.equal(calculateTDEE({ ...HEAVY_USER, activityLevel: 'sedentary' }), 1937.5 * 1.2)
})

test('98 kg weight-loss user gets ~1.6 g/kg protein (~157 g, "150 nearby")', () => {
  const t = calculateNutritionTargets(HEAVY_USER)
  assert.equal(t.proteinTarget, Math.round(1.6 * 98)) // 157
  assert.ok(t.proteinTarget >= 145 && t.proteinTarget <= 165)
})

test('calorie target sits below TDEE for weight loss, above for gain', () => {
  const loss = calculateNutritionTargets(HEAVY_USER)
  assert.ok(loss.calorieTarget < loss.tdee)

  const gain = calculateNutritionTargets({ ...HEAVY_USER, weight: 60, targetWeight: 68, goal: 'weight_gain' })
  assert.ok(gain.calorieTarget > gain.tdee)
})

test('aggressive timelines are capped at 25% of TDEE deficit', () => {
  // 30 kg in 4 weeks would be a ~8250 kcal/day deficit — must be capped
  const crash = calculateNutritionTargets({ ...HEAVY_USER, targetWeight: 68, timelineWeeks: 4 })
  const minAllowed = Math.round(crash.tdee * 0.75)
  assert.ok(crash.calorieTarget >= minAllowed - 1, `${crash.calorieTarget} >= ${minAllowed}`)
})

test('calorie floor is enforced', () => {
  const tiny = calculateNutritionTargets({
    weight: 45, height: 150, age: 60, gender: 'female',
    targetWeight: 40, timelineWeeks: 8,
    activityLevel: 'sedentary', goal: 'weight_loss',
  })
  assert.ok(tiny.calorieTarget >= 1200)
})

test('macros add back up to roughly the calorie target', () => {
  const t = calculateNutritionTargets(HEAVY_USER)
  const kcalFromMacros = t.proteinTarget * 4 + t.carbsTarget * 4 + t.fatTarget * 9
  assert.ok(Math.abs(kcalFromMacros - t.calorieTarget) < 40, `${kcalFromMacros} vs ${t.calorieTarget}`)
})

test('water is in liters, clamped 2–4', () => {
  const t = calculateNutritionTargets(HEAVY_USER)
  assert.ok(t.waterIntake >= 2 && t.waterIntake <= 4)
  assert.ok(t.waterIntake < 10, 'must be liters, not ml')
})
