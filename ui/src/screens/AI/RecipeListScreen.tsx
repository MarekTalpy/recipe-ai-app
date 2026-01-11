import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AIStackParamList } from '../../navigation/types';

const RecipeListScreen = () => {
  const route = useRoute<RouteProp<AIStackParamList, 'RecipeList'>>();
  const { ingredients } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detected Ingredients</Text>
      <Text style={styles.subtitle}>AI found {ingredients.length} items in your fridge:</Text>

      <View style={styles.listContainer}>
        {ingredients.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.ingredientItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  listContainer: {
    marginTop: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  bullet: {
    fontSize: 18,
    marginRight: 10,
    color: '#4CAF50',
  },
  itemText: {
    fontSize: 18,
    color: '#444',
  },
});

export default RecipeListScreen;
