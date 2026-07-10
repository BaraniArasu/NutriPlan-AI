'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FoodQueryModal } from '@/components/diet/FoodQueryModal'
import { getStoredQuantities, storeQuantities } from '@/lib/planStorage'
import { HelpCircle, Plus, Minus, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react'

export function DietMealCard({ meal, userProfile, planId, isLoggedIn }) {
  // Adjusted quantities persist in localStorage (food ids are unique across
  // the whole plan), so a refresh or reopened tab keeps the user's changes.
  const [quantities, setQuantities] = useState(() => getStoredQuantities())
  const [queryFood, setQueryFood] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  const getQty = (food) => quantities[food.id] !== undefined ? quantities[food.id] : food.quantity

  const changeQty = (food, delta) => {
    const current = getQty(food)
    const step = food.unit === 'ml' || food.unit === 'g' ? 25 : 1
    const next = Math.max(step, current + delta * step)
    setQuantities((q) => {
      // Merge over fresh storage so sibling meal cards' writes aren't clobbered
      const updated = { ...getStoredQuantities(), ...q, [food.id]: next }
      storeQuantities(updated)
      return updated
    })
  }

  const totalCalories = meal.foods.reduce((sum, f) => {
    const ratio = getQty(f) / f.quantity
    return sum + Math.round(f.calories * ratio)
  }, 0)

  const totalPrice = meal.foods.reduce((sum, f) => {
    const ratio = getQty(f) / f.quantity
    return sum + f.price * ratio
  }, 0)

  return (
    <>
      <div className="meal-card">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#FAFAF7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{meal.emoji}</span>
            <div className="text-left">
              <p className="font-semibold text-[#1C1C1A] text-sm">{meal.mealLabel}</p>
              <p className="text-xs text-[#9E9A94]">{meal.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-[#2D6A4F]">{totalCalories} kcal</p>
              <p className="text-xs text-[#9E9A94] flex items-center justify-end gap-0.5">
                <IndianRupee className="w-2.5 h-2.5" />
                {Math.round(totalPrice)}
              </p>
            </div>
            {collapsed
              ? <ChevronDown className="w-4 h-4 text-[#9E9A94]" />
              : <ChevronUp className="w-4 h-4 text-[#9E9A94]" />
            }
          </div>
        </button>

        {!collapsed && meal.notes && (
          <div className="mx-4 mb-3 p-3 bg-[#F2F0EB] rounded-lg">
            <p className="text-xs text-[#6B6760]">{meal.notes}</p>
          </div>
        )}

        {!collapsed && (
          <div className="border-t border-[#F2F0EB]">
            {meal.foods.map((food) => {
              const qty = getQty(food)
              const ratio = qty / food.quantity
              const calories = Math.round(food.calories * ratio)
              const protein = (food.protein * ratio).toFixed(1)
              const carbs = (food.carbs * ratio).toFixed(1)
              const fat = (food.fat * ratio).toFixed(1)
              const price = food.price * ratio

              return (
                <div key={food.id} className="food-row">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-semibold text-sm text-[#1C1C1A] truncate">{food.name}</p>
                      <button
                        onClick={() => setQueryFood(food)}
                        className="shrink-0 w-6 h-6 rounded-full bg-[#EBF5FB] text-[#2980B9] flex items-center justify-center hover:bg-[#2980B9] hover:text-white transition-all duration-200"
                        title="Ask about this food"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="nutrient-pill">🔥 {calories} kcal</span>
                      <span className="nutrient-pill">💪 {protein}g P</span>
                      <span className="nutrient-pill">🌾 {carbs}g C</span>
                      <span className="nutrient-pill">🫒 {fat}g F</span>
                      {food.fiber > 0 && (
                        <span className="nutrient-pill">🌿 {(food.fiber * ratio).toFixed(1)}g fiber</span>
                      )}
                    </div>

                    {food.nutrients && food.nutrients.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {food.nutrients.slice(0, 3).map((n) => (
                          <span key={n} className="badge badge-green text-[10px]">{n}</span>
                        ))}
                      </div>
                    )}

                    {food.warnings && food.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-1.5 mt-1.5">
                        <AlertTriangle className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#E67E22]">{w}</p>
                      </div>
                    ))}

                    {food.tips && food.tips.map((t, i) => (
                      <div key={i} className="flex items-start gap-1.5 mt-1">
                        <Lightbulb className="w-3 h-3 text-[#D4A853] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#6B6760]">{t}</p>
                      </div>
                    ))}

                    {food.preparation && (
                      <p className="text-[11px] text-[#9E9A94] mt-1 italic">📝 {food.preparation}</p>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <p className="text-xs font-semibold text-[#8E44AD] flex items-center gap-0.5">
                      <IndianRupee className="w-2.5 h-2.5" />
                      {Math.round(price)}
                    </p>
                    <div className="flex items-center gap-1 bg-[#F2F0EB] rounded-lg p-1">
                      <button
                        onClick={() => changeQty(food, -1)}
                        className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-[#2D6A4F] hover:bg-[#D8F3DC] transition-colors shadow-sm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#1C1C1A] min-w-[44px] text-center">
                        {qty}{food.unit}
                      </span>
                      <button
                        onClick={() => changeQty(food, 1)}
                        className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-[#2D6A4F] hover:bg-[#D8F3DC] transition-colors shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!collapsed && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAF7] border-t border-[#F2F0EB]">
            <div className="flex gap-4 text-xs text-[#6B6760]">
              <span>P: <strong>{meal.foods.reduce((s, f) => s + f.protein * (getQty(f) / f.quantity), 0).toFixed(1)}g</strong></span>
              <span>C: <strong>{meal.foods.reduce((s, f) => s + f.carbs * (getQty(f) / f.quantity), 0).toFixed(1)}g</strong></span>
              <span>F: <strong>{meal.foods.reduce((s, f) => s + f.fat * (getQty(f) / f.quantity), 0).toFixed(1)}g</strong></span>
            </div>
            <p className="text-xs font-bold text-[#2D6A4F]">{totalCalories} kcal total</p>
          </div>
        )}
      </div>

      {queryFood && (
        <FoodQueryModal
          food={queryFood}
          userProfile={userProfile}
          planId={planId}
          onClose={() => setQueryFood(null)}
        />
      )}
    </>
  )
}
