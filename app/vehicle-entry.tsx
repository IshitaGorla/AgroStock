import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { SelectField } from '@/components/agro/select-field';
import { Toast } from '@/components/agro/toast';
import { useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

const vehicleTypeOptions = ['Truck', 'Mini-Truck', 'Tractor', 'Van', 'Bike', 'Container', 'Car'];
const typeOptions = ['Delivery', 'Guest', 'Storage'];
const destinationOptions = ['Warehouse', 'Market Yard', 'Cold Storage', 'Packhouse', 'General'];

function formatIstDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.day}.${values.month}.${values.year} ${values.hour}:${values.minute} ${values.dayPeriod.toLowerCase()}`;
}

export default function VehicleEntryScreen() {
  const { addEntry } = useTollStore();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Tractor');
  const [customerName, setCustomerName] = useState('');
  const [goodDescription, setGoodDescription] = useState('');
  const [driver, setDriver] = useState('');
  const [driverPhoneNumber, setDriverPhoneNumber] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [type, setType] = useState('Delivery');
  const [destination, setDestination] = useState('Warehouse');
  const [entryDateTime, setEntryDateTime] = useState(() => formatIstDateTime(new Date()));
  const [toast, setToast] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setEntryDateTime(formatIstDateTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const recordEntry = () => {
    if (!vehicleNumber.trim()) {
      setToast('Please enter vehicle number');
      return;
    }

    if (!customerName.trim()) {
      setToast('Please enter customer name');
      return;
    }

    const persons = Number.parseInt(numberOfPersons, 10);

    if (!Number.isInteger(persons) || persons < 1) {
      setToast('Please enter a valid number of persons');
      return;
    }

    addEntry({
      vehicleNumber,
      vehicleType,
      type,
      destination,
      customerName,
      goodDescription,
      driver,
      driverPhoneNumber,
      numberOfPersons: persons,
    });
    setToast('Vehicle entry recorded successfully!');
    setVehicleNumber('');
    setCustomerName('');
    setGoodDescription('');
    setDriver('');
    setDriverPhoneNumber('');
    setNumberOfPersons('');
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
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Customer Name</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setCustomerName}
              placeholder="Enter Customer Name"
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={customerName}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Good Description</Text>
            <TextInput
              multiline
              onChangeText={setGoodDescription}
              placeholder="Enter Good Description"
              placeholderTextColor="#a8a8a8"
              style={[styles.input, styles.multilineInput]}
              value={goodDescription}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Driver Name</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setDriver}
              placeholder="Enter Driver Name"
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={driver}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Driver Phone Number</Text>
            <TextInput
              inputMode="tel"
              keyboardType="phone-pad"
              onChangeText={setDriverPhoneNumber}
              placeholder="Enter Driver Phone Number"
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={driverPhoneNumber}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Number of Persons</Text>
            <TextInput
              inputMode="numeric"
              keyboardType="number-pad"
              onChangeText={(value) => setNumberOfPersons(value.replace(/\D/g, ''))}
              placeholder="Enter Number of Persons"
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={numberOfPersons}
            />
          </View>
          <SelectField label="Type" onChange={setType} options={typeOptions} value={type} />
          <SelectField label="Destination" onChange={setDestination} options={destinationOptions} value={destination} />
          <View style={styles.fieldGroup}>
            <Text selectable={false} style={styles.label}>Entry Time and Date</Text>
            <TextInput
              editable={false}
              pointerEvents="none"
              style={[styles.input, styles.readOnlyInput]}
              value={entryDateTime}
            />
          </View>
          <GradientButton label="Record Entry" onPress={recordEntry} />
        </View>

        <View style={styles.footerActions}>
          <GradientButton label="Back to Toll Entry" onPress={() => router.navigate('/toll-entry')} small fullWidth={false} />
          <GradientButton
            label="View All Entries"
            onPress={() =>
              router.push({
                pathname: '/entries',
                params: { returnLabel: 'Back to Vehicle Entry', returnTo: '/vehicle-entry' },
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
  multilineInput: {
    minHeight: 86,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: '#f6f8f3',
    fontWeight: '800',
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
  footerActions: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 12,
    marginTop: 'auto',
  },
});
