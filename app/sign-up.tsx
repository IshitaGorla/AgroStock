import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '@/components/agro/brand-header';
import { GradientButton } from '@/components/agro/gradient-button';
import { SelectField } from '@/components/agro/select-field';
import { Toast } from '@/components/agro/toast';
import { EmployeeRole, useTollStore } from '@/components/agro/toll-store';
import { colors } from '@/constants/agro-stock';

const roleOptions: { label: string; value: EmployeeRole }[] = [
  { label: 'Security Officer', value: 'security' },
  { label: 'Quality Inspector', value: 'quality_inspector' },
  { label: 'Weighbridge', value: 'weighbridge' },
  { label: 'Admin', value: 'admin' },
  { label: 'Stock Manager', value: 'stock_manager' },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function roleValue(label: string) {
  return roleOptions.find((role) => role.label === label)?.value ?? 'security';
}

export default function SignUp() {
  const { registerUser } = useTollStore();
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState(roleOptions[0].label);
  const [empId, setEmpId] = useState('');
  const [toast, setToast] = useState('');

  const register = async () => {
    const trimmed = {
      fullName: fullName.trim(),
      userId: userId.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
      aadhaarNumber: aadhaarNumber.trim(),
      panNumber: panNumber.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      empId: empId.trim(),
    };

    if (Object.values(trimmed).some((value) => !value)) {
      setToast('Please fill all employee registration fields.');
      return;
    }

    if (!isValidEmail(trimmed.email)) {
      setToast('Please enter a valid email address.');
      return;
    }

    if (trimmed.password !== trimmed.confirmPassword) {
      setToast('Passwords do not match.');
      return;
    }

    if (trimmed.aadhaarNumber.length < 12) {
      setToast('Please enter a valid Aadhaar number.');
      return;
    }

    if (trimmed.mobile.length < 10) {
      setToast('Please enter a valid mobile number.');
      return;
    }

    const registered = await registerUser({
      fullName: trimmed.fullName,
      userId: trimmed.userId,
      password: trimmed.password,
      aadhaarNumber: trimmed.aadhaarNumber,
      panNumber: trimmed.panNumber,
      email: trimmed.email,
      mobile: trimmed.mobile,
      role: roleValue(role),
      empId: trimmed.empId,
    });

    if (!registered) {
      setToast('Employee ID, user ID, Aadhaar, PAN, email, or mobile already exists.');
      return;
    }

    setToast('Registration successful. Opening your role dashboard.');
    setTimeout(() => router.replace('/toll-entry'), 650);
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <Text selectable={false} style={styles.kicker}>Employee Registration</Text>
        <View style={styles.panel}>
          <Field label="Name" value={fullName} onChangeText={setFullName} placeholder="Full Name" />
          <Field label="User ID" value={userId} onChangeText={setUserId} placeholder="Login User ID" autoCapitalize="none" />
          <Field label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
          <Field label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" secureTextEntry />
          <Field label="Aadhaar Number" value={aadhaarNumber} onChangeText={(value) => setAadhaarNumber(value.replace(/\D/g, ''))} placeholder="12-digit Aadhaar" keyboardType="number-pad" />
          <Field label="PAN Number" value={panNumber} onChangeText={setPanNumber} placeholder="PAN Number" autoCapitalize="characters" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="Email Address" autoCapitalize="none" keyboardType="email-address" />
          <Field label="Mobile Number" value={mobile} onChangeText={(value) => setMobile(value.replace(/\D/g, ''))} placeholder="Mobile Number" keyboardType="phone-pad" />
          <SelectField label="Role" options={roleOptions.map((item) => item.label)} value={role} onChange={setRole} />
          <Field label="Emp ID" value={empId} onChangeText={setEmpId} placeholder="Employee ID" autoCapitalize="characters" />

          <View style={styles.actions}>
            <GradientButton label="Register Employee" onPress={register} />
            <View style={styles.loginRow}>
              <Text selectable={false} style={styles.helper}>Already registered?</Text>
              <Link href="/sign-in" asChild>
                <Pressable>
                  <Text selectable={false} style={styles.link}>Go to Login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <Toast message={toast} onHidden={() => setToast('')} />
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  secureTextEntry?: boolean;
};

function Field({ label, value, placeholder, onChangeText, autoCapitalize = 'words', keyboardType = 'default', secureTextEntry }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text selectable={false} style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9da892"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 14,
    marginTop: 10,
  },
  content: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 52,
  },
  field: {
    gap: 7,
  },
  helper: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  input: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 2,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  kicker: {
    color: colors.ink,
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: -76,
    textAlign: 'center',
    zIndex: 2,
  },
  label: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  link: {
    color: colors.aqua,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 13,
    marginTop: 40,
    padding: 18,
    paddingTop: 58,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
