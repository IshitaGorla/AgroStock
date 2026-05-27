import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

export default function AdminScreen() {
  const {
    billingRecords,
    cameraLogs,
    canAccess,
    commodityMovements,
    employees,
    entries,
    qualityInspections,
    stockAssignments,
    storageLocations,
    weighbridgeRecords,
  } = useTollStore();

  useEffect(() => {
    if (!canAccess('admin')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  if (!canAccess('admin')) {
    return null;
  }

  const tables = [
    ['employees', employees.length],
    ['vehicles', entries.length],
    ['weighbridge_records', weighbridgeRecords.length],
    ['quality_inspections', qualityInspections.length],
    ['storage_locations', storageLocations.length],
    ['stock_assignments', stockAssignments.length],
    ['commodity_movements', commodityMovements.length],
    ['billing', billingRecords.length],
    ['vehicle_camera_logs', cameraLogs.length],
  ] as const;

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Admin Tables</Text>
        <View style={styles.grid}>
          {tables.map(([name, count]) => (
            <View key={name} style={styles.card}>
              <Text selectable style={styles.cardTitle}>{name}</Text>
              <Text selectable style={styles.count}>{count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text selectable={false} style={styles.cardTitle}>Recent Billing</Text>
          {billingRecords.length === 0 ? (
            <Text selectable style={styles.row}>No bills generated yet.</Text>
          ) : (
            billingRecords.map((bill) => (
              <Text selectable key={bill.id} style={styles.row}>
                {bill.commodityType}: Rs. {bill.totalAmount.toFixed(2)} ({bill.status})
              </Text>
            ))
          )}
        </View>
        <GradientButton label="Back to Dashboard" onPress={() => router.navigate('/toll-entry')} small fullWidth={false} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: 8, gap: 8, padding: 14, boxShadow: '0 3px 12px rgba(0, 0, 0, 0.14)' },
  cardTitle: { color: colors.green, fontSize: 16, fontWeight: '900', letterSpacing: 0 },
  content: { flexGrow: 1, gap: 22, padding: 22, paddingBottom: 80, paddingTop: 30 },
  count: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0 },
  grid: { gap: 14 },
  row: { color: colors.ink, fontSize: 14, fontWeight: '700', letterSpacing: 0 },
  screen: { backgroundColor: colors.paper, flex: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0, textAlign: 'center' },
});
