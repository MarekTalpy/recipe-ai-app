import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

import { AIStackParamList } from '../../navigation/types';

const IngredientScanScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AIStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera / Upload Screen</Text>
      <Button
        title="Scan Ingredients"
        onPress={() => navigation.navigate('RecipeList', { ingredients: ['Eggs', 'Tomato'] })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
});

export default IngredientScanScreen;
