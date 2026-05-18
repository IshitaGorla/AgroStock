import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fieldHeroImage } from '@/constants/agro-stock';

export default function WelcomeScreen() {
  return (
    <ImageBackground source={{ uri: fieldHeroImage }} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
          <View style={styles.copy}>
            <Text selectable={false} style={styles.welcome}>Welcome</Text>
            <Text selectable={false} style={styles.subtitle}>To AgroStock</Text>
          </View>

          <Link href="/sign-up" asChild>
            <Pressable accessibilityRole="button" style={styles.getStarted}>
              <Text selectable={false} style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  buttonText: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    gap: 58,
    justifyContent: 'center',
    minHeight: 720,
    padding: 28,
  },
  copy: {
    alignItems: 'center',
    gap: 18,
  },
  getStarted: {
    alignItems: 'center',
    backgroundColor: 'rgba(161, 194, 96, 0.9)',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 62,
    overflow: 'hidden',
    paddingHorizontal: 24,
    width: '82%',
    boxShadow: '0 7px 14px rgba(43, 80, 32, 0.28)',
  },
  overlay: {
    backgroundColor: 'rgba(245, 248, 239, 0.18)',
    flex: 1,
  },
  subtitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: 0,
  },
  welcome: {
    color: colors.ink,
    fontSize: 50,
    fontWeight: '500',
    letterSpacing: 0,
  },
});
