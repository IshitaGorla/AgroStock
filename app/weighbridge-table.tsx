import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

export default function WeighbridgeTableScreen() {
  const { canAccess, entries, weighbridgeRecords } = useTollStore();
  const recordByVehicle = useMemo(
    () => new Map(entries.map((entry) => [entry.id, weighbridgeRecords.find((record) => record.vehicleId === entry.id)])),
    [entries, weighbridgeRecords],
  );

  useEffect(() => {
    if (!canAccess('weighbridge-table')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  if (!canAccess('weighbridge-table')) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Weighbridge Table</Text>
        <View style={styles.list}>
          {entries.map((entry) => {
            const record = recordByVehicle.get(entry.id);

            return (
              <View key={entry.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text selectable style={styles.cardTitle}>{entry.vehicleNumber}</Text>
                  <Text selectable style={styles.badge}>{record ? 'RECORDED' : 'PENDING'}</Text>
                </View>
                <Text selectable style={styles.row}>Commodity: {entry.commodity}</Text>
                <Text selectable style={styles.row}>Receipt: {record?.transportReceiptNo ?? 'Not generated'}</Text>
                <Text selectable style={styles.row}>Company: {record?.companyName ?? 'Not recorded'}</Text>
                <Text selectable style={styles.row}>Loaded: {record ? `${record.loadedWeight.toFixed(2)} MT` : 'Pending'}</Text>
                <Text selectable style={styles.row}>Empty: {record ? `${record.emptyWeight.toFixed(2)} MT` : 'Pending'}</Text>
                <Text selectable style={styles.total}>Net: {record ? `${record.netWeight.toFixed(2)} MT` : 'Pending'}</Text>
              </View>
            );
          })}
        </View>
        <GradientButton label="Back to Dashboard" onPress={() => router.navigate('/toll-entry')} small fullWidth={false} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderColor: colors.green, borderRadius: 16, borderWidth: 2, color: colors.greenDark, fontSize: 12, fontWeight: '900', letterSpacing: 0, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5 },
  card: { backgroundColor: colors.paper, borderRadius: 8, gap: 8, padding: 14, boxShadow: '0 3px 12px rgba(0, 0, 0, 0.14)' },
  cardTitle: { color: colors.green, fontSize: 18, fontWeight: '900', letterSpacing: 0 },
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  content: { flexGrow: 1, gap: 22, padding: 22, paddingBottom: 80, paddingTop: 30 },
  list: { gap: 14 },
  row: { color: colors.ink, fontSize: 14, fontWeight: '700', letterSpacing: 0 },
  screen: { backgroundColor: colors.paper, flex: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0, textAlign: 'center' },
  total: { color: colors.greenDark, fontSize: 16, fontWeight: '900', letterSpacing: 0 },
});
