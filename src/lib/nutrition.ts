import axios from "axios";

const EDAMAM_API = "https://api.edamam.com/api/nutrition-data";

export interface NutritionPlan {
  meals: Array<{
    time: string;
    food: string[];
    nutrients?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }>;
}

export async function getNutritionPlan(
  condition: string,
): Promise<NutritionPlan> {
  // Simulated response until Edamam API is set up
  const plans = {
    diabetes: {
      meals: [
        {
          time: "Breakfast",
          food: ["Oatmeal with berries", "Greek yogurt", "Almonds"],
          nutrients: { calories: 350, protein: 15, carbs: 45, fat: 12 },
        },
        {
          time: "Lunch",
          food: ["Grilled chicken salad", "Quinoa", "Avocado"],
          nutrients: { calories: 450, protein: 35, carbs: 35, fat: 20 },
        },
        {
          time: "Dinner",
          food: ["Baked salmon", "Roasted vegetables", "Brown rice"],
          nutrients: { calories: 500, protein: 40, carbs: 40, fat: 22 },
        },
      ],
    },
    hypertension: {
      meals: [
        {
          time: "Breakfast",
          food: ["Whole grain toast", "Egg whites", "Fresh fruit"],
          nutrients: { calories: 300, protein: 20, carbs: 40, fat: 8 },
        },
        {
          time: "Lunch",
          food: ["Lean turkey wrap", "Mixed greens", "Low-fat yogurt"],
          nutrients: { calories: 400, protein: 30, carbs: 45, fat: 12 },
        },
        {
          time: "Dinner",
          food: ["Grilled fish", "Steamed vegetables", "Quinoa"],
          nutrients: { calories: 450, protein: 35, carbs: 35, fat: 18 },
        },
      ],
    },
  };

  return plans[condition as keyof typeof plans] || plans.diabetes;
}
