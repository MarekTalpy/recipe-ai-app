import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

import { SavedStackParamList } from '../../navigation/types';

const RecipeDetailScreen = () => {
  const route = useRoute<RouteProp<SavedStackParamList, 'RecipeDetail'>>();

  const { title, recipeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text>Recipe ID: {recipeId}</Text>
      <Text>Detailed instructions will go here...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default RecipeDetailScreen;
