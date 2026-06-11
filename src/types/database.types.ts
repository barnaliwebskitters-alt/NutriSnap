export interface MealLog { 
  id?: string; 
  device_id: string; 
  log_date: string;             // YYYY-MM-DD 
  meal_type: "breakfast" | "lunch" | "dinner" | "snack"; 
  food_name: string; 
  serving_size?: string; 
  servings: number; 
  calories: number; 
  protein: number; 
  carbs: number; 
  fat: number; 
  fibre: number; 
  sugar: number; 
  sodium: number; 
  saturated_fat: number; 
  cholesterol: number; 
  source: "ai" | "quick_add" | "manual"; 
} 

export interface DailySummary { 
  device_id: string; 
  log_date: string; 
  total_calories: number; 
  total_protein: number; 
  total_carbs: number; 
  total_fat: number; 
  total_fibre: number; 
  total_sodium: number; 
  meal_count: number; 
} 

export interface UserProfile { 
  device_id: string; 
  display_name: string; 
  age?: number; 
  gender?: "male" | "female" | "other"; 
  height_cm?: number; 
  weight_kg?: number; 
  target_weight_kg?: number; 
  activity_level?: "sedentary" | "light" | "moderate" | "active" | "very_active"; 
  primary_goal: string;         // comma-separated e.g. "weight_loss,high_protein" 
  has_bp: boolean; 
  has_cholesterol: boolean; 
  has_diabetes: boolean; 
  has_thyroid: boolean; 
  goal_calories: number; 
  goal_protein: number; 
  goal_carbs: number; 
  goal_fat: number; 
  goal_fibre: number; 
  goal_sodium: number; 
} 

export interface NutritionResult { 
  name: string; 
  serving_size: string; 
  calories: number; 
  protein: number; 
  carbs: number; 
  fat: number; 
  fibre: number; 
  sugar: number; 
  sodium: number; 
  saturated_fat: number; 
  cholesterol: number; 
  confidence: "high" | "medium" | "low"; 
  insight?: string; 
} 
