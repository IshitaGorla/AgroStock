import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

export default function StockTableScreen() {
  const { canAccess, commodityMovements, entries, stockAssignments, storageLocations } = useTollStore();
  const stockByVehicle = useMemo(
    () => new Map(entries.map((entry) => [entry.id, stockAssignments.find((assignment) => assignment.vehicleId === entry.id)])),
    [entries, stockAssignments],
  );

  useEffect(() => {
    if (!canAccess('stock-table')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  if (!canAccess('stock-table')) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Stock Table</Text>
        <View style={styles.list}>
          {entries.map((entry) => {
            const assignment = stockByVehicle.get(entry.id);
            const location = storageLocations.find((item) => item.id === assignment?.storageLocationId);

            return (
              <View key={entry.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text selectable style={styles.cardTitle}>{entry.vehicleNumber}</Text>
                  <Text selectable style={styles.badge}>{assignment ? 'ASSIGNED' : 'PENDING'}</Text>
                </View>
                <Text selectable style={styles.row}>Commodity: {entry.commodity}</Text>
                <Text selectable style={styles.row}>Storage: {location ? `${location.unitType} / ${location.floorName} / ${location.roomName}` : 'Awaiting assignment'}</Text>
                <Text selectable style={styles.row}>Stack: {assignment?.stackNumber ?? 'Not assigned'}</Text>
                <Text selectable style={styles.row}>Lot: {assignment?.lotNumber ?? 'Not generated'}</Text>
                <Text selectable style={styles.row}>Bags: {assignment?.bagCount ?? 0}</Text>
                <Text selectable style={styles.row}>Total Weight: {assignment ? `${assignment.totalWeight.toFixed(2)} MT` : 'Not recorded'}</Text>
                <Text selectable style={styles.row}>Average Bag Weight: {assignment ? `${assignment.averageBagWeight.toFixed(3)} MT` : 'Not recorded'}</Text>
              </View>
            );
          })}

          {commodityMovements.map((movement) => (
            <View key={movement.id} style={styles.card}>
              <Text selectable style={styles.cardTitle}>Movement</Text>
              <Text selectable style={styles.row}>From {movement.fromLocation} to {movement.toLocation}</Text>
              <Text selectable style={styles.row}>{movement.remarks}</Text>
            </View>
          ))}
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
});
