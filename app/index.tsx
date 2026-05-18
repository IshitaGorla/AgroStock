import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingPage() {

  // ==============================================================================
  // HOW TO CHANGE YOUR BACKGROUND IMAGE:
  // 
  // Option 1 (Current): Using a Web URL
  // Just change the `uri` link below to any image URL you want.
  //
  // Option 2: Using a Local Image from your computer
  // 1. Add your image (e.g. 'my-bg.jpg') to the 'assets/images/' folder
  // 2. Change the `bgImage` variable below to look like this:
  //    const bgImage = require('@/assets/images/my-bg.jpg');
  // ==============================================================================
  const bgImage = { uri: 'https://images.unsplash.com/photo-1592982537447-6f233425e4dc?q=80&w=1920&auto=format&fit=crop' };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <StatusBar style="light" />

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>AgroStock</Text>
            <Text style={styles.subtitle}>Empowering your agricultural journey with real-time insights.</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/sign-in" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/sign-up" asChild>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Dark overlay for text readability
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  contentContainer: {
    gap: 40,
  },
  headerContainer: {
    gap: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#e2e8f0',
    lineHeight: 26,
    fontWeight: '500',
    maxWidth: '90%',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#10b981', // Vibrant green fitting for Agro
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
