import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateBMI, getBMICategory, getTimelineWarning, validateProfile } from '../lib/utils.js'

const VALID_PROFILE = {
  name: 'Test User', age: 30, gender: 'male', weight: 80, height: 175,
  targetWeight: 72, timelineWeeks: 12, goal: 'weight_loss',
  dietType: 'veg', city: 'Chennai', activityLevel: 'moderately_active',
}

test('calculateBMI computes kg/m²', () => {
  assert.equal(calculateBMI(80, 175), '26.1')
  assert.equal(calculateBMI(60, 170), '20.8')
})

test('getBMICategory boundaries', () => {
  assert.equal(getBMICategory(18.4).label, 'Underweight')
  assert.equal(getBMICategory(18.5).label, 'Normal')
  assert.equal(getBMICategory(24.9).label, 'Normal')
  assert.equal(getBMICategory(25).label, 'Overweight')
  assert.equal(getBMICategory(30).label, 'Obese')
})

test('getTimelineWarning flags unsafe rates', () => {
  // 10 kg in 4 weeks = 2.5 kg/week → unsafe
  const fast = getTimelineWarning(80, 70, 4)
  assert.equal(fast.safe, false)
  assert.match(fast.message, /unsafe/i)

  // 10 kg in 8 weeks = 1.25 kg/week → warning tier
  const brisk = getTimelineWarning(80, 70, 8)
  assert.equal(brisk.safe, false)

  // 6 kg in 12 weeks = 0.5 kg/week → fine
  assert.equal(getTimelineWarning(80, 74, 12), null)
})

test('validateProfile accepts a complete profile', () => {
  assert.equal(validateProfile(VALID_PROFILE), null)
})

test('validateProfile rejects each missing/invalid field', () => {
  assert.match(validateProfile({ ...VALID_PROFILE, name: ' ' }), /name/i)
  assert.match(validateProfile({ ...VALID_PROFILE, age: 3 }), /age/i)
  assert.match(validateProfile({ ...VALID_PROFILE, age: 150 }), /age/i)
  assert.match(validateProfile({ ...VALID_PROFILE, gender: '' }), /gender/i)
  assert.match(validateProfile({ ...VALID_PROFILE, weight: 10 }), /weight/i)
  assert.match(validateProfile({ ...VALID_PROFILE, height: 90 }), /height/i)
  assert.match(validateProfile({ ...VALID_PROFILE, targetWeight: 0 }), /target/i)
  assert.match(validateProfile({ ...VALID_PROFILE, timelineWeeks: 0 }), /timeline/i)
  assert.match(validateProfile({ ...VALID_PROFILE, goal: '' }), /goal/i)
  assert.match(validateProfile({ ...VALID_PROFILE, dietType: '' }), /diet/i)
  assert.match(validateProfile({ ...VALID_PROFILE, city: '' }), /city/i)
  assert.match(validateProfile({ ...VALID_PROFILE, activityLevel: '' }), /activity/i)
})
