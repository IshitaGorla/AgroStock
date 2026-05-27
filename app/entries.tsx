import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { TollEntry, TollEntryStatus, useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

type Filter = 'All' | TollEntryStatus | 'My Entries';
type ReturnRoute = '/toll-entry' | '/vehicle-entry' | '/vehicle-exit';

const allowedReturnRoutes = new Set<ReturnRoute>(['/toll-entry', '/vehicle-entry', '/vehicle-exit']);

export default function EntriesScreen() {
  const { canAccess, currentEmployee, entries } = useTollStore();
  const params = useLocalSearchParams<{ returnLabel?: string; returnTo?: string }>();
  const [filter, setFilter] = useState<Filter>('All');

  useEffect(() => {
    if (!canAccess('vehicles')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  const visibleEntries = useMemo(() => {
    if (currentEmployee?.role === 'security') {
      return entries.filter((entry) => entry.status !== 'EXITED');
    }

    if (filter === 'All' || filter === 'My Entries') {
      return entries;
    }

    return entries.filter((entry) => entry.status === filter);
  }, [currentEmployee?.role, entries, filter]);

  if (!canAccess('vehicles')) {
    return null;
  }

  const returnTo = allowedReturnRoutes.has(params.returnTo as ReturnRoute)
    ? (params.returnTo as ReturnRoute)
    : '/toll-entry';
  const returnLabel = typeof params.returnLabel === 'string' ? params.returnLabel : 'Back to Toll Entry';

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>
          {currentEmployee?.role === 'security' ? 'Vehicles In Premises' : 'Vehicle Table'}
        </Text>

        {currentEmployee?.role === 'security' ? null : (
          <View style={styles.filters}>
            {(['All', 'IN PREMISES', 'BILL GENERATED', 'My Entries'] as Filter[]).map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filterButton, filter === item && styles.activeFilter]}>
              <Text selectable={false} style={styles.filterText}>
                {item === 'IN PREMISES' ? 'In Premises' : item === 'BILL GENERATED' ? 'Bill' : item}
              </Text>
            </Pressable>
            ))}
          </View>
        )}

        <View style={styles.list}>
          {visibleEntries.map((entry) => (
            <EntryCard entry={entry} key={entry.id} />
          ))}
        </View>

        <View style={styles.footerActions}>
          <GradientButton label={returnLabel} onPress={() => router.navigate(returnTo)} small fullWidth={false} />
          <GradientButton label="Vehicle Entry" onPress={() => router.navigate('/vehicle-entry')} small fullWidth={false} />
          <GradientButton label="Vehicle Exit" onPress={() => router.navigate('/vehicle-exit')} small fullWidth={false} />
        </View>
      </ScrollView>
    </View>
  );
}

function EntryCard({ entry }: { entry: TollEntry }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text selectable style={styles.vehicleNumber}>{entry.vehicleNumber}</Text>
        <Text selectable style={[styles.badge, entry.status === 'EXITED' ? styles.badgeExited : styles.badgeIn]}>
          {entry.status}
        </Text>
      </View>

      <View style={styles.cardMain}>
        <View style={styles.cardColumn}>
          <Text selectable style={styles.vehicleType}>{entry.vehicleType}</Text>
          <Text selectable style={styles.typeText}>{entry.type}</Text>
          <Text selectable style={styles.muted}>Operator: {entry.operator}</Text>
          <Text selectable style={styles.muted}>Driver: {entry.driver}</Text>
          <Text selectable style={styles.muted}>Phone: {entry.driverPhoneNumber || 'Not provided'}</Text>
        </View>
        <View style={styles.cardColumnRight}>
          <Text selectable style={styles.destination}>To: {entry.destination}</Text>
          <Text selectable style={styles.muted}>{entry.entryTime}</Text>
          <Text selectable style={styles.muted}>Commodity: {entry.commodity}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeFilter: {
    backgroundColor: colors.green,
  },
  badge: {
    borderColor: colors.green,
    borderRadius: 16,
    borderWidth: 3,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  badgeExited: {
    color: '#4caf50',
  },
  badgeIn: {
    color: '#e6a300',
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    gap: 16,
    padding: 14,
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.14)',
  },
  cardColumn: {
    flex: 1,
    gap: 10,
  },
  cardColumnRight: {
    alignItems: 'flex-end',
    flex: 1,
    gap: 12,
  },
  cardMain: {
    flexDirection: 'row',
    gap: 10,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    gap: 24,
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 28,
  },
  destination: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: 8,
    boxShadow: '0 5px 10px rgba(50, 85, 36, 0.18)',
  },
  filterText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
  },
  footerActions: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  list: {
    gap: 16,
  },
  muted: {
    color: '#b8b8b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
  },
  screen: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  vehicleNumber: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  vehicleType: {
    color: colors.green,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  typeText: {
    color: '#596252',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
