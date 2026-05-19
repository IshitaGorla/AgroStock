import { router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/agro/gradient-button';
import { Toast } from '@/components/agro/toast';
import { useTollStore } from '@/components/agro/toll-store';
import { colors, teaLeafImage } from '@/constants/agro-stock';

export default function TollEntryScreen() {
  const { currentUser } = useTollStore();

  return (
    <ImageBackground source={{ uri: teaLeafImage }} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Toll Entry</Text>
        <View style={styles.actions}>
          <GradientButton label="Vehicle Entry" onPress={() => router.push('/vehicle-entry')} />
          <GradientButton label="Vehicle Exit" onPress={() => router.push('/vehicle-exit')} />
        </View>
      </ScrollView>
      <Toast message={`Welcome ${currentUser}!`} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 18,
    width: '78%',
  },
  background: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    gap: 110,
    minHeight: 700,
    padding: 28,
    paddingTop: 74,
  },
  title: {
    color: colors.green,
    fontSize: 54,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: 0,
  },
});
