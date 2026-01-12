import { RouteProp, useRoute } from '@react-navigation/native';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import RecipeListItem from '@/src/components/RecipeListItem';
import { apiRequest } from '@/src/services/api';
import { Recipe } from '@/src/types/recipe';
import { useEffect, useState } from 'react';
import { AIStackParamList } from '../../navigation/types';

const RecipeListScreen = () => {
  const route = useRoute<RouteProp<AIStackParamList, 'RecipeList'>>();
  const { ingredients } = route.params;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const cleanIngredients = [...new Set(ingredients)];

      // TODO: later add some filter options for precision, maxPrepTime and limit
      const endpoint = `/recipes/match?precision=high&limit=3&maxPrepTime=45mins`;

      const data = await apiRequest(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: cleanIngredients }),
      });

      console.log('data?.recipes ', data?.recipes);

      setRecipes(data?.recipes ?? []);
    } catch (error: any) {
      console.error('Network Error:', error?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text>AI is analyzing your ingredients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeListItem recipe={item} userIngredients={ingredients.map((i) => i.name)} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default RecipeListScreen;
