'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { StepPersonalInfo } from '@/components/onboarding/StepPersonalInfo'
import { StepGoals } from '@/components/onboarding/StepGoals'
import { StepLocation } from '@/components/onboarding/StepLocation'
import { StepGenerating } from '@/components/onboarding/StepGenerating'

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore()

  const stepLabel =
    currentStep === 1 ? 'Personal Info' :
    currentStep === 2 ? 'Your Goals' :
    'Location & Food'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {currentStep <= 3 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#2D6A4F]">Step {currentStep} of 3</span>
            <span className="text-sm text-[#9E9A94]">{stepLabel}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${(currentStep / 3) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            {['Personal', 'Goals', 'Food & Location'].map((label, i) => (
              <span
                key={label}
                className={`text-xs font-medium ${i + 1 <= currentStep ? 'text-[#2D6A4F]' : 'text-[#9E9A94]'}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="animate-slide-up">
        {currentStep === 1 && <StepPersonalInfo />}
        {currentStep === 2 && <StepGoals />}
        {currentStep === 3 && <StepLocation />}
        {currentStep === 4 && <StepGenerating />}
      </div>
    </div>
  )
}
