// This represents a single ingredient identified by AI
export interface Ingredient {
  name: string;
  category?: string; // e.g., "vegetable", "dairy"
  confidence: number; // 0 to 1, how sure the AI is
}

// This represents the recipe returned by the AI
export interface Recipe {
  id: string;
  title: string;
  matchPercentage: number;
  prepTime: string;
  origin: string;
  description: string;
  ingredientsRequired: string[];
  instructions: string[];
  youtubeUrl?: string;
}

// The response structure for the AI recognition route
export interface IngredientRecognitionResponse {
  ingredients: Ingredient[];
  requestId: string;
}
