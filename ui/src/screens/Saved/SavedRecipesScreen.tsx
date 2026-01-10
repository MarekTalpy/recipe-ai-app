import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

import { SavedStackParamList } from '../../navigation/types';

const SavedRecipesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<SavedStackParamList>>();

  return (
    <View style={styles.container}>
      <Text>Your Saved Recipes List</Text>
      <Button
        title="Go to Detail"
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: '1', title: 'Omelette' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SavedRecipesScreen;
