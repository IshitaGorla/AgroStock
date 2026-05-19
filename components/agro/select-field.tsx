import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/agro-stock';

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text selectable={false} style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" onPress={() => setOpen((current) => !current)} style={styles.control}>
        <Text selectable={false} style={styles.value}>{value}</Text>
        <Text selectable={false} style={styles.chevron}>{open ? 'up' : 'down'}</Text>
      </Pressable>

      {open ? (
        <View style={styles.menu}>
          {options.map((option) => (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              style={[styles.option, option === value && styles.selectedOption]}>
              <Text selectable={false} style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  control: {
    alignItems: 'center',
    borderColor: colors.green,
    borderRadius: 18,
    borderWidth: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
    paddingHorizontal: 14,
  },
  label: {
    color: colors.greenDark,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  menu: {
    backgroundColor: colors.paper,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    padding: 6,
    boxShadow: '0 7px 16px rgba(50, 85, 36, 0.16)',
  },
  option: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  selectedOption: {
    backgroundColor: colors.greenLight,
  },
  value: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  wrapper: {
    gap: 8,
  },
});
