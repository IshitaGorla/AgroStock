import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

export default function QualityTableScreen() {
  const { canAccess, entries, qualityInspections } = useTollStore();
  const inspectionByVehicle = useMemo(
    () => new Map(entries.map((entry) => [entry.id, qualityInspections.find((inspection) => inspection.vehicleId === entry.id)])),
    [entries, qualityInspections],
  );

  useEffect(() => {
    if (!canAccess('quality-table')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  if (!canAccess('quality-table')) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Quality Table</Text>
        <View style={styles.list}>
          {entries.map((entry) => {
            const inspection = inspectionByVehicle.get(entry.id);

            return (
              <View key={entry.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text selectable style={styles.cardTitle}>{entry.vehicleNumber}</Text>
                  <Text
                    selectable
                    style={[
                      styles.badge,
                      inspection?.qcStatus === 'APPROVED' && styles.approved,
                      inspection?.qcStatus === 'REJECTED' && styles.rejected,
                    ]}>
                    {inspection?.qcStatus ?? 'PENDING'}
                  </Text>
                </View>
                <Text selectable style={styles.row}>Commodity: {entry.commodity}</Text>
                <Text selectable style={styles.row}>Product: {entry.goodDescription}</Text>
                <Text selectable style={styles.row}>Moisture: {inspection ? `${inspection.moistureContent.toFixed(2)}%` : 'Not inspected'}</Text>
                <Text selectable style={styles.row}>Foreign Matter: {inspection ? `${inspection.foreignMatter.toFixed(2)}%` : 'Not inspected'}</Text>
                <Text selectable style={styles.row}>Organic Matter: {inspection ? `${inspection.organicMatter.toFixed(2)}%` : 'Not inspected'}</Text>
                <Text selectable style={styles.row}>Damaged Grains: {inspection ? `${inspection.damagedGrains.toFixed(2)}%` : 'Not inspected'}</Text>
                <Text selectable style={styles.row}>Remarks: {inspection?.remarks || 'Awaiting quality inspection'}</Text>
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
  approved: { color: '#2f7d32' },
  badge: { borderColor: colors.green, borderRadius: 16, borderWidth: 2, color: '#e6a300', fontSize: 12, fontWeight: '900', letterSpacing: 0, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5 },
  card: { backgroundColor: colors.paper, borderRadius: 8, gap: 8, padding: 14, boxShadow: '0 3px 12px rgba(0, 0, 0, 0.14)' },
  cardTitle: { color: colors.green, fontSize: 18, fontWeight: '900', letterSpacing: 0 },
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  content: { flexGrow: 1, gap: 22, padding: 22, paddingBottom: 80, paddingTop: 30 },
  list: { gap: 14 },
  rejected: { color: '#b42318' },
  row: { color: colors.ink, fontSize: 14, fontWeight: '700', letterSpacing: 0 },
  screen: { backgroundColor: colors.paper, flex: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0, textAlign: 'center' },
});
