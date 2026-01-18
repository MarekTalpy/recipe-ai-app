import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { Colors } from '../../constants/Colors';

export type CustomButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  lightColor?: string;
  darkColor?: string;
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
};
export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  lightColor,
  darkColor,
  loading,
  disabled,
  style,
  textStyle,
  ...rest
}: CustomButtonProps) {
  const theme = Colors.light;

  const baseColor = lightColor || theme[variant];

  const getContainerStyle = (state: { pressed: boolean }) => {
    return [
      styles.base,
      {
        backgroundColor: variant === 'outline' ? 'transparent' : disabled || loading ? '#E0E0E0' : baseColor,
      },
      variant === 'outline' && {
        borderWidth: 2,
        borderColor: disabled || loading ? '#BDBDBD' : baseColor,
      },
      state.pressed && !disabled && !loading && styles.pressed,
      (disabled || loading) && styles.disabled,
      typeof style === 'function' ? style(state) : style,
    ];
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return disabled || loading ? '#BDBDBD' : baseColor;
    }
    return disabled || loading ? '#9E9E9E' : '#fff';
  };

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={getContainerStyle} {...rest}>
      <View style={styles.textWithLoader}>
        {loading && <ActivityIndicator size="small" color={getTextColor()} />}
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  textWithLoader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: {
    opacity: 0.7,
  },
  text: { fontSize: 16, fontWeight: '700' },
});
