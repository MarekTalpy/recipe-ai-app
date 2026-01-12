import { Ingredient } from '../types';
import { Recipe } from '../types/recipe';

export type RootStackParamList = {
  MainTabs: undefined;
  RecipeDetail: { recipe: Recipe };
};

export type TabParamList = {
  AIStack: undefined;
  SavedRecipes: undefined;
};

export type AIStackParamList = {
  IngredientScan: undefined;
  RecipeList: { ingredients: Ingredient[] };
};
