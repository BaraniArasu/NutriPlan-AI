import 'server-only'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

function extractJSON(raw) {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1)
  return raw.trim()
}

function userContext(p, bmi) {
  return `User: ${p.name}, ${p.age}y ${p.gender}, ${p.weight}kg→${p.targetWeight}kg (${p.goal}), BMI ${bmi}, ${p.activityLevel}, ${p.dietType} diet, ${p.city} ${p.country}, budget ${p.currency}${p.budgetPerDay}/day, allergies: ${p.allergies.join(',') || 'none'}, dislikes: ${p.dislikedFoods.join(',') || 'none'}`
}

export async function generatePlanMeta(profile) {
  const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)

  const prompt = `You are a nutritionist. Based on this profile, calculate daily nutrition targets.
${userContext(profile, bmi)}

Return ONLY this JSON (no markdown, no explanation):
{
  "title": "Personalized Diet Plan for ${profile.name}",
  "summary": "2 sentence description of the approach",
  "calorieTarget": 0,
  "proteinTarget": 0,
  "carbsTarget": 0,
  "fatTarget": 0,
  "waterIntake": 0,
  "weeklyNotes": ["tip1","tip2","tip3"]
}`

  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.3,
  })

  const raw = res.choices[0]?.message?.content || ''
  return JSON.parse(extractJSON(raw))
}

const DAY_LABELS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export async function generateDayPlan(profile, dayNumber, calorieTarget, previousFoods = []) {
  const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
  const dayLabel = DAY_LABELS[dayNumber - 1]
  const avoidList = previousFoods.slice(-15).join(', ') || 'none'

  const prompt = `You are a nutritionist. Generate a single day diet plan as valid JSON only.
${userContext(profile, bmi)}
Day: ${dayNumber} (${dayLabel}), calorie target: ~${calorieTarget} kcal.
AVOID repeating: ${avoidList}. Use different local ${profile.city} foods.
Include exactly these 7 meal slots in order: early_morning(6:00 AM 🌅), breakfast(8:00 AM 🍳), mid_morning(11:00 AM 🍎), lunch(1:00 PM 🍱), evening(4:30 PM ☕), dinner(7:30 PM 🍽️), post_dinner(9:30 PM 🌙).
Prices in ${profile.currency}. Return ONLY the JSON object, nothing else:
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
}`

  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3500,
    temperature: 0.7,
  })

  const raw = res.choices[0]?.message?.content || ''
  return JSON.parse(extractJSON(raw))
}

export async function askFoodQuestion(question, foodContext, userProfile) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Nutritionist assistant. User: ${userProfile.goal} goal, ${userProfile.dietType} diet, ${userProfile.city} ${userProfile.country}. Food: ${foodContext}. Be concise, under 200 words, suggest local alternatives.`,
      },
      { role: 'user', content: question },
    ],
    max_tokens: 350,
    temperature: 0.5,
  })
  return res.choices[0]?.message?.content?.trim() || 'Unable to answer. Please try again.'
}

export async function optimizeDietPlan(question, currentPlan, userProfile) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Expert nutritionist. User: ${userProfile.goal} goal, ${userProfile.dietType} diet, ${userProfile.city} ${userProfile.country}. Daily target: ${currentPlan.calorieTarget} kcal. Give practical meal adjustments, be encouraging, under 300 words.`,
      },
      { role: 'user', content: question },
    ],
    max_tokens: 450,
    temperature: 0.6,
  })
  return res.choices[0]?.message?.content?.trim() || 'Unable to generate advice.'
}
