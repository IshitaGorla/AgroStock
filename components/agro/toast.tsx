import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/agro-stock';

type ToastProps = {
  message?: string;
};

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.toast}>
      <View style={styles.badge}>
        <Text selectable={false} style={styles.badgeText}>AS</Text>
      </View>
      <Text selectable style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.greenLight,
    borderRadius: 7,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  badgeText: {
    color: colors.greenDark,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
  },
  message: {
    color: colors.paper,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  toast: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#202124',
    borderRadius: 8,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
    maxWidth: 330,
    minHeight: 52,
    paddingHorizontal: 16,
    position: 'absolute',
    width: '88%',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.26)',
  },
});
