import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialData = {
  name: '', age: null, gender: '', weight: null, height: null,
  measureUnit: 'metric', chest: null, waist: null, hips: null, arms: null, thighs: null,
  currentWeight: null, targetWeight: null, timelineWeeks: null, goal: '',
  activityLevel: 'moderately_active', city: '', country: 'India', location: '',
  latitude: null, longitude: null, dietType: '', allergies: [], dislikedFoods: [],
  preferredCuisine: 'local', budgetPerDay: 200,
}

export const useOnboardingStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      data: initialData,
      setStep: (step) => set({ currentStep: step }),
      updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
      reset: () => set({ currentStep: 1, data: initialData }),
    }),
    { name: 'diet-onboarding' }
  )
)
