import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { Recipe } from '../types/recipe';

interface RecipeListItemProps {
  recipe: Recipe;
  userIngredients: string[];
}

const RecipeListItem = ({ recipe, userIngredients }: RecipeListItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Extract ingredients the user doesn't have
  const missingIngredients = recipe.ingredientsRequired.filter(
    (req) => !userIngredients.some((have) => req.toLowerCase().includes(have.toLowerCase()))
  );

  const handleYoutubePress = async () => {
    if (!recipe.youtubeUrl) return;
    try {
      await Linking.openURL(recipe.youtubeUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open YouTube');
    }
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('RecipeDetail', { recipe })}
      style={({ pressed }) => [styles.card, { backgroundColor: pressed ? '#fcfcfc' : '#fff' }]}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={[styles.badge, { backgroundColor: recipe.matchPercentage === 100 ? '#E8F5E9' : '#FFF3E0' }]}>
          <Text style={[styles.badgeText, { color: recipe.matchPercentage === 100 ? '#2E7D32' : '#E65100' }]}>
            {recipe.matchPercentage}% Match
          </Text>
        </View>
      </View>

      <Text style={styles.subInfo}>
        🌍 {recipe.origin} • ⏱️ {recipe.prepTime}
      </Text>

      <Text style={styles.description} numberOfLines={3}>
        {recipe.description}
      </Text>

      <Pressable
        onPress={handleYoutubePress}
        style={({ pressed }) => [styles.ytButton, { opacity: pressed ? 0.8 : 1 }]}
      >
        <Text style={styles.ytButtonText}>▶ Watch on YouTube</Text>
      </Pressable>

      {missingIngredients.length > 0 && (
        <View style={styles.missingBox}>
          <Text style={styles.missingTitle}>Missing:</Text>
          <Text style={styles.missingText} numberOfLines={3}>
            {missingIngredients.join(', ')}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1, color: '#222' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  subInfo: { fontSize: 13, color: '#777', marginVertical: 4 },
  description: { fontSize: 14, color: '#444', lineHeight: 20 },
  ytButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    alignSelf: 'flex-start', // Keeps button size to text width
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 5,
  },
  ytButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  missingBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  missingTitle: { fontSize: 12, fontWeight: 'bold', color: '#d32f2f' },
  missingText: { fontSize: 12, color: '#666' },
});

export default RecipeListItem;
