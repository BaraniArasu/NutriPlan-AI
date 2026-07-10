import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  extractJSON,
  parseJSONResponse,
  planMetaPrompt,
  dayPlanPrompt,
  foodQuestionPrompt,
  optimizePlanPrompt,
} from '../lib/ai/prompts.js'

const PROFILE = {
  name: 'Test User', age: 30, gender: 'male', weight: 80, height: 175,
  targetWeight: 72, timelineWeeks: 12, activityLevel: 'moderately_active',
  dietType: 'veg', goal: 'weight_loss', city: 'Chennai', country: 'India',
  currency: 'INR', budgetPerDay: 250, allergies: ['peanuts'], dislikedFoods: [],
}

test('extractJSON strips markdown fences', () => {
  assert.equal(extractJSON('```json\n{"a":1}\n```'), '{"a":1}')
  assert.equal(extractJSON('```\n{"a":1}\n```'), '{"a":1}')
})

test('extractJSON recovers JSON wrapped in commentary', () => {
  assert.equal(extractJSON('Here is your plan: {"a":1} Hope that helps!'), '{"a":1}')
})

test('extractJSON passes through clean JSON', () => {
  assert.equal(extractJSON('{"a":1}'), '{"a":1}')
})

test('parseJSONResponse parses fenced output', () => {
  assert.deepEqual(parseJSONResponse('```json\n{"calorieTarget":1800}\n```', 'meta'), { calorieTarget: 1800 })
})

test('parseJSONResponse throws a labeled error on garbage', () => {
  assert.throws(() => parseJSONResponse('sorry, I cannot do that', 'day plan'), /invalid JSON for day plan/)
})

test('planMetaPrompt includes profile facts and target shape', () => {
  const { system, user } = planMetaPrompt(PROFILE)
  assert.match(system, /JSON/)
  assert.match(user, /Chennai/)
  assert.match(user, /peanuts/)
  assert.match(user, /calorieTarget/)
})

test('dayPlanPrompt carries day label, calorie target, and avoid list', () => {
  const { user } = dayPlanPrompt(PROFILE, 3, 1800, ['idli', 'dosa'])
  assert.match(user, /Day: 3 \(Wednesday\)/)
  assert.match(user, /1800 kcal/)
  assert.match(user, /idli, dosa/)
  assert.match(user, /early_morning/)
  assert.match(user, /post_dinner/)
})

test('dayPlanPrompt says "none" when no previous foods', () => {
  const { user } = dayPlanPrompt(PROFILE, 1, 1800, [])
  assert.match(user, /AVOID repeating: none/)
})

test('chat prompts embed user goal and context', () => {
  const food = foodQuestionPrompt('Is this healthy?', 'Oats - 50g', PROFILE)
  assert.match(food.system, /weight_loss/)
  assert.match(food.system, /Oats - 50g/)
  assert.equal(food.user, 'Is this healthy?')

  const opt = optimizePlanPrompt('I had a cheat meal', { calorieTarget: 1800 }, PROFILE)
  assert.match(opt.system, /1800 kcal/)
  assert.equal(opt.user, 'I had a cheat meal')
})
