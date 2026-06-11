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

export default function WeighbridgeScreen() {
  const { addWeighbridgeRecord, canAccess, entries } = useTollStore();
  const vehicles = useMemo(() => entries.map((entry) => entry.vehicleNumber), [entries]);
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0] ?? '');
  const [loadedWeight, setLoadedWeight] = useState('');
  const [emptyWeight, setEmptyWeight] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!canAccess('weighbridge')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  const save = async () => {
    const vehicle = entries.find((entry) => entry.vehicleNumber === vehicleNumber);

    if (!vehicle) {
      setToast('Select a valid vehicle.');
      return;
    }

    const saved = await addWeighbridgeRecord({
      vehicleId: vehicle.id,
      transportReceiptNo: `TR-${Date.now()}`,
      companyName: companyName.trim() || 'Delta Agro',
      customerName: customerName.trim() || vehicle.operator,
      phoneNumber: phoneNumber.trim() || vehicle.driverPhoneNumber,
      aadhaarNumber: '',
      panNumber: '',
      gstNumber: '',
      address: '',
      loadedWeight: toNumber(loadedWeight),
      emptyWeight: toNumber(emptyWeight),
      applicationNumber: `APP-${Date.now()}`,
    });

    setToast(saved ? 'Weighbridge record saved.' : 'Unable to save record.');
    setLoadedWeight('');
    setEmptyWeight('');
  };

  if (!canAccess('weighbridge')) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Weighbridge Records</Text>
        <View style={styles.form}>
          <SelectField label="Vehicle" options={vehicles} value={vehicleNumber} onChange={setVehicleNumber} />
          <TextInput placeholder="Company Name" placeholderTextColor="#a8a8a8" style={styles.input} value={companyName} onChangeText={setCompanyName} />
          <TextInput placeholder="Customer Name" placeholderTextColor="#a8a8a8" style={styles.input} value={customerName} onChangeText={setCustomerName} />
          <TextInput placeholder="Phone Number" placeholderTextColor="#a8a8a8" style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
          <TextInput placeholder="Loaded Weight (MT)" placeholderTextColor="#a8a8a8" style={styles.input} value={loadedWeight} onChangeText={setLoadedWeight} keyboardType="decimal-pad" />
          <TextInput placeholder="Empty Weight (MT)" placeholderTextColor="#a8a8a8" style={styles.input} value={emptyWeight} onChangeText={setEmptyWeight} keyboardType="decimal-pad" />
          <GradientButton label="Save Weighment" onPress={save} />
        </View>
        <GradientButton label="Open Weighbridge Table" onPress={() => router.push('/weighbridge-table' as never)} small fullWidth={false} />
        <GradientButton label="Back to Dashboard" onPress={() => router.navigate('/toll-entry')} small fullWidth={false} />
      </ScrollView>
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, gap: 22, padding: 22, paddingBottom: 80, paddingTop: 30 },
  form: { gap: 14 },
  input: { borderColor: colors.green, borderRadius: 18, borderWidth: 3, color: colors.ink, fontSize: 16, minHeight: 50, paddingHorizontal: 14 },
  screen: { backgroundColor: colors.paper, flex: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0, textAlign: 'center' },
});
