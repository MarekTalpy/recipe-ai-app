import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipeDetailScreen from '../screens/Saved/RecipeDetailScreen';
import SavedRecipesScreen from '../screens/Saved/SavedRecipesScreen';
import { SavedStackParamList } from './types';

const Stack = createNativeStackNavigator<SavedStackParamList>();

export const SavedRecipesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{ title: 'My Recipes' }} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Instructions' }} />
  </Stack.Navigator>
);
