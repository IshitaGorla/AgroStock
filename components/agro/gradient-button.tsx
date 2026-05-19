import { Pressable, StyleSheet, Text, View } from 'react-native';

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
        small && styles.small,
        !fullWidth && styles.fit,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <View pointerEvents="none" style={styles.leftEdge} />
      <View pointerEvents="none" style={styles.shine} />
      <View pointerEvents="none" style={styles.rightEdge} />
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
    backgroundColor: '#ccdcb3',
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
  leftEdge: {
    backgroundColor: 'rgba(45, 91, 31, 0.42)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '28%',
  },
  rightEdge: {
    backgroundColor: 'rgba(45, 91, 31, 0.42)',
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '28%',
  },
  shine: {
    backgroundColor: 'rgba(255, 255, 210, 0.54)',
    bottom: 0,
    left: '34%',
    position: 'absolute',
    top: 0,
    width: '32%',
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
