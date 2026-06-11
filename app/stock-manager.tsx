import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { SelectField } from '@/components/agro/select-field';
import { Toast } from '@/components/agro/toast';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

function toNumber(value: string) {
  return Number.parseFloat(value) || 0;
}

export default function StockManagerScreen() {
  const {
    addCommodityMovement,
    addStockAssignment,
    canAccess,
    entries,
    storageLocations,
  } = useTollStore();
  const vehicles = useMemo(() => entries.map((entry) => entry.vehicleNumber), [entries]);
  const locationLabels = storageLocations.map((location) => `${location.id}: ${location.unitType} ${location.floorName} ${location.roomName}`);
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0] ?? '');
  const [locationLabel, setLocationLabel] = useState(locationLabels[0] ?? '');
  const [toLocationLabel, setToLocationLabel] = useState(locationLabels[1] ?? locationLabels[0] ?? '');
  const [stackNumber, setStackNumber] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [bagCount, setBagCount] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!canAccess('stock')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  const selectedVehicle = entries.find((entry) => entry.vehicleNumber === vehicleNumber);
  const fromLocation = Number.parseInt(locationLabel, 10);
  const toLocation = Number.parseInt(toLocationLabel, 10);

  const assign = async () => {
    if (!selectedVehicle) {
      setToast('Select a valid vehicle.');
      return;
    }

    const saved = await addStockAssignment({
      vehicleId: selectedVehicle.id,
      storageLocationId: fromLocation,
      stackNumber: stackNumber.trim() || 'S-1',
      lotNumber: lotNumber.trim() || `LOT-${Date.now()}`,
      bagCount: toNumber(bagCount),
      totalWeight: toNumber(totalWeight),
    });

    setToast(saved ? `Stock assigned. Avg bag weight ${saved.averageBagWeight.toFixed(2)} MT.` : 'Unable to assign stock.');
  };

  const move = async () => {
    if (!selectedVehicle) {
      setToast('Select a valid vehicle.');
      return;
    }

    const saved = await addCommodityMovement({
      vehicleId: selectedVehicle.id,
      fromLocation,
      toLocation,
      remarks: `Moved ${selectedVehicle.commodity}`,
    });

    setToast(saved ? 'Commodity movement recorded.' : 'Unable to record movement.');
  };

  if (!canAccess('stock')) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Stock Management</Text>
        <View style={styles.form}>
          <SelectField label="Vehicle" options={vehicles} value={vehicleNumber} onChange={setVehicleNumber} />
          <SelectField label="Storage Location" options={locationLabels} value={locationLabel} onChange={setLocationLabel} />
          <TextInput placeholder="Stack Number" placeholderTextColor="#a8a8a8" style={styles.input} value={stackNumber} onChangeText={setStackNumber} />
          <TextInput placeholder="Lot Number" placeholderTextColor="#a8a8a8" style={styles.input} value={lotNumber} onChangeText={setLotNumber} />
          <TextInput placeholder="Bag Count" placeholderTextColor="#a8a8a8" style={styles.input} value={bagCount} onChangeText={setBagCount} keyboardType="number-pad" />
          <TextInput placeholder="Total Weight (MT)" placeholderTextColor="#a8a8a8" style={styles.input} value={totalWeight} onChangeText={setTotalWeight} keyboardType="decimal-pad" />
          <GradientButton label="Assign Stock" onPress={assign} />
          <SelectField label="Move To" options={locationLabels} value={toLocationLabel} onChange={setToLocationLabel} />
          <GradientButton label="Record Movement" onPress={move} />
        </View>

        <View style={styles.list}>
          {storageLocations.map((location) => (
            <View key={location.id} style={styles.card}>
              <Text selectable style={styles.cardTitle}>{location.unitType}</Text>
              <Text selectable style={styles.row}>{location.floorName} / {location.roomName}</Text>
              <Text selectable style={styles.row}>{location.currentOccupancy.toFixed(2)} of {location.capacityInTonnes.toFixed(2)} MT occupied</Text>
            </View>
          ))}
        </View>
        <GradientButton label="Open Stock Table" onPress={() => router.push('/stock-table' as never)} small fullWidth={false} />
        <GradientButton label="Back to Dashboard" onPress={() => router.navigate('/toll-entry')} small fullWidth={false} />
      </ScrollView>
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: 8, gap: 8, padding: 14, boxShadow: '0 3px 12px rgba(0, 0, 0, 0.14)' },
  cardTitle: { color: colors.green, fontSize: 18, fontWeight: '900', letterSpacing: 0 },
  content: { flexGrow: 1, gap: 22, padding: 22, paddingBottom: 80, paddingTop: 30 },
  form: { gap: 14 },
  input: { borderColor: colors.green, borderRadius: 18, borderWidth: 3, color: colors.ink, fontSize: 16, minHeight: 50, paddingHorizontal: 14 },
  list: { gap: 14 },
  row: { color: colors.ink, fontSize: 14, fontWeight: '700', letterSpacing: 0 },
  screen: { backgroundColor: colors.paper, flex: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0, textAlign: 'center' },
});
