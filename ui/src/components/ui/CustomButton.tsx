import { ActivityIndicator, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

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
  const backgroundColor = lightColor || theme[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        { backgroundColor: variant === 'outline' ? 'transparent' : backgroundColor },
        variant === 'outline' && { borderWeight: 2, borderColor: backgroundColor },
        state.pressed && styles.pressed,
        disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? backgroundColor : '#fff'} />
      ) : (
        <Text style={[styles.text, { color: variant === 'outline' ? backgroundColor : '#fff' }, textStyle]}>
          {title}
        </Text>
      )}
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
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5, backgroundColor: '#ccc' },
  text: { fontSize: 16, fontWeight: '600' },
});
