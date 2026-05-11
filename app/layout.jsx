import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'NutriPlan AI — Personalized Diet Charts',
  description: 'Get a personalized, AI-powered diet plan based on your goals, location, and food preferences.',
  keywords: ['diet plan', 'nutrition', 'weight loss', 'healthy eating', 'AI diet'],
  openGraph: {
    title: 'NutriPlan AI',
    description: 'Your personalized AI-powered diet chart',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-[#FAFAF7] text-[#1C1C1A] min-h-screen">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1C1C1A',
                color: '#FAFAF7',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
