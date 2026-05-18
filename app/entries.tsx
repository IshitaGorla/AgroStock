import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { TollEntry, TollEntryStatus, useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

type Filter = 'All' | TollEntryStatus | 'My Entries';

export default function EntriesScreen() {
  const { entries } = useTollStore();
  const [filter, setFilter] = useState<Filter>('All');

  const visibleEntries = useMemo(() => {
    if (filter === 'All' || filter === 'My Entries') {
      return entries;
    }

    return entries.filter((entry) => entry.status === filter);
  }, [entries, filter]);

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Toll Entries</Text>

        <View style={styles.filters}>
          {(['All', 'IN PREMISES', 'My Entries'] as Filter[]).map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filterButton, filter === item && styles.activeFilter]}>
              <Text selectable={false} style={styles.filterText}>
                {item === 'IN PREMISES' ? 'In Premises' : item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {visibleEntries.map((entry) => (
            <EntryCard entry={entry} key={entry.id} />
          ))}
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
        </View>
        <View style={styles.cardColumnRight}>
          <Text selectable style={styles.destination}>To: {entry.destination}</Text>
          <Text selectable style={styles.muted}>{entry.entryTime}</Text>
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
