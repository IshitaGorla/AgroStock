import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { Toast } from '@/components/agro/toast';
import { TollEntry, useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

export default function VehicleExitScreen() {
  const { billingRecords, canAccess, findEntry, generateExitBill, markBillPaid } = useTollStore();
  const [vehicleNumber, setVehicleNumber] = useState('tn557890');
  const [selected, setSelected] = useState<TollEntry | undefined>();
  const [toast, setToast] = useState('');

  const bill = selected ? billingRecords.find((record) => record.vehicleId === selected.id) : undefined;

  useEffect(() => {
    if (!canAccess('vehicle-exit')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  const search = () => {
    const match = findEntry(vehicleNumber);
    setSelected(match);
    setToast(match ? '' : 'Vehicle data not found');
  };

  const exit = async () => {
    const generated = await generateExitBill(selected?.vehicleNumber ?? vehicleNumber);
    if (generated && selected) {
      setSelected({ ...selected, status: 'BILL GENERATED' });
    }
    setToast(generated ? 'Bill generated. Collect payment before exit.' : 'Vehicle data not found or already exited.');
  };

  const paid = async () => {
    if (!bill) {
      setToast('Generate a bill before marking paid.');
      return;
    }

    const updated = await markBillPaid(bill.id);
    setSelected(updated);
    setToast(updated ? 'Payment recorded. Vehicle can exit.' : 'Unable to update bill status.');
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Vehicle Exit</Text>

        <View style={styles.searchRow}>
          <TextInput
            autoCapitalize="none"
            onChangeText={setVehicleNumber}
            placeholder="Enter Vehicle Number"
            placeholderTextColor="#a8a8a8"
            style={styles.searchInput}
            value={vehicleNumber}
          />
          <GradientButton label="Search" onPress={search} small />
        </View>

        {selected ? (
          <View style={styles.details}>
            <Text selectable={false} style={styles.detailsTitle}>Vehicle Details</Text>
            <Text selectable style={styles.detailText}>Vehicle: {selected.vehicleNumber}</Text>
            <Text selectable style={styles.detailText}>Vehicle Type: {selected.vehicleType}</Text>
            <Text selectable style={styles.detailText}>Type: {selected.type}</Text>
            <Text selectable style={styles.detailText}>Customer: {selected.operator}</Text>
            <Text selectable style={styles.detailText}>Good Description: {selected.goodDescription}</Text>
            <Text selectable style={styles.detailText}>To: {selected.destination}</Text>
            <Text selectable style={styles.muted}>Entry: {selected.entryTime}</Text>
            <Text selectable style={styles.muted}>Driver: {selected.driver}</Text>
            <Text selectable style={styles.muted}>Driver Phone: {selected.driverPhoneNumber || 'Not provided'}</Text>
            <Text selectable style={styles.muted}>Persons: {selected.numberOfPersons}</Text>
            <Text selectable style={styles.muted}>Commodity: {selected.commodity}</Text>
            <Text
              selectable
              style={[styles.status, selected.status === 'EXITED' ? styles.exited : styles.inPremises]}>
              Status: {selected.status}
            </Text>
            <GradientButton label="Generate Exit Bill" disabled={selected.status === 'EXITED'} onPress={exit} />
            {bill ? (
              <View style={styles.bill}>
                <Text selectable={false} style={styles.detailsTitle}>Billing</Text>
                <Text selectable style={styles.detailText}>Commodity: {bill.commodityType}</Text>
                <Text selectable style={styles.detailText}>Quantity: {bill.quantityInTonnes.toFixed(2)} MT</Text>
                <Text selectable style={styles.detailText}>Loading: Rs. {bill.loadingCharge.toFixed(2)}</Text>
                <Text selectable style={styles.detailText}>Unloading: Rs. {bill.unloadingCharge.toFixed(2)}</Text>
                <Text selectable style={styles.detailText}>Rent: Rs. {bill.rentCharge.toFixed(2)}</Text>
                <Text selectable style={styles.detailText}>Labor: Rs. {bill.laborCharge.toFixed(2)}</Text>
                <Text selectable style={styles.total}>Total: Rs. {bill.totalAmount.toFixed(2)}</Text>
                <Text selectable style={[styles.status, bill.status === 'PAID' ? styles.exited : styles.inPremises]}>
                  Bill Status: {bill.status}
                </Text>
                <GradientButton label="Paid" disabled={bill.status === 'PAID'} onPress={paid} />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.emptySpace} />
        )}

        <View style={styles.footerActions}>
          <GradientButton label="Back to Toll Entry" onPress={() => router.navigate('/toll-entry')} small fullWidth={false} />
          <GradientButton
            label="View All Entries"
            onPress={() =>
              router.push({
                pathname: '/entries',
                params: { returnLabel: 'Back to Vehicle Exit', returnTo: '/vehicle-exit' },
              })
            }
            small
            fullWidth={false}
          />
        </View>
      </ScrollView>
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: 26,
    padding: 22,
    paddingBottom: 96,
    paddingTop: 30,
  },
  detailText: {
    color: '#252a24',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  details: {
    backgroundColor: colors.paper,
    borderRadius: 16,
    gap: 12,
    padding: 22,
    boxShadow: '0 3px 14px rgba(0, 0, 0, 0.14)',
  },
  bill: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 2,
    gap: 10,
    padding: 14,
  },
  detailsTitle: {
    color: colors.green,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  emptySpace: {
    minHeight: 300,
  },
  exited: {
    color: '#4caf50',
  },
  inPremises: {
    color: '#e6a300',
  },
  muted: {
    color: '#b8b8b8',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  screen: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  searchInput: {
    borderColor: colors.green,
    borderRadius: 18,
    borderWidth: 3,
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  status: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  total: {
    color: colors.greenDark,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  footerActions: {
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
  },
});
