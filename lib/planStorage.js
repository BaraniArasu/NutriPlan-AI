// Client-side storage for the anonymous/in-progress diet plan.
// localStorage (not sessionStorage) so a logged-out user who closes the tab
// doesn't silently lose a plan that cost several AI calls to generate.
// Migrates any values left in sessionStorage by older versions of the app.

const KEYS = ['dietPlan', 'userProfile', 'planId', 'dietQuantities']

function migrate() {
  try {
    for (const key of KEYS) {
      const legacy = sessionStorage.getItem(key)
      if (legacy !== null && localStorage.getItem(key) === null) {
        localStorage.setItem(key, legacy)
      }
      if (legacy !== null) sessionStorage.removeItem(key)
    }
  } catch {
    // storage unavailable (private mode/quota) — proceed with in-memory state
  }
}

export function getStoredPlan() {
  try {
    migrate()
    return {
      plan: JSON.parse(localStorage.getItem('dietPlan') || 'null'),
      profile: JSON.parse(localStorage.getItem('userProfile') || 'null'),
      planId: localStorage.getItem('planId'),
    }
  } catch {
    return { plan: null, profile: null, planId: null }
  }
}

export function storePlan(plan) {
  try { localStorage.setItem('dietPlan', JSON.stringify(plan)) } catch {}
}

export function storeProfile(profile) {
  try { localStorage.setItem('userProfile', JSON.stringify(profile)) } catch {}
}

export function storePlanId(planId) {
  try {
    if (planId) localStorage.setItem('planId', planId)
    else localStorage.removeItem('planId')
  } catch {}
}

export function getStoredQuantities() {
  try {
    migrate()
    return JSON.parse(localStorage.getItem('dietQuantities') || '{}')
  } catch {
    return {}
  }
}

export function storeQuantities(quantities) {
  try { localStorage.setItem('dietQuantities', JSON.stringify(quantities)) } catch {}
}

// A fresh onboarding run replaces the previous plan and its adjustments.
export function clearStoredQuantities() {
  try { localStorage.removeItem('dietQuantities') } catch {}
}
