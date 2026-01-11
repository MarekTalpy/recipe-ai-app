import { Ingredient } from '../types';

export type AIStackParamList = {
  IngredientScan: undefined;
  RecipeList: { ingredients: Ingredient[] };
};

export type SavedStackParamList = {
  SavedRecipes: undefined;
  RecipeDetail: { recipeId: string; title: string };
};

export type RootTabParamList = {
  AITab: undefined;
  SavedTab: undefined;
};
