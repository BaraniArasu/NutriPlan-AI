// JSON Schemas shared by providers that support structured/guaranteed JSON output
// (currently used by the Anthropic provider's output_config.format).

export const PLAN_META_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'summary', 'calorieTarget', 'proteinTarget', 'carbsTarget', 'fatTarget', 'waterIntake', 'weeklyNotes'],
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    calorieTarget: { type: 'number' },
    proteinTarget: { type: 'number' },
    carbsTarget: { type: 'number' },
    fatTarget: { type: 'number' },
    waterIntake: { type: 'number' },
    weeklyNotes: { type: 'array', items: { type: 'string' } },
  },
}

const FOOD_ITEM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'name', 'quantity', 'unit', 'price', 'calories', 'protein', 'carbs', 'fat', 'fiber', 'nutrients', 'preparation', 'alternates', 'tips', 'warnings'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    quantity: { type: 'number' },
    unit: { type: 'string' },
    price: { type: 'number' },
    calories: { type: 'number' },
    protein: { type: 'number' },
    carbs: { type: 'number' },
    fat: { type: 'number' },
    fiber: { type: 'number' },
    nutrients: { type: 'array', items: { type: 'string' } },
    preparation: { type: 'string' },
    alternates: { type: 'array', items: { type: 'string' } },
    tips: { type: 'array', items: { type: 'string' } },
    warnings: { type: 'array', items: { type: 'string' } },
  },
}

const MEAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['mealId', 'mealLabel', 'time', 'emoji', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFat', 'totalPrice', 'notes', 'foods'],
  properties: {
    mealId: { type: 'string' },
    mealLabel: { type: 'string' },
    time: { type: 'string' },
    emoji: { type: 'string' },
    totalCalories: { type: 'number' },
    totalProtein: { type: 'number' },
    totalCarbs: { type: 'number' },
    totalFat: { type: 'number' },
    totalPrice: { type: 'number' },
    notes: { type: 'string' },
    foods: { type: 'array', items: FOOD_ITEM_SCHEMA },
  },
}

export const DAY_PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['day', 'dayLabel', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFat', 'totalPrice', 'dailyTip', 'meals'],
  properties: {
    day: { type: 'number' },
    dayLabel: { type: 'string' },
    totalCalories: { type: 'number' },
    totalProtein: { type: 'number' },
    totalCarbs: { type: 'number' },
    totalFat: { type: 'number' },
    totalPrice: { type: 'number' },
    dailyTip: { type: 'string' },
    meals: { type: 'array', items: MEAL_SCHEMA },
  },
}
