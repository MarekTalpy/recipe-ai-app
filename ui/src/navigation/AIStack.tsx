import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IngredientScanScreen from '../screens/AI/IngredientScanScreen';
import RecipeListScreen from '../screens/AI/RecipeListScreen';
import { AIStackParamList } from './types';

const Stack = createNativeStackNavigator<AIStackParamList>();

export const AIStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="IngredientScan" component={IngredientScanScreen} options={{ title: 'Scan Fridge' }} />
    <Stack.Screen name="RecipeList" component={RecipeListScreen} options={{ title: 'Suggested Recipes' }} />
  </Stack.Navigator>
);
