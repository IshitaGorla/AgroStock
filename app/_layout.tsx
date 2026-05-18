import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TollStoreProvider } from '@/components/agro/toll-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TollStoreProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="toll-entry" />
          <Stack.Screen name="vehicle-entry" />
          <Stack.Screen name="vehicle-exit" />
          <Stack.Screen name="entries" />
        </Stack>
        <StatusBar style="auto" />
      </TollStoreProvider>
    </ThemeProvider>
  );
}
