import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { Toast } from '@/components/agro/toast';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignUp() {
  const { registerUser } = useTollStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState('');

  const register = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setToast('Please enter email, password, and confirm password.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setToast('Please enter a valid email address.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setToast('Passwords do not match.');
      return;
    }

    const registered = registerUser(trimmedEmail, trimmedPassword);

    if (!registered) {
      setToast('Email is already registered. Use the sign in option below.');
      return;
    }

    setToast('Registration successful. Redirecting to sign in.');
    setTimeout(() => router.replace('/sign-in'), 650);
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.kicker}>Get Yourself Registered</Text>
        <View style={styles.panel}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#b9b9b9"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#b9b9b9"
            secureTextEntry
            style={styles.input}
            textContentType="newPassword"
            value={password}
          />
          <TextInput
            autoCapitalize="none"
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor="#b9b9b9"
            secureTextEntry
            style={styles.input}
            textContentType="newPassword"
            value={confirmPassword}
          />

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
