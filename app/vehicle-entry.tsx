import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { SelectField } from '@/components/agro/select-field';
import { Toast } from '@/components/agro/toast';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

const vehicleTypeOptions = ['Truck', 'Mini-Truck', 'Tractor', 'Van', 'Bike', 'Container', 'Car'];
const typeOptions = ['Deliver', 'Storage', 'Guest'];
const destinationOptions = ['Warehouse', 'Market Yard', 'Cold Storage', 'Pack House', 'General'];

export default function VehicleEntryScreen() {
  const { addEntry } = useTollStore();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Tractor');
  const [type, setType] = useState('Deliver');
  const [destination, setDestination] = useState('Pack House');
  const [driver, setDriver] = useState('hello');
  const [toast, setToast] = useState('');

  const recordEntry = () => {
    if (!vehicleNumber.trim()) {
      setToast('Please enter vehicle number');
      return;
    }

    addEntry({ vehicleNumber, vehicleType, type, destination, driver });
    setToast('Vehicle entry recorded successfully!');
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.title}>Vehicle Entry</Text>
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Vehicle Number</Text>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setVehicleNumber}
              placeholder="Enter Vehicle Number"
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={vehicleNumber}
            />
          </View>
          <SelectField
            label="Select Vehicle Type"
            onChange={setVehicleType}
            options={vehicleTypeOptions}
            value={vehicleType}
          />
          <SelectField label="Type" onChange={setType} options={typeOptions} value={type} />
          <SelectField label="Destination" onChange={setDestination} options={destinationOptions} value={destination} />
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Driver Name</Text>
            <TextInput onChangeText={setDriver} placeholder="Driver" style={styles.input} value={driver} />
          </View>
          <GradientButton label="Record Entry" onPress={recordEntry} />
        </View>

        <View style={styles.viewButton}>
          <GradientButton label="View All Entries" onPress={() => router.push('/entries')} small fullWidth={false} />
        </View>
      </ScrollView>
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: 24,
    padding: 22,
    paddingBottom: 110,
    paddingTop: 30,
  },
  fieldGroup: {
    gap: 8,
  },
  form: {
    gap: 16,
  },
  label: {
    color: colors.greenDark,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  input: {
    borderColor: colors.green,
    borderRadius: 18,
    borderWidth: 3,
    color: colors.ink,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  screen: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  viewButton: {
    alignSelf: 'center',
    marginTop: 'auto',
  },
});
