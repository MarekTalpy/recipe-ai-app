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
