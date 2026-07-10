# 🥗 NutriPlan AI — Personalized Diet Chart App

A full-stack Next.js 14 application that generates personalized 7-day AI-powered diet plans based on user profile, location, goals, and food preferences — with a pluggable AI backend (Groq, OpenAI, Gemini, or Anthropic Claude) switched by a single environment variable.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Authentication | NextAuth v5 (Google OAuth) + Prisma adapter |
| Database | PostgreSQL via Prisma ORM |
| AI | Multi-provider: Groq (free, default) / OpenAI / Google Gemini / Anthropic Claude |
| Styling | Tailwind CSS + Radix UI primitives |
| State | Zustand (persisted) |
| Fonts | Playfair Display + DM Sans |

---

## 📋 Features

1. **3-Step Onboarding** — Personal info, goals with timeline safety warnings, location (geolocation auto-detect) & food preferences
2. **AI Diet Generation** — Day-by-day 7-day plan with local foods, real prices in your currency, and no repeated meals across days
3. **Interactive Diet View** — Expand/collapse meals, adjust food quantities with +/− (persisted across refreshes)
4. **Food Q&A** — Click the ❓ icon on any food for AI-powered answers scoped to that food and your goals
5. **Plan Optimizer** — Floating button to ask diet questions (cheat meals, adjustments); conversations are saved to your plan
6. **Login Gate** — Anonymous users see the first 2 meals per day free; login unlocks the full plan
7. **Auto-save & Sync** — For logged-in users the plan record stays in sync in the DB as each day is generated
8. **Dashboard** — BMI, goal progress computed from real weight logs, plan history, one-click new plan
9. **Weight Tracking** — Log your weight from the dashboard; the progress bar and BMI update from actual data
10. **Rate Limiting** — AI-calling routes are throttled per user/IP to protect your API spend
11. **Mobile-first** — Fully responsive, touch-optimized UI

---

## 🤖 AI Provider Switching

All AI calls go through `lib/ai/`, which picks a provider at request time from the `AI_PROVIDER` env var — **no code changes needed to switch**:

```env
AI_PROVIDER="groq"     # groq | openai | gemini | anthropic
```

| Provider | Default model | Env vars | Notes |
|----------|---------------|----------|-------|
| `groq` | `llama-3.3-70b-versatile` | `GROQ_API_KEY`, `GROQ_MODEL` | Free tier — good for development |
| `openai` | `gpt-4o-mini` | `OPENAI_API_KEY`, `OPENAI_MODEL` | JSON mode via `response_format` |
| `gemini` | `gemini-2.0-flash` | `GEMINI_API_KEY`, `GEMINI_MODEL` | JSON via `responseMimeType` |
| `anthropic` | `claude-opus-4-8` | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Guaranteed-schema structured outputs |

Only the key for the **active** provider is required — missing keys for unused providers never crash the app.

### Layout

```
lib/ai/
├── index.js              # Provider switch — the only import the app uses
├── prompts.js            # Shared prompt text + defensive JSON parsing
├── schemas.js            # JSON schemas (used by Anthropic structured outputs)
└── providers/
    ├── groq.js
    ├── openai.js
    ├── gemini.js
    └── anthropic.js
```

Each provider implements the same four functions: `generatePlanMeta`, `generateDayPlan`, `askFoodQuestion`, `optimizeDietPlan`.

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js 20+
- PostgreSQL database (use [Neon](https://neon.tech) for free cloud Postgres)
- Google OAuth credentials
- An API key for at least one AI provider (Groq is free: https://console.groq.com)

### 2. Clone & Install

```bash
git clone <your-repo>
cd diet-app
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values. The essentials:

```env
DATABASE_URL="postgresql://user:password@host:5432/dietapp?sslmode=require"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

AI_PROVIDER="groq"
GROQ_API_KEY="gsk_..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth credentials → Web application
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)

### 5. Database Setup

```bash
npx prisma generate    # generate the client
npx prisma db push     # create/update tables
npx prisma studio      # optional: browse data
```

### 6. Run

```bash
npm run dev    # development server on :3000
npm test       # unit tests (prompt helpers, validation, BMI/timeline logic)
npm run build  # production build
```

---

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

> **Note on rate limiting:** the built-in limiter is in-memory (per serverless instance). It stops runaway loops and casual abuse, but for exact global limits swap `lib/rate-limit.js` for a Redis/Upstash-backed implementation.

---

## 📁 Project Structure

```
diet-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── diet/generate/         # Plan meta + per-day generation (rate limited)
│   │   ├── diet/optimize/         # Plan optimizer chat (persisted, rate limited)
│   │   ├── diet/save/             # Create/update the plan record in the DB
│   │   ├── food/query/            # Food Q&A chat (persisted, rate limited)
│   │   └── user/
│   │       ├── plans/             # Plan history
│   │       └── weight/            # Weight logging
│   ├── auth/signin/               # Sign-in page
│   ├── dashboard/                 # Dashboard (auth required)
│   ├── diet/                      # Diet plan view
│   └── onboarding/                # 3-step setup + generating screen
├── components/
│   ├── dashboard/DashboardClient.jsx   # Stats, real goal progress, weight logging
│   ├── diet/                           # Meal cards, tabs, Q&A modal, optimizer
│   └── onboarding/                     # Step components
├── lib/
│   ├── ai/                        # Multi-provider AI layer (see above)
│   ├── auth.js                    # NextAuth config
│   ├── planStorage.js             # Client-side plan persistence (localStorage)
│   ├── prisma.js                  # Prisma client
│   ├── rate-limit.js              # Sliding-window rate limiter
│   └── utils.js                   # BMI, timeline safety, validation, formatting
├── prisma/schema.prisma           # User, UserProfile, DietPlan, ChatMessage, WeightLog
├── store/onboarding.js            # Zustand store (persisted)
└── tests/                         # node --test suites
```

---

## 🔧 Customization

- **Switch AI provider/model** — set `AI_PROVIDER` and the matching `*_MODEL` env var; restart. No code changes.
- **Change meal slots** — edit the prompt in `lib/ai/prompts.js` (`dayPlanPrompt`); all providers pick it up automatically.
- **Adjust rate limits** — the per-route limits live at the top of each route file in `app/api/`.
- **Extend DB schema** — edit `prisma/schema.prisma`, then `npx prisma db push` (keep changes additive for existing users).

---

## 🛡️ Security Notes

- Never commit `.env` to git (already in `.gitignore`)
- `NEXTAUTH_SECRET` must be a strong random string
- API routes validate session before writing; chat/plan writes verify the record belongs to the requesting user
- AI keys are used server-side only (`server-only` guards the AI layer from client bundling)
- AI-calling routes are rate limited per user/IP

---

## 🐛 Troubleshooting

- **Prisma errors:** run `npx prisma generate` after any schema change
- **Auth errors:** check `NEXTAUTH_URL` matches your actual URL exactly
- **Slow generation:** each day takes ~10s on Groq's free tier — this is normal
- **429 Too Many Requests:** you hit the per-hour AI rate limit; wait or raise the limits in the route files
- **Google OAuth error:** redirect URI in Google Console must match exactly
