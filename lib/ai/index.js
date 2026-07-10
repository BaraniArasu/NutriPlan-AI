import 'server-only'
import * as groq from './providers/groq'
import * as openai from './providers/openai'
import * as gemini from './providers/gemini'
import * as anthropic from './providers/anthropic'

// Switch providers with the AI_PROVIDER env var — no code changes needed.
// Defaults to Groq (free tier) so the app works out of the box for testing.
const PROVIDERS = { groq, openai, gemini, anthropic }

function getProvider() {
  const name = (process.env.AI_PROVIDER || 'groq').toLowerCase()
  const provider = PROVIDERS[name]
  if (!provider) {
    throw new Error(`Unknown AI_PROVIDER "${name}". Valid options: ${Object.keys(PROVIDERS).join(', ')}`)
  }
  return provider
}

export async function generatePlanMeta(profile) {
  return getProvider().generatePlanMeta(profile)
}

export async function generateDayPlan(profile, dayNumber, targets, previousFoods = []) {
  return getProvider().generateDayPlan(profile, dayNumber, targets, previousFoods)
}

export async function askFoodQuestion(question, foodContext, userProfile) {
  return getProvider().askFoodQuestion(question, foodContext, userProfile)
}

export async function optimizeDietPlan(question, currentPlan, userProfile) {
  return getProvider().optimizeDietPlan(question, currentPlan, userProfile)
}
