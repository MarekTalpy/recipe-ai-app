import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';

import RecipeDetailScreen from '../screens/Saved/RecipeDetailScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#1A1A1A',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />

      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={({ route }): NativeStackNavigationOptions => ({
          title: route.params?.recipe?.title ?? 'Recipe Details',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: 'Back',
          headerBackVisible: true,
        })}
      />
    </Stack.Navigator>
  );
};
