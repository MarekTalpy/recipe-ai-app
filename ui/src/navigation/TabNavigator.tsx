import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AIStack } from './AIStack';
import { SavedRecipesStack } from './SavedRecipesStack';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="AITab"
      component={AIStack}
      options={{
        tabBarLabel: 'AI Chef',
        tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="SavedTab"
      component={SavedRecipesStack}
      options={{
        tabBarLabel: 'Saved',
        tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);
