import 'server-only'
import OpenAI from 'openai'
import { planMetaPrompt, dayPlanPrompt, foodQuestionPrompt, optimizePlanPrompt, parseJSONResponse } from '../prompts'

// gpt-4o-mini is the best cost/accuracy tradeoff for structured nutrition JSON;
// override with OPENAI_MODEL if you want gpt-4o or a newer model.
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

let client = null
function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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

  const choice = res.choices[0]
  if (choice?.finish_reason === 'content_filter') {
    throw new Error('OpenAI declined the request (content_filter).')
  }
  return choice?.message?.content?.trim() || ''
}

export async function generatePlanMeta(profile) {
  const { system, user } = planMetaPrompt(profile)
  const raw = await chat(system, user, { maxTokens: 500, temperature: 0.3, jsonMode: true })
  return parseJSONResponse(raw, 'plan meta')
}

export async function generateDayPlan(profile, dayNumber, targets, previousFoods = []) {
  const { system, user } = dayPlanPrompt(profile, dayNumber, targets, previousFoods)
  const raw = await chat(system, user, { maxTokens: 4000, temperature: 0.7, jsonMode: true })
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
