import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { RootStackParamList } from '../navigation/types';

const RecipeDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RecipeDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'>>();
  const { recipe } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: recipe?.title ?? 'Recipe Details',
    });
  }, [recipe?.title]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaBadge}>{recipe.origin}</Text>
          <Text style={styles.metaBadge}>{recipe.prepTime}</Text>
          <Text style={[styles.metaBadge, { backgroundColor: '#E8F5E9', color: '#2E7D32' }]}>
            {recipe.matchPercentage}% Match
          </Text>
        </View>
        <Text style={styles.description}>{recipe.description}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredientsRequired.map((ingredient, index) => (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ingredientText}>{ingredient}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {recipe.instructions.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  metaBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  description: { fontSize: 16, color: '#4A4A4A', lineHeight: 24 },
  divider: { height: 8, backgroundColor: '#F8F9FA' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 15 },
  ingredientItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  bullet: { fontSize: 18, color: '#FF6347', marginRight: 10, lineHeight: 22 },
  ingredientText: { fontSize: 16, color: '#333', lineHeight: 22 },
  stepRow: { flexDirection: 'row', marginBottom: 20 },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  stepContent: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 15 },
  stepText: { fontSize: 16, color: '#333', lineHeight: 24 },
});

export default RecipeDetailScreen;
