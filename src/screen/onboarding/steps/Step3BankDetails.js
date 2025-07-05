import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Navbar from '../../../component/Navbar';
import { OnboardingContext } from '../../../context/OnboardingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Step3BankDetails = ({ navigation }) => {
  const [form, setForm] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const { updateData } = useContext(OnboardingContext);

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('bank_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm(parsed);
      }
    };
    loadData();
  }, []);


  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      AsyncStorage.setItem('bank_details', JSON.stringify(form));
    }, 500); // save after 500ms of inactivity

    return () => clearTimeout(timeoutRef);
  }, [form]);


  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };


  const getValidationError = (key, value) => {
    if (!value.trim()) {
      return `${{
        accountHolderName: 'Account Holder Name',
        bankName: 'Bank Name',
        accountNumber: 'Account Number',
        ifscCode: 'IFSC Code',
      }[key]} is required`;
    }

    if (key === 'accountHolderName' && /\d/.test(value)) {
      return 'Account Holder Name cannot contain numbers';
    }

    if (key === 'accountNumber') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 6 || digits.length > 20) {
        return 'Enter valid Account Number';
      }
    }

    if (key === 'ifscCode') {
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase())) {
        return 'Enter valid IFSC Code';
      }
    }

    return '';
  };


  const validateField = (key, value) => {
    const message = getValidationError(key, value);
    setErrors((prev) => ({ ...prev, [key]: message }));
  };


  const validateForm = () => {
    const newErrors = {};
    let hasError = false;

    Object.entries(form).forEach(([key, value]) => {
      const message = getValidationError(key, value);
      if (message) {
        newErrors[key] = message;
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        updateData?.('bankDetails', form); // if context exists
        await AsyncStorage.setItem('bank_details', JSON.stringify(form));
        navigation.navigate('Step5AddressInfo');
      } catch (e) {
        console.error('Error saving bank details:', e);
      }
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar title="Bank Details" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.stepText}>Step 2 of 4</Text>
          <Text style={styles.title}>Enter Bank Details</Text>

          {/* Account Holder Name */}
          <Text style={styles.label}>Account Holder Name</Text>
          <TextInput
            style={[
              styles.input,
              errors.accountHolderName && styles.inputError,
              focusedField === 'accountHolderName' && styles.inputFocused,
            ]}
            placeholder="e.g. Ramesh Kumar"
            value={form.accountHolderName}
            onChangeText={(val) => handleChange('accountHolderName', val)}
            placeholderTextColor="#999"
            onFocus={() => setFocusedField('accountHolderName')}
            onBlur={() => setFocusedField('')}
          />
          {errors.accountHolderName && <Text style={styles.errorText}>{errors.accountHolderName}</Text>}

          {/* Bank Name */}
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={[
              styles.input,
              errors.bankName && styles.inputError,
              focusedField === 'bankName' && styles.inputFocused,
            ]}
            placeholder="e.g. HDFC Bank"
            value={form.bankName}
            onChangeText={(val) => handleChange('bankName', val)}
            placeholderTextColor="#999"
            onFocus={() => setFocusedField('bankName')}
            onBlur={() => setFocusedField('')}
          />
          {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}

          {/* Account Number */}
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={[
              styles.input,
              errors.accountNumber && styles.inputError,
              focusedField === 'accountNumber' && styles.inputFocused,
            ]}
            placeholder="e.g. 123456789012"
            keyboardType="number-pad"
            value={form.accountNumber}
            onChangeText={(val) => handleChange('accountNumber', val)}
            placeholderTextColor="#999"
            onFocus={() => setFocusedField('accountNumber')}
            onBlur={() => setFocusedField('')}
          />
          {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

          {/* IFSC Code */}
          <Text style={styles.label}>IFSC Code</Text>
          <TextInput
            style={[
              styles.input,
              errors.ifscCode && styles.inputError,
              focusedField === 'ifscCode' && styles.inputFocused,
            ]}
            placeholder="e.g. HDFC0001234"
            autoCapitalize="characters"
            value={form.ifscCode}
            onChangeText={(val) => handleChange('ifscCode', val)}
            placeholderTextColor="#999"
            onFocus={() => setFocusedField('ifscCode')}
            onBlur={() => setFocusedField('')}
          />
          {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 40 },
  stepText: { fontSize: 14, color: '#777', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DADADA',
    marginBottom: 6,
  },
  inputError: {
    borderColor: 'red',
  },
  inputFocused: {
    borderColor: '#96f1a7',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: '#2F6DFB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Step3BankDetails;
