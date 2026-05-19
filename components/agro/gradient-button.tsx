import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/agro-stock';

type GradientButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  small?: boolean;
  fullWidth?: boolean;
};

export function GradientButton({ label, onPress, disabled, small, fullWidth = true }: GradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        gradientBackground,
        small && styles.small,
        !fullWidth && styles.fit,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text selectable={false} style={[styles.label, small && styles.smallLabel, disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 999,
    minHeight: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: '100%',
    boxShadow: '0 5px 10px rgba(50, 85, 36, 0.22)',
  },
  disabled: {
    boxShadow: 'none',
    opacity: 0.75,
  },
  disabledLabel: {
    color: '#9ca88b',
  },
  fit: {
    width: 'auto',
  },
  label: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  small: {
    minHeight: 48,
    paddingHorizontal: 22,
    width: 'auto',
  },
  smallLabel: {
    fontSize: 14,
  },
});

const gradientBackground = {
  experimental_backgroundImage:
    'linear-gradient(to right, #5e923e 0%, #8fbd5c 24%, #eef8b4 50%, #8fbd5c 76%, #5e923e 100%)',
} as const;
