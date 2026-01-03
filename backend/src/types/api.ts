import { Ingredient } from './ingredient';

// The response structure for the AI recognition route
export interface IngredientRecognitionResponse {
  ingredients: Ingredient[];
  requestId: string;
}
