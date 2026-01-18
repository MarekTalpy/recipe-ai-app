import { create } from 'zustand';
import { Ingredient } from '../types';
import { Recipe } from '../types/recipe';

interface RecipeState {
  selectedImage: string | null;
  ingredients: Ingredient[];
  recipes: Recipe[];
  ingredientsDetectionInProgress: boolean;
  isRecipesLoading: boolean;

  setSelectedImage: (imageUri: string | null) => void;
  addIngredients: (newIngredients: Ingredient[]) => void;
  addIngredient: (newIngredientName: string) => void;
  removeIngredient: (index: number) => void;
  setRecipes: (recipes: Recipe[]) => void;
  clearIngredients: () => void;
  setIngredientsDetectionInProgress: (status: boolean) => void;
  setRecipesLoading: (status: boolean) => void;
}

const useRecipeStore = create<RecipeState>((set) => ({
  selectedImage: null,
  ingredients: [],
  recipes: [],
  ingredientsDetectionInProgress: false,
  isRecipesLoading: false,

  setSelectedImage: (imageUri) => set({ selectedImage: imageUri }),

  addIngredient: (ingredientName) =>
    set((state) => ({
      ingredients: [...state.ingredients, { name: ingredientName, confidence: 1 }],
    })),

  addIngredients: (newIngredients) =>
    set((state) => ({
      ingredients: [...state.ingredients, ...newIngredients],
    })),

  removeIngredient: (index) =>
    set((state) => ({
      ingredients: state.ingredients.filter((_, i) => i !== index),
    })),

  setRecipes: (recipes) => set({ recipes }),

  setRecipesLoading: (status) => set({ isRecipesLoading: status }),

  setIngredientsDetectionInProgress: (status) => set({ ingredientsDetectionInProgress: status }),

  clearIngredients: () => set({ ingredients: [], selectedImage: null }),
}));

export default useRecipeStore;
