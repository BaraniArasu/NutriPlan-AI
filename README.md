# 🥗 NutriPlan AI — Personalized Diet Chart App

A full-stack Next.js 14 application that generates personalized 7-day AI-powered diet plans based on user profile, location, goals, and food preferences.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Authentication | NextAuth v5 (Google OAuth) |
| Database | PostgreSQL via Prisma ORM |
| AI | Google Gemini 2.0 Flash |
| Styling | Tailwind CSS |
| State | Zustand (with persistence) |
| Fonts | Playfair Display + DM Sans |

---

## 📋 Features

1. **3-Step Onboarding** — Personal info, goals with timeline warnings, location & food preferences
2. **AI Diet Generation** — GPT-4o creates a unique 7-day plan with local foods & INR prices
3. **Interactive Diet View** — Expand/collapse meals, adjust food quantities with +/−
4. **Food Q&A** — Click the ❓ icon on any food for AI-powered answers
5. **Plan Optimizer** — Floating button to ask diet questions (cheat meals, adjustments)
6. **Login Gate** — Shows first 2 meals free, login to unlock full 7-day plan
7. **Auto-save** — Plans saved to DB on login, accessible from dashboard
8. **Dashboard** — View BMI, goals, history, generate new plans
9. **Mobile-first** — Fully responsive, touch-optimized UI

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database (use [Neon](https://neon.tech) for free cloud Postgres)
- Google OAuth credentials
- OpenAI API key

### 2. Clone & Install

```bash
git clone <your-repo>
cd diet-app
npm install
```

### 3. Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/dietapp?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google OAuth — get from https://console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini — free key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIza..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API** and **OAuth 2.0**
4. Create OAuth credentials → Web application
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)

### 5. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy!

Vercel auto-detects Next.js and configures everything.

---

## 📁 Project Structure

```
diet-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── diet/generate/         # Diet plan generation
│   │   ├── diet/optimize/         # Plan optimization
│   │   ├── food/query/            # Food Q&A
│   │   └── user/plans/            # User plan history
│   ├── auth/signin/               # Sign-in page
│   ├── dashboard/                 # User dashboard
│   ├── diet/                      # Diet plan view
│   ├── onboarding/                # 3-step setup
│   ├── globals.css                # Design tokens + utilities
│   └── layout.tsx                 # Root layout
├── components/
│   ├── dashboard/                 # Dashboard components
│   ├── diet/                      # Diet page components
│   │   ├── DietHeader.tsx
│   │   ├── DietDayTabs.tsx
│   │   ├── DietMealCard.tsx       # Food items with +/− controls
│   │   ├── DietSummaryBar.tsx
│   │   ├── FoodQueryModal.tsx     # AI food Q&A popup
│   │   ├── LoginPromptOverlay.tsx # Login gate
│   │   └── DietOptimizeButton.tsx # Floating plan optimizer
│   └── onboarding/
│       ├── StepPersonalInfo.tsx
│       ├── StepGoals.tsx          # With timeline warnings
│       ├── StepLocation.tsx       # Geolocation + preferences
│       └── StepGenerating.tsx     # Loading animation
├── lib/
│   ├── auth.ts                    # NextAuth config
│   ├── openai.ts                  # GPT-4o diet generation
│   ├── prisma.ts                  # Prisma client
│   └── utils.ts                   # BMI, timeline, formatting
├── prisma/
│   └── schema.prisma              # Database schema
├── store/
│   └── onboarding.ts              # Zustand store
└── types/
    └── next-auth.d.ts             # Type extensions
```

---

## 🔧 Customization

### Change currency
In `lib/openai.ts`, update the `currency` field in the profile object.

### Add meal types
In `lib/openai.ts`, modify the prompt to add/remove meal slots.

### Change AI model
In `lib/openai.ts`, update `model: 'gemini-2.0-flash'` to any Gemini model (e.g. `gemini-1.5-pro` for higher quality, `gemini-2.0-flash-lite` for faster/cheaper).

### Extend DB schema
Edit `prisma/schema.prisma` and run `npx prisma db push`.

---

## 🛡️ Security Notes

- Never commit `.env.local` to git (already in `.gitignore`)
- `NEXTAUTH_SECRET` must be a strong random string
- API routes validate session before saving to DB
- Diet generation works for guests but doesn't persist without login

---

## 📱 Mobile Support

- Responsive design works on all screen sizes
- Geolocation API for automatic city detection
- Touch-optimized quantity controls
- Bottom sheet modals on mobile

---

## 🐛 Troubleshooting

**Prisma errors:** Run `npx prisma generate` after any schema change

**Auth errors:** Check `NEXTAUTH_URL` matches your actual URL exactly

**Gemini timeout:** Diet plan generation can take 10–20s — this is normal. `gemini-2.0-flash` is fast; use `gemini-1.5-pro` if you want higher quality.

**Google OAuth error:** Ensure redirect URI in Google Console matches exactly (including trailing slash)
# NutriPlan-AI
