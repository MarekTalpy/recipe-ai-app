import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import Chip from '@/src/components/Chip';
import { CustomButton } from '@/src/components/CustomButton';
import { Colors } from '@/src/constants/Colors';
import { apiRequest } from '@/src/services/api';
import { Ingredient } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { AIStackParamList } from '../../navigation/types';

const theme = Colors.light;

const IngredientScanScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AIStackParamList>>();
  const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (cameraStatus?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'We need camera access to scan your fridge.');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    setSelectedImage(null);
  };

  const detectIngredients = async () => {
    if (!selectedImage) return;

    setIsDetecting(true);

    try {
      const formData = new FormData();

      const uriParts = selectedImage.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: selectedImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      const data = await apiRequest('/ingredients/detect', {
        method: 'POST',
        body: formData,
      });

      setIngredients((prev) => [...prev, ...data.ingredients]);
      setSelectedImage(null);
    } catch (error: any) {
      Alert.alert('Network Error', error?.message);
    } finally {
      setIsDetecting(false);
    }
  };

  const addIngredient = () => {
    const newIngredientName = manualInput.trim();
    const newTrimmedIngredient = { name: newIngredientName, confidence: 1 };
    if (newIngredientName?.length > 0) {
      setIngredients((allIngredients) => [...allIngredients, newTrimmedIngredient]);
      setManualInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleDetect = () => {
    Alert.alert('AI Detection', 'This will trigger the camera and AI logic later!');
  };

  const handleConfirm = () => {
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient.');
      return;
    }
    navigation.navigate('RecipeList', { ingredients });
  };

  const processImage = async (uri: string) => {
    console.log('Image URI ready for backend:', uri);
    setSelectedImage(uri);

    // TODO: sent ingredients to the backend for further processing
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Scan Ingredients</Text>

      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <Pressable onPress={removePhoto} style={styles.removePhotoBadge}>
            <Ionicons name="close-circle" size={28} color={Colors.light.danger} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.row}>
          <CustomButton
            title="Take Photo"
            onPress={takePhoto}
            variant="secondary"
            style={{ flex: 1, marginRight: 5 }}
          />
          <CustomButton title="Gallery" onPress={pickImage} variant="outline" style={{ flex: 1, marginLeft: 5 }} />
        </View>
      )}

      {selectedImage && (
        <CustomButton
          title="Scan Photo with AI"
          onPress={detectIngredients}
          loading={isDetecting}
          variant="primary"
          style={{ marginBottom: 20 }}
        />
      )}

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.inputSection}>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          placeholder="tomatoes"
          placeholderTextColor={theme.placeholder}
          value={manualInput}
          onChangeText={setManualInput}
        />
        <CustomButton title="Add" onPress={addIngredient} disabled={!manualInput} />
      </View>

      <ScrollView contentContainerStyle={styles.chipContainer}>
        {ingredients.map((item, index) => (
          <Chip key={index} name={item.name} onDelete={() => removeIngredient(index)} />
        ))}
      </ScrollView>

      <CustomButton
        title="Analyze & Find Recipes"
        onPress={() => navigation.navigate('RecipeList', { ingredients })}
        loading={false}
        disabled={ingredients.length === 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.background },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  inputSection: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    minHeight: 100,
  },
  previewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
});

export default IngredientScanScreen;
