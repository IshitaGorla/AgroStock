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
          <Stack.Screen name="weighbridge" />
          <Stack.Screen name="weighbridge-table" />
          <Stack.Screen name="quality-inspection" />
          <Stack.Screen name="quality-table" />
          <Stack.Screen name="stock-manager" />
          <Stack.Screen name="stock-table" />
          <Stack.Screen name="admin" />
        </Stack>
        <StatusBar style="auto" />
      </TollStoreProvider>
    </ThemeProvider>
  );
}
