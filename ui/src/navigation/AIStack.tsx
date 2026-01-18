import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IngredientScanScreen from '../screens/RecipesScreen';
import { AIStackParamList } from './types';

const Stack = createNativeStackNavigator<AIStackParamList>();

export const AIStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: '#1A1A1A',
      headerTitleStyle: { fontWeight: 'bold' },
      headerBackTitle: 'Back',
    }}
  >
    <Stack.Screen
      name="IngredientScan"
      component={IngredientScanScreen}
      options={{
        title: 'Scan Fridge',
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
