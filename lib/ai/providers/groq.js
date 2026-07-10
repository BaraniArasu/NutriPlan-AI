import 'server-only'
import Groq from 'groq-sdk'
import { planMetaPrompt, dayPlanPrompt, foodQuestionPrompt, optimizePlanPrompt, parseJSONResponse } from '../prompts'

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

let client = null
function getClient() {
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return client
}

async function chat(system, user, { maxTokens, temperature, jsonMode = false }) {
  const res = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    max_tokens: maxTokens,
    temperature,
    ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
  })
  return res.choices[0]?.message?.content?.trim() || ''
}

export async function generatePlanMeta(profile) {
  const { system, user } = planMetaPrompt(profile)
  const raw = await chat(system, user, { maxTokens: 400, temperature: 0.3, jsonMode: true })
  return parseJSONResponse(raw, 'plan meta')
}

export async function generateDayPlan(profile, dayNumber, targets, previousFoods = []) {
  const { system, user } = dayPlanPrompt(profile, dayNumber, targets, previousFoods)
  const raw = await chat(system, user, { maxTokens: 3500, temperature: 0.7, jsonMode: true })
  return parseJSONResponse(raw, 'day plan')
}

export async function askFoodQuestion(question, foodContext, userProfile) {
  const { system, user } = foodQuestionPrompt(question, foodContext, userProfile)
  const answer = await chat(system, user, { maxTokens: 350, temperature: 0.5 })
  return answer || 'Unable to answer. Please try again.'
}

export async function optimizeDietPlan(question, currentPlan, userProfile) {
  const { system, user } = optimizePlanPrompt(question, currentPlan, userProfile)
  const answer = await chat(system, user, { maxTokens: 450, temperature: 0.6 })
  return answer || 'Unable to generate advice.'
}
