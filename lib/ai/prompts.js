// Shared prompt text used by every AI provider. Keeping this in one place means
// switching AI_PROVIDER never changes *what* is asked for — only which model answers.

export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function bmiOf(profile) {
  return (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
}

export function userContextLine(profile, bmi) {
  return `User: ${profile.name}, ${profile.age}y ${profile.gender}, ${profile.weight}kg→${profile.targetWeight}kg (${profile.goal}), BMI ${bmi}, ${profile.activityLevel}, ${profile.dietType} diet, ${profile.city} ${profile.country}, budget ${profile.currency}${profile.budgetPerDay}/day, allergies: ${profile.allergies.join(',') || 'none'}, dislikes: ${profile.dislikedFoods.join(',') || 'none'}`
}

const JSON_ONLY_INSTRUCTION = 'Return ONLY valid JSON matching the schema. No markdown fences, no commentary before or after.'

export function planMetaPrompt(profile) {
  const bmi = bmiOf(profile)
  return {
    system: `You are a registered-dietitian-grade nutrition planner. ${JSON_ONLY_INSTRUCTION}`,
    user: `Based on this profile, calculate daily nutrition targets.
${userContextLine(profile, bmi)}

Return this JSON shape:
{
  "title": "Personalized Diet Plan for ${profile.name}",
  "summary": "2 sentence description of the approach",
  "calorieTarget": 0,
  "proteinTarget": 0,
  "carbsTarget": 0,
  "fatTarget": 0,
  "waterIntake": 0,
  "weeklyNotes": ["tip1","tip2","tip3"]
}`,
  }
}

export function dayPlanPrompt(profile, dayNumber, targets, previousFoods = []) {
  const bmi = bmiOf(profile)
  const dayLabel = DAY_LABELS[dayNumber - 1]
  const avoidList = previousFoods.slice(-15).join(', ') || 'none'

  // Accept either a full targets object or a bare calorie number
  const t = typeof targets === 'object' && targets !== null ? targets : { calories: targets }
  const macroLine = [
    `~${t.calories} kcal`,
    t.protein ? `~${t.protein}g protein` : null,
    t.carbs ? `~${t.carbs}g carbs` : null,
    t.fat ? `~${t.fat}g fat` : null,
  ].filter(Boolean).join(', ')

  return {
    system: `You are a registered-dietitian-grade nutrition planner with deep knowledge of local, affordable cuisine. ${JSON_ONLY_INSTRUCTION}`,
    user: `Generate a single day diet plan.
${userContextLine(profile, bmi)}
Day: ${dayNumber} (${dayLabel}). Daily targets: ${macroLine}. The day's meals must add up close to ALL of these targets, protein especially.
AVOID repeating: ${avoidList}. Use different local ${profile.city} foods.
Include exactly these 7 meal slots in order: early_morning(6:00 AM 🌅), breakfast(8:00 AM 🍳), mid_morning(11:00 AM 🍎), lunch(1:00 PM 🍱), evening(4:30 PM ☕), dinner(7:30 PM 🍽️), post_dinner(9:30 PM 🌙).
Prices in ${profile.currency}. Return this JSON shape:
{
  "day": ${dayNumber},
  "dayLabel": "${dayLabel}",
  "totalCalories": 0,
  "totalProtein": 0,
  "totalCarbs": 0,
  "totalFat": 0,
  "totalPrice": 0,
  "dailyTip": "a useful health tip for the day",
  "meals": [
    {
      "mealId": "early_morning",
      "mealLabel": "Early Morning",
      "time": "6:00 AM",
      "emoji": "🌅",
      "totalCalories": 0,
      "totalProtein": 0,
      "totalCarbs": 0,
      "totalFat": 0,
      "totalPrice": 0,
      "notes": "short meal note",
      "foods": [
        {
          "id": "d${dayNumber}_em_1",
          "name": "food name",
          "quantity": 0,
          "unit": "ml",
          "price": 0,
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "fiber": 0,
          "nutrients": ["Vitamin C"],
          "preparation": "how to prepare",
          "alternates": ["alternate1","alternate2"],
          "tips": ["health tip"],
          "warnings": []
        }
      ]
    }
  ]
}`,
  }
}

export function foodQuestionPrompt(question, foodContext, userProfile) {
  return {
    system: `Nutritionist assistant. User: ${userProfile.goal} goal, ${userProfile.dietType} diet, ${userProfile.city} ${userProfile.country}. Food: ${foodContext}. Be concise, under 200 words, suggest local alternatives.`,
    user: question,
  }
}

export function optimizePlanPrompt(question, currentPlan, userProfile) {
  return {
    system: `Expert nutritionist. User: ${userProfile.goal} goal, ${userProfile.dietType} diet, ${userProfile.city} ${userProfile.country}. Daily target: ${currentPlan.calorieTarget} kcal. Give practical meal adjustments, be encouraging, under 300 words.`,
    user: question,
  }
}

// Defensive JSON extraction for providers/models that occasionally wrap JSON in
// markdown fences or add stray commentary despite being asked not to.
export function extractJSON(raw) {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1)
  return raw.trim()
}

export function parseJSONResponse(raw, label) {
  try {
    return JSON.parse(extractJSON(raw))
  } catch (err) {
    throw new Error(`AI provider returned invalid JSON for ${label}: ${err.message}`)
  }
}
