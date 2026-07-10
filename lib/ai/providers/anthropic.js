import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { planMetaPrompt, dayPlanPrompt, foodQuestionPrompt, optimizePlanPrompt } from '../prompts'
import { PLAN_META_SCHEMA, DAY_PLAN_SCHEMA } from '../schemas'

// Opus 4.8 is Anthropic's most capable Opus-tier model; override with
// ANTHROPIC_MODEL (e.g. "claude-sonnet-5") for a cheaper/faster tier.
// Note: Claude 4.6+ models reject temperature/top_p/top_k — depth is tuned
// with output_config.effort instead.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8'

let client = null
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

function textOf(response) {
  if (response.stop_reason === 'refusal') {
    throw new Error('Claude declined the request (safety refusal).')
  }
  const block = response.content.find((b) => b.type === 'text')
  return block?.text?.trim() || ''
}

async function createStructured(system, user, schema, schemaName, { maxTokens, effort }) {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    output_config: {
      effort,
      format: { type: 'json_schema', schema: { name: schemaName, schema } },
    },
    messages: [{ role: 'user', content: user }],
  })
  return JSON.parse(textOf(response))
}

async function createText(system, user, { maxTokens, effort }) {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    output_config: { effort },
    messages: [{ role: 'user', content: user }],
  })
  return textOf(response)
}

export async function generatePlanMeta(profile) {
  const { system, user } = planMetaPrompt(profile)
  return createStructured(system, user, PLAN_META_SCHEMA, 'plan_meta', { maxTokens: 600, effort: 'low' })
}

export async function generateDayPlan(profile, dayNumber, targets, previousFoods = []) {
  const { system, user } = dayPlanPrompt(profile, dayNumber, targets, previousFoods)
  return createStructured(system, user, DAY_PLAN_SCHEMA, 'day_plan', { maxTokens: 4096, effort: 'medium' })
}

export async function askFoodQuestion(question, foodContext, userProfile) {
  const { system, user } = foodQuestionPrompt(question, foodContext, userProfile)
  const answer = await createText(system, user, { maxTokens: 400, effort: 'low' })
  return answer || 'Unable to answer. Please try again.'
}

export async function optimizeDietPlan(question, currentPlan, userProfile) {
  const { system, user } = optimizePlanPrompt(question, currentPlan, userProfile)
  const answer = await createText(system, user, { maxTokens: 500, effort: 'medium' })
  return answer || 'Unable to generate advice.'
}
