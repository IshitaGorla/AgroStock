import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GradientButton } from '@/components/agro/gradient-button';
import { Toast } from '@/components/agro/toast';
import { colors, vineHeroImage } from '@/constants/agro-stock';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');

  const login = () => {
    if (!email.trim() || !password.trim()) {
      setToast('Unable to log in. Enter email and password.');
      return;
    }

    setToast('Signed in successfully!');
    setTimeout(() => router.replace('/toll-entry'), 650);
  };

  return (
    <ImageBackground source={{ uri: vineHeroImage }} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Customer Login</Text>

        <View style={styles.panel}>
          <View style={styles.inputRow}>
            <Text selectable={false} style={styles.icon}>@</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email Address"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              value={email}
            />
          </View>
          <View style={styles.inputRow}>
            <Text selectable={false} style={styles.icon}>#</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#a9a9a9"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>
          <GradientButton label="Login" onPress={login} />
        </View>

        <View style={styles.linkRow}>
          <Text selectable={false} style={styles.helper}>Do not have an account?</Text>
          <Link href="/sign-up" asChild>
            <Pressable>
              <Text selectable={false} style={styles.link}>Register Now</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
      <Toast message={toast} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 28,
    justifyContent: 'center',
    minHeight: 700,
    paddingHorizontal: 22,
    paddingBottom: 110,
    paddingTop: 72,
  },
  helper: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  icon: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    width: 24,
  },
  input: {
    borderBottomColor: '#79958b',
    borderBottomWidth: 2,
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    minHeight: 52,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  link: {
    color: colors.aqua,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 8,
    gap: 22,
    padding: 28,
    width: '100%',
    boxShadow: '0 9px 20px rgba(21, 88, 71, 0.24)',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    paddingHorizontal: 28,
  },
});
