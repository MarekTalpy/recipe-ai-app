import { NavigationContainer } from '@react-navigation/native';

import { RootStackNavigator } from './RootStackNavigator';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
