import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { SelectField } from '@/components/agro/select-field';
import { Toast } from '@/components/agro/toast';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

const statusOptions = ['PENDING', 'APPROVED', 'REJECTED'];

function toNumber(value: string) {
  return Number.parseFloat(value) || 0;
}

export default function QualityInspectionScreen() {
  const { addQualityInspection, canAccess, entries, qualityInspections } = useTollStore();
  const vehicles = useMemo(() => entries.map((entry) => entry.vehicleNumber), [entries]);
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0] ?? '');
  const [qcStatus, setQcStatus] = useState('PENDING');
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState('');
  const [values, setValues] = useState({
    moistureContent: '',
    foreignMatter: '',
    organicMatter: '',
    damagedGrains: '',
    weeviledGrains: '',
    fragments: '',
    shrivelledGrains: '',
    admixture: '',
  });

  useEffect(() => {
    if (!canAccess('quality')) {
      router.replace('/toll-entry');
    }
  }, [canAccess]);

  const save = () => {
    const vehicle = entries.find((entry) => entry.vehicleNumber === vehicleNumber);

    if (!vehicle) {
      setToast('Select a valid vehicle.');
      return;
    }

    const saved = addQualityInspection({
      vehicleId: vehicle.id,
      moistureContent: toNumber(values.moistureContent),
      foreignMatter: toNumber(values.foreignMatter),
      organicMatter: toNumber(values.organicMatter),
      damagedGrains: toNumber(values.damagedGrains),
      weeviledGrains: toNumber(values.weeviledGrains),
      fragments: toNumber(values.fragments),
      shrivelledGrains: toNumber(values.shrivelledGrains),
      admixture: toNumber(values.admixture),
      fumigation: qcStatus === 'APPROVED',
      qcStatus: qcStatus as 'PENDING' | 'APPROVED' | 'REJECTED',
      remarks,
    });

    setToast(saved ? 'Quality inspection saved.' : 'Unable to save inspection.');
  };

  if (!canAccess('quality')) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Quality Inspection</Text>
        <View style={styles.form}>
          <SelectField label="Vehicle" options={vehicles} value={vehicleNumber} onChange={setVehicleNumber} />
          {Object.keys(values).map((key) => (
            <TextInput
              key={key}
              keyboardType="decimal-pad"
              onChangeText={(text) => setValues((current) => ({ ...current, [key]: text }))}
              placeholder={key.replace(/([A-Z])/g, ' $1')}
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={values[key as keyof typeof values]}
            />
          ))}
          <SelectField label="QC Status" options={statusOptions} value={qcStatus} onChange={setQcStatus} />
          <TextInput placeholder="Remarks" placeholderTextColor="#a8a8a8" style={[styles.input, styles.multiline]} value={remarks} onChangeText={setRemarks} multiline />
          <GradientButton label="Save Inspection" onPress={save} />
        </View>

        <View style={styles.list}>
          {qualityInspections.map((inspection) => (
            <View key={inspection.id} style={styles.card}>
              <Text selectable style={styles.cardTitle}>{inspection.qcStatus}</Text>
              <Text selectable style={styles.row}>Moisture: {inspection.moistureContent.toFixed(2)}%</Text>
              <Text selectable style={styles.row}>Foreign Matter: {inspection.foreignMatter.toFixed(2)}%</Text>
              <Text selectable style={styles.row}>Remarks: {inspection.remarks || 'None'}</Text>
            </View>
          ))}
        </View>
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
  multiline: { minHeight: 84, paddingVertical: 12, textAlignVertical: 'top' },
  row: { color: colors.ink, fontSize: 14, fontWeight: '700', letterSpacing: 0 },
  screen: { backgroundColor: colors.paper, flex: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', letterSpacing: 0, textAlign: 'center' },
});
