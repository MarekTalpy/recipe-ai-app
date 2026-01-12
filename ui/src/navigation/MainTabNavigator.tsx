import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SavedRecipesScreen from '../screens/Saved/SavedRecipesScreen';
import { AIStack } from './AIStack';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const MainTabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="AIStack"
      component={AIStack}
      options={{
        tabBarLabel: 'AI Chef',
        tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="SavedRecipes"
      component={SavedRecipesScreen}
      options={{
        tabBarLabel: 'Saved Recipes',
        tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);
