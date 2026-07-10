import 'server-only'

// In-memory sliding-window rate limiter for the AI-calling routes.
// Scope caveat: state is per server instance — on serverless (Vercel) each warm
// instance counts separately, so real-world limits are up to N× the configured
// value. That still stops runaway loops and casual abuse; swap the Map for
// Redis/Upstash if you need exact global limits.

const buckets = new Map()
const MAX_BUCKETS = 10_000

function prune(now) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, timestamps] of buckets) {
    if (timestamps.length === 0 || now - timestamps[timestamps.length - 1] > 60 * 60 * 1000) {
      buckets.delete(key)
    }
  }
}

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now()
  prune(now)

  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs)
  if (timestamps.length >= limit) {
    const retryAfterSeconds = Math.ceil((timestamps[0] + windowMs - now) / 1000)
    buckets.set(key, timestamps)
    return { ok: false, retryAfterSeconds }
  }

  timestamps.push(now)
  buckets.set(key, timestamps)
  return { ok: true }
}

// Identity for limiting: the logged-in user id when available, otherwise the
// client IP. Both are per-route-group so one route can't exhaust another's quota.
export function rateLimitIdentity(session, req, routeGroup) {
  if (session?.user?.id) return `${routeGroup}:user:${session.user.id}`
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `${routeGroup}:ip:${ip}`
}
