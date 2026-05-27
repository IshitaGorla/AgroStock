import { router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/agro/gradient-button';
import { Toast } from '@/components/agro/toast';
import { AppModule, EmployeeRole, useTollStore } from '@/components/agro/toll-store';
import { colors, teaLeafImage } from '@/constants/agro-stock';

type Action = {
  label: string;
  route:
    | '/vehicle-entry'
    | '/vehicle-exit'
    | '/entries'
    | '/weighbridge'
    | '/weighbridge-table'
    | '/quality-inspection'
    | '/quality-table'
    | '/stock-manager'
    | '/stock-table'
    | '/admin';
  module: AppModule;
};

const roleLabels: Record<EmployeeRole, string> = {
  security: 'Security Officer',
  quality_inspector: 'Quality Inspector',
  weighbridge: 'Weighbridge',
  admin: 'Admin',
  stock_manager: 'Stock Manager',
};

const actions: Action[] = [
  { label: 'Vehicle Entry', route: '/vehicle-entry', module: 'vehicle-entry' },
  { label: 'Vehicle Exit & Billing', route: '/vehicle-exit', module: 'vehicle-exit' },
  { label: 'Vehicle Table', route: '/entries', module: 'vehicles' },
  { label: 'Add Weighbridge Record', route: '/weighbridge', module: 'weighbridge' },
  { label: 'Weighbridge Table', route: '/weighbridge-table', module: 'weighbridge-table' },
  { label: 'Add Quality Inspection', route: '/quality-inspection', module: 'quality' },
  { label: 'Quality Table', route: '/quality-table', module: 'quality-table' },
  { label: 'Assign Stock', route: '/stock-manager', module: 'stock' },
  { label: 'Stock Table', route: '/stock-table', module: 'stock-table' },
  { label: 'Admin Tables', route: '/admin', module: 'admin' },
];

export default function TollEntryScreen() {
  const { canAccess, currentEmployee, currentUser, logoutUser } = useTollStore();
  const visibleActions = actions.filter((action) => canAccess(action.module));

  const logout = () => {
    logoutUser();
    router.replace('/sign-in');
  };

  return (
    <ImageBackground source={{ uri: teaLeafImage }} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text selectable={false} style={styles.title}>AgroStock</Text>
          <Text selectable style={styles.subtitle}>
            {currentEmployee ? roleLabels[currentEmployee.role] : 'Employee'} dashboard
          </Text>
        </View>

        <View style={styles.actions}>
          {visibleActions.map((action) => (
            <GradientButton key={action.route} label={action.label} onPress={() => router.push(action.route as never)} />
          ))}
        </View>
        <View style={styles.logout}>
          <GradientButton label="Logout" onPress={logout} small fullWidth={false} />
        </View>
      </ScrollView>
      <Toast message={`Welcome ${currentUser}!`} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 14,
    width: '82%',
  },
  background: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    gap: 44,
    minHeight: 700,
    padding: 28,
    paddingTop: 74,
  },
  logout: {
    marginTop: 'auto',
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  subtitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.green,
    fontSize: 54,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: 0,
  },
});
