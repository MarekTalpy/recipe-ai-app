export type AIStackParamList = {
  IngredientScan: undefined;
  RecipeList: { ingredients: string[] };
};

export type SavedStackParamList = {
  SavedRecipes: undefined;
  RecipeDetail: { recipeId: string; title: string };
};

export type RootTabParamList = {
  AITab: undefined;
  SavedTab: undefined;
};
