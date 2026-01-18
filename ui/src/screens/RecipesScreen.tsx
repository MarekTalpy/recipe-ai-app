import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import RecipeListItem from '@/src/components/RecipeListItem';
import Chip from '@/src/components/ui/Chip';
import { CustomButton } from '@/src/components/ui/CustomButton';
import { Colors } from '@/src/constants/Colors';
import { apiRequest } from '@/src/services/api';
import useRecipeStore from '@/src/store/RecipeStore';
import { Ingredient } from '@/src/types';
import { Recipe } from '@/src/types/recipe';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = Colors.light;

interface ListHeaderProps {
  selectedImage: string | null;
  setSelectedImage: (uri: string | null) => void;
  handleImagePick: (useCamera: boolean) => Promise<void>;
  detectIngredients: () => Promise<void>;
  ingredientsDetectionInProgress: boolean;
  manualInput: string;
  setManualInput: (text: string) => void;
  addIngredient: (text: string) => void;
  clearIngredients: () => void;
  ingredients: Ingredient[];
  removeIngredient: (index: number) => void;
  recipes: Recipe[];
  fetchRecipes: () => Promise<void>;
  isRecipesLoading: boolean;
}

const ListHeader = ({
  selectedImage,
  setSelectedImage,
  handleImagePick,
  detectIngredients,
  ingredientsDetectionInProgress,
  manualInput,
  setManualInput,
  addIngredient,
  clearIngredients,
  ingredients,
  removeIngredient,
  fetchRecipes,
  recipes,
  isRecipesLoading,
}: ListHeaderProps) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.title}>AI Pantry & Recipes</Text>

      {selectedImage ? (
        <View style={styles.imagePreviewContainer}>
          <View style={styles.photoContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <Pressable onPress={() => setSelectedImage(null)} style={styles.removeBadge}>
              <Ionicons name="close-circle" size={28} color={theme.danger} />
            </Pressable>
          </View>
          <CustomButton
            title="Identify Ingredients"
            onPress={detectIngredients}
            loading={ingredientsDetectionInProgress}
          />
        </View>
      ) : (
        <View style={styles.row}>
          <CustomButton title="Camera" onPress={() => handleImagePick(true)} variant="secondary" style={styles.flex1} />
          <CustomButton title="Library" onPress={() => handleImagePick(false)} variant="outline" style={styles.flex1} />
        </View>
      )}

      <TextInput style={styles.input} placeholder="Tomatoes" value={manualInput} onChangeText={setManualInput} />

      <View style={styles.inputRow}>
        <CustomButton
          title="Add"
          onPress={() => {
            addIngredient(manualInput);
            setManualInput('');
          }}
          disabled={!manualInput}
        />
        {ingredients?.length > 0 && (
          <CustomButton
            title="Clear All"
            onPress={clearIngredients}
            disabled={ingredients.length === 0 && recipes.length === 0}
            variant="outline"
            textStyle={styles.clearButtonText}
            style={styles.clearButton}
          />
        )}
      </View>

      <View style={styles.chipWrapper}>
        {ingredients.map((ingredient, index) => (
          <Chip key={index} name={ingredient.name} onDelete={() => removeIngredient(index)} />
        ))}
      </View>

      <View style={styles.recipeButtons}>
        <CustomButton
          title="Find Recipes"
          onPress={fetchRecipes}
          loading={isRecipesLoading}
          disabled={ingredients.length === 0}
          variant="primary"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.aiStatusContainer}>
        <View style={styles.subtitleRow}>
          <Ionicons
            name={isRecipesLoading ? 'sparkles' : 'restaurant-outline'}
            size={20}
            color={isRecipesLoading ? '#8E44AD' : theme.text}
          />
          <Text style={[styles.aiSubtitle, isRecipesLoading && { color: '#8E44AD' }]}>
            {isRecipesLoading ? 'AI is crafting your matches...' : 'Personalized for you'}
          </Text>
        </View>

        {isRecipesLoading && (
          <Text style={styles.aiSubtext}>Analyzing your pantry to find the most efficient recipes.</Text>
        )}
      </View>
    </View>
  );
};

const RecipeScreen = () => {
  const [manualInput, setManualInput] = useState('');
  const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();

  const {
    ingredients,
    addIngredients,
    addIngredient,
    removeIngredient,
    recipes,
    setRecipes,
    clearIngredients,
    selectedImage,
    setSelectedImage,
    ingredientsDetectionInProgress,
    setIngredientsDetectionInProgress,
    isRecipesLoading,
    setRecipesLoading,
  } = useRecipeStore();

  const handleImagePick = async (useCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    if (useCamera) {
      if (cameraStatus?.status !== ImagePicker.PermissionStatus.GRANTED) {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'We need camera access to scan your ingredients.');
          return;
        }
      }
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.canceled) setSelectedImage(result.assets[0].uri);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) setSelectedImage(result.assets[0].uri);
    }
  };

  const detectIngredients = async () => {
    if (!selectedImage) return;
    setIngredientsDetectionInProgress(true);
    try {
      const formData = new FormData();
      const fileType = selectedImage.split('.').pop();
      formData.append('image', { uri: selectedImage, name: `photo.${fileType}`, type: `image/${fileType}` } as any);

      const data = await apiRequest('/ingredients/detect', { method: 'POST', body: formData });

      addIngredients(data.ingredients);
      setSelectedImage(null);
    } catch (error: any) {
      Alert.alert('Scan Error', error.message);
    } finally {
      setIngredientsDetectionInProgress(false);
    }
  };

  const fetchRecipes = async () => {
    setRecipesLoading(true);
    try {
      const endpoint = `/recipes/match?precision=high&limit=3&maxPrepTime=45mins`;
      const uniqueIngredientNames = [...new Set(ingredients.map((i) => i.name))];
      const data = await apiRequest(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: uniqueIngredientNames }),
      });
      setRecipes(data?.recipes ?? []);
    } catch (error: any) {
      Alert.alert('Recipe Error', error.message);
    } finally {
      setRecipesLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ListHeader
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleImagePick={handleImagePick}
            detectIngredients={detectIngredients}
            ingredientsDetectionInProgress={ingredientsDetectionInProgress}
            manualInput={manualInput}
            setManualInput={setManualInput}
            addIngredient={addIngredient}
            clearIngredients={clearIngredients}
            ingredients={ingredients}
            removeIngredient={removeIngredient}
            fetchRecipes={fetchRecipes}
            recipes={recipes}
            isRecipesLoading={isRecipesLoading}
          />
        }
        renderItem={({ item }) => <RecipeListItem recipe={item} userIngredients={ingredients.map((i) => i.name)} />}
        ListEmptyComponent={() =>
          !isRecipesLoading && (
            <Text style={styles.emptyText}>
              Your Recipes List in empty so far! After selecting all you ingredients either using photo or manually,
              press "Find Recipes" Button to trigger an AI Analyses that will search for the best matches.
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  headerSection: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  flex1: { flex: 1 },
  inputRow: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 15 },
  chipWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 15, minHeight: 40 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  imagePreviewContainer: { gap: 10 },
  photoContainer: { height: 200, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: '100%' },
  removeBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FFF', borderRadius: 15 },
  emptyText: { textAlign: 'center', color: '#999', paddingHorizontal: 20 },
  recipeButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  clearButton: { borderColor: theme.danger },
  clearButtonText: { color: theme.danger },
  aiStatusContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  aiSubtext: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 4,
    fontStyle: 'italic',
    marginLeft: 28,
  },
  aiSubtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RecipeScreen;
