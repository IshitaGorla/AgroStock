import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { Toast } from '@/components/agro/toast';
import { colors } from '@/constants/agro-stock';

const fields = [
  'Name of the Company',
  'Name of the Customer',
  'Email Address',
  'Customer Phone Number',
  'Vehicle Number',
  'Aadhar Number',
  'PAN Number',
];

export default function SignUp() {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((field) => [field, ''])),
  );
  const [toast, setToast] = useState('');

  const register = () => {
    const values = Object.values(form).map((value) => value.trim());
    const allBlank = values.every((value) => !value);
    const hasBlank = values.some((value) => !value);

    if (allBlank) {
      setToast('Please fill in the username and all details.');
      return;
    }

    if (hasBlank) {
      setToast('Please fill in all required details.');
      return;
    }

    router.replace('/sign-in');
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.kicker}>Get Yourself Registered</Text>
        <View style={styles.panel}>
          {fields.map((field) => (
            <TextInput
              autoCapitalize="words"
              keyboardType={field.includes('Email') ? 'email-address' : 'default'}
              key={field}
              onChangeText={(value) => setForm((current) => ({ ...current, [field]: value }))}
              placeholder={field}
              placeholderTextColor="#b9b9b9"
              style={styles.input}
              value={form[field]}
            />
          ))}

          <View style={styles.actions}>
            <GradientButton label="Register" onPress={register} />
            <View style={styles.loginRow}>
              <Text selectable={false} style={styles.helper}>Already Registered?</Text>
              <Link href="/sign-in" asChild>
                <Pressable>
                  <Text selectable={false} style={styles.link}>Go to Login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <Toast message={toast} onHidden={() => setToast('')} />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 14,
    marginTop: 52,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 34,
  },
  helper: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  input: {
    borderColor: '#eff8cf',
    borderRadius: 8,
    borderWidth: 2,
    color: colors.ink,
    fontSize: 18,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  kicker: {
    color: colors.ink,
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: -76,
    textAlign: 'center',
    zIndex: 2,
  },
  link: {
    color: colors.aqua,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 10,
    marginTop: 40,
    minHeight: 560,
    padding: 18,
    paddingTop: 64,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
