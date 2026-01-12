import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/Colors';

interface Props {
  name: string;
  onDelete: () => void;
}

const IngredientChip = ({ name, onDelete }: Props) => {
  const theme = Colors.light;

  return (
    <View style={[styles.chip, { backgroundColor: theme.chip }]}>
      <Text style={[styles.text, { color: theme.text }]}>{name}</Text>

      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
      >
        <Ionicons name="close-circle" size={20} color={theme.placeholder} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  text: {
    marginRight: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 1.1 }],
  },
});

export default IngredientChip;
