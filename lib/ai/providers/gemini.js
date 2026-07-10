import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { planMetaPrompt, dayPlanPrompt, foodQuestionPrompt, optimizePlanPrompt, parseJSONResponse } from '../prompts'

// gemini-2.0-flash is fast and cheap enough for structured nutrition JSON;
// override with GEMINI_MODEL if you want a different Gemini model.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

let genAI = null
function getClient() {
  if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return genAI
}

async function generate(system, user, { maxTokens, temperature, jsonMode = false }) {
  const model = getClient().getGenerativeModel({
    model: MODEL,
    systemInstruction: system,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  })
  const result = await model.generateContent(user)
  const response = result.response

  if (response.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the request (${response.promptFeedback.blockReason}).`)
  }
  return response.text()?.trim() || ''
}

export async function generatePlanMeta(profile) {
  const { system, user } = planMetaPrompt(profile)
  const raw = await generate(system, user, { maxTokens: 500, temperature: 0.3, jsonMode: true })
  return parseJSONResponse(raw, 'plan meta')
}

export async function generateDayPlan(profile, dayNumber, targets, previousFoods = []) {
  const { system, user } = dayPlanPrompt(profile, dayNumber, targets, previousFoods)
  const raw = await generate(system, user, { maxTokens: 4000, temperature: 0.7, jsonMode: true })
  return parseJSONResponse(raw, 'day plan')
}

export async function askFoodQuestion(question, foodContext, userProfile) {
  const { system, user } = foodQuestionPrompt(question, foodContext, userProfile)
  const answer = await generate(system, user, { maxTokens: 350, temperature: 0.5 })
  return answer || 'Unable to answer. Please try again.'
}

export async function optimizeDietPlan(question, currentPlan, userProfile) {
  const { system, user } = optimizePlanPrompt(question, currentPlan, userProfile)
  const answer = await generate(system, user, { maxTokens: 450, temperature: 0.6 })
  return answer || 'Unable to generate advice.'
}
