import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../../component/Navbar';
import { OnboardingContext } from '../../../context/OnboardingContext';

const Step5AddressInfo = ({ navigation }) => {
  const [form, setForm] = useState({
    addressLine: '',
    city: '',
    pincode: '',
    state: '',
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const { updateData } = useContext(OnboardingContext);

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('address_info');
      if (saved) setForm(JSON.parse(saved));
    };
    loadData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      AsyncStorage.setItem('address_info', JSON.stringify(form));
    }, 500);
    return () => clearTimeout(timeout);
  }, [form]);

  const getValidationError = (key, value) => {
    if (!value.trim()) {
      return {
        addressLine: 'Address Line is required',
        city: 'City is required',
        pincode: 'Pincode is required',
        state: 'State is required',
      }[key];
    }

    if (key === 'pincode' && !/^\d{6}$/.test(value)) {
      return 'Enter a valid 6-digit pincode';
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

  const handleChange = (key, value) => {
    const updatedValue = key === 'pincode' ? value.replace(/\D/g, '') : value;
    setForm((prev) => ({ ...prev, [key]: updatedValue }));
    validateField(key, updatedValue);
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        updateData?.('addressInfo', form); // if context exists
        await AsyncStorage.setItem('address_info', JSON.stringify(form));
        navigation.navigate('Step4DocumentUpload');
      } catch (e) {
        console.error('Error saving address details:', e);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar title="Address Information" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.stepText}>Step 3 of 4</Text>
          <Text style={styles.title}>Enter Address Details</Text>

          {/* Address Line */}
          <Field
            label="Address Line"
            name="addressLine"
            form={form}
            errors={errors}
            focusedField={focusedField}
            onFocus={setFocusedField}
            onChange={handleChange}
          />

          {/* City */}
          <Field
            label="City"
            name="city"
            form={form}
            errors={errors}
            focusedField={focusedField}
            onFocus={setFocusedField}
            onChange={handleChange}
          />

          {/* Pincode */}
          <Field
            label="Pincode"
            name="pincode"
            form={form}
            errors={errors}
            focusedField={focusedField}
            onFocus={setFocusedField}
            onChange={handleChange}
            keyboardType="number-pad"
            maxLength={6}
          />

          {/* State */}
          <Field
            label="State"
            name="state"
            form={form}
            errors={errors}
            focusedField={focusedField}
            onFocus={setFocusedField}
            onChange={handleChange}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const Field = ({
  label,
  name,
  form,
  errors,
  focusedField,
  onFocus,
  onChange,
  keyboardType = 'default',
  maxLength = undefined,
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        errors[name] && styles.inputError,
        focusedField === name && styles.inputFocused,
      ]}
      placeholder={`e.g. ${label === 'Pincode' ? '411001' : label}`}
      value={form[name]}
      onChangeText={(val) => onChange(name, val)}
      placeholderTextColor="#999"
      onFocus={() => onFocus(name)}
      onBlur={() => onFocus('')}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
    {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
  </>
);

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

export default Step5AddressInfo;
