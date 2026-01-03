// This represents a single ingredient identified by AI
export interface Ingredient {
  name: string;
  category?: string; // e.g., "vegetable", "dairy"
  confidence: number; // 0 to 1, how sure the AI is
}
