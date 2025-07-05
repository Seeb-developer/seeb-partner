import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Navbar from '../../../component/Navbar';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingContext } from '../../../context/OnboardingContext';

const Step2PersonalInfo = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    profession: '',
    email: '',
    aadhaar: '',
    pan: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState({});
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const { updateData } = useContext(OnboardingContext);

  const [workOptions, setWorkOptions] = useState([
    { label: 'Electrician', value: 'Electrician' },
    { label: 'Plumber', value: 'Plumber' },
    { label: 'Painter', value: 'Painter' },
    { label: 'Carpenter', value: 'Carpenter' },
    { label: 'Other', value: 'Other' },
  ]);

  const genderOptions = ['Male', 'Female', 'Other'];

  const isAdult = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split('/');
    const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  const formatAadhaar = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatPAN = (val) => val.toUpperCase();

  const validateField = (key, value) => {
    let message = '';

    if (key === 'fullName') {
      if (!value.trim()) message = 'Full Name is required';
      else if (/\d/.test(value)) message = 'Full Name cannot contain numbers';
    }

    if (key === 'dob') {
      if (!value.trim()) message = 'Date of Birth is required';
      else if (!isAdult(value)) message = 'Must be 18 years or older';
    }

    if (key === 'profession' && !value.trim()) {
      message = 'Profession is required';
    }

    if (key === 'aadhaar') {
      const cleaned = value.replace(/\s/g, '');
      if (!cleaned) message = 'Aadhaar Number is required';
      else if (!/^\d{12}$/.test(cleaned)) message = 'Enter valid 12-digit Aadhaar';
    }

    if (key === 'pan') {
      if (!value) message = 'PAN Number is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) message = 'Enter valid PAN (ABCDE1234F)';
    }

    if (key === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        message = 'Enter a valid email address';
      }
    }

    if (key === 'emergencyContact') {
      const digits = value.replace(/\D/g, '');
      if (!value) message = "Mobile Number is required"
      else if (digits && digits.length !== 10) message = 'Enter a valid 10-digit number';
    }

    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const handleChange = (key, val) => {
    let updated = val;

    if (key === 'fullName') {
      updated = val.replace(/[0-9]/g, '');
    }

    if (key === 'aadhaar') {
      updated = formatAadhaar(val);
    }

    if (key === 'pan') {
      updated = formatPAN(val);
    }

    if (key === 'emergencyContact') {
      updated = val.replace(/\D/g, '');
    }

    setForm((prev) => ({ ...prev, [key]: updated }));
    validateField(key, updated);
  };

  const handleDobConfirm = (date) => {
    const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()}`;
    handleChange('dob', formatted);
    setDobPickerVisible(false);
  };

  const formatDOB = (text) => {
    setErrors((prev) => ({ ...prev, dob: '' }));
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = '';
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }
    handleChange('dob', formatted);

    // setForm((prev) => ({ ...prev, dob: formatted }));

    if (cleaned.length === 8) {
      const day = parseInt(cleaned.slice(0, 2), 10);
      const month = parseInt(cleaned.slice(2, 4), 10);
      const year = parseInt(cleaned.slice(4), 10);

      const date = new Date(`${year}-${month}-${day}`);
      const today = new Date();

      if (
        date.getDate() !== day ||
        date.getMonth() + 1 !== month ||
        date.getFullYear() !== year ||
        date > today
      ) {
        setErrors((prev) => ({ ...prev, dob: 'Enter a valid past date' }));
      }
    }
  };


  const validateForm = () => {
    let hasError = false;
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      let message = '';

      if (key === 'fullName') {
        if (!value.trim()) message = 'Full Name is required';
        else if (/\d/.test(value)) message = 'Full Name cannot contain numbers';
      }

      if (key === 'dob') {
        if (!value.trim()) message = 'Date of Birth is required';
        else if (!isAdult(value)) message = 'Must be 18 years or older';
      }

      if (key === 'gender' && !value.trim()) {
        message = 'Gender is required';
      }

      if (key === 'profession' && !value.trim()) {
        message = 'Profession is required';
      }

      if (key === 'aadhaar') {
        const cleaned = value.replace(/\s/g, '');
        if (!cleaned) message = 'Aadhaar Number is required';
        else if (!/^\d{12}$/.test(cleaned)) message = 'Enter valid 12-digit Aadhaar';
      }

      if (key === 'pan') {
        if (!value) message = 'PAN Number is required';
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) message = 'Enter valid PAN (ABCDE1234F)';
      }

      if (key === 'emergencyContact') {
        const digits = value.replace(/\D/g, '');
        if (!value) message = 'Mobile Number is required';
        else if (digits.length !== 10) message = 'Enter a valid 10-digit number';
      }

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
        updateData('personalInfo', form);
        await AsyncStorage.setItem('personal_info', JSON.stringify(form));
        navigation.navigate('Step3BankDetails');
      } catch (error) {
        console.log('Error saving personal info:', error);
      }
    }
  };

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const saved = await AsyncStorage.getItem('personal_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          setForm(parsed);
          setValue(parsed.profession); // sets selected value in DropDownPicker
        }
      } catch (error) {
        console.log('Failed to load personal info:', error);
      }
    };

    loadSavedData();
  }, []);

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      AsyncStorage.setItem('personal_info', JSON.stringify(form));
    }, 500); // save after 500ms of inactivity

    return () => clearTimeout(timeoutRef);
  }, [form]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0} // Adjust this based on your Navbar height
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar title="Personal Information" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.stepText}>Step 1 of 4</Text>
          <Text style={styles.title}>Enter Your Details</Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError, focusedField === 'fullName' && styles.inputFocused]}
            placeholder="Full Name"
            value={form.fullName}
            onChangeText={(val) => handleChange('fullName', val)}
            placeholderTextColor="#999"
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField('')}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          {/* DOB */}
          <Text style={styles.label}>Date of Birth</Text>
          <View style={[
            styles.inputWrapper,
            errors.dob && styles.inputError,
            focusedField === 'dob' && styles.inputFocused,
          ]}>
            <TextInput
              style={styles.dobinput}
              placeholder="DD/MM/YYYY"
              value={form.dob}
              onChangeText={formatDOB}
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={10}
              onFocus={() => setFocusedField('dob')}
              onBlur={() => setFocusedField('')}
            />
            <TouchableOpacity onPress={() => setDobPickerVisible(true)} style={styles.iconRight}>
              <Icon name="calendar" size={20} color="#FF9800" />
            </TouchableOpacity>
          </View>
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioItem}
                onPress={() => {
                  setForm((prev) => ({ ...prev, gender: option }));
                  validateField('gender', option);
                }}
              >
                <View style={[styles.radioCircle, form.gender === option && { borderColor: '#2F6DFB' }]}>
                  {form.gender === option && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}


          {/* Profession */}
          <Text style={styles.label}>Profession</Text>
          <View style={{ zIndex: 1000, marginBottom: errors.profession ? 4 : 12 }}>
            <DropDownPicker
              open={open}
              value={value}
              items={workOptions}
              setOpen={setOpen}
              setValue={(val) => {
                setValue(val);
                handleChange('profession', val());
              }}
              setItems={setWorkOptions}
              placeholder="Select Profession"
              style={[
                {
                  backgroundColor: '#fff',
                  borderColor: errors.profession
                    ? 'red'
                    : focusedField === 'profession'
                      ? '#96f1a7'
                      : '#DADADA',
                  borderRadius: 8,
                  minHeight: 50,
                },
              ]}
              dropDownContainerStyle={{
                borderColor: '#DADADA',
                zIndex: 9999,
              }}
              onOpen={() => setFocusedField('profession')}
              onClose={() => setFocusedField('')}
            />
          </View>
          {errors.profession && <Text style={styles.errorText}>{errors.profession}</Text>}


          {/* Email */}
          {/* <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={[
              styles.input,
              errors.email && styles.inputError,
              focusedField === 'email' && styles.inputFocused
            ]}
            placeholder="Email ID"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(val) => handleChange('email', val)}
            placeholderTextColor="#999"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>} */}

          {/* Aadhaar */}
          <Text style={styles.label}>Aadhaar Number</Text>
          <TextInput
            style={[
              styles.input,
              errors.aadhaar && styles.inputError,
              focusedField === 'aadhaar' && styles.inputFocused
            ]}
            placeholder="1234 5678 9012"
            keyboardType="number-pad"
            value={form.aadhaar}
            onChangeText={(val) => handleChange('aadhaar', val)}
            placeholderTextColor="#999"
            maxLength={14}
            onFocus={() => setFocusedField('aadhaar')}
            onBlur={() => setFocusedField('')}
          />
          {errors.aadhaar && <Text style={styles.errorText}>{errors.aadhaar}</Text>}

          {/* PAN */}
          <Text style={styles.label}>PAN Number</Text>
          <TextInput
            style={[
              styles.input,
              errors.pan && styles.inputError,
              focusedField === 'pan' && styles.inputFocused
            ]}
            placeholder="ABCDE1234F"
            value={form.pan}
            onChangeText={(val) => handleChange('pan', val)}
            placeholderTextColor="#999"
            maxLength={10}
            onFocus={() => setFocusedField('pan')}
            onBlur={() => setFocusedField('')}
          />
          {errors.pan && <Text style={styles.errorText}>{errors.pan}</Text>}

          {/* Emergency Contact */}
          <Text style={styles.label}>Emergency / Alternate Contact</Text>
          <TextInput style={[
            styles.input,
            errors.emergencyContact && styles.inputError,
            focusedField === 'number' && styles.inputFocused
          ]}
            placeholder="10-digit Mobile Number"
            keyboardType="number-pad"
            value={form.emergencyContact}
            onChangeText={(val) => handleChange('emergencyContact', val)}
            placeholderTextColor="#999"
            maxLength={10}
            onFocus={() => setFocusedField('number')}
            onBlur={() => setFocusedField('')}
          />
          {errors.emergencyContact && <Text style={styles.errorText}>{errors.emergencyContact}</Text>}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>

        <DateTimePickerModal
          isVisible={dobPickerVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={handleDobConfirm}
          onCancel={() => setDobPickerVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24, paddingBottom: 40, zIndex: Platform.OS === 'android' ? 1 : 1000,
  },
  stepText: { fontSize: 14, color: '#777', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DADADA',
    marginBottom: 6,
    paddingRight: 12,
    // marginTop: 10
  },
  dobinput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconRight: {
    paddingLeft: 8,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DADADA',
    marginBottom: 6,
    // marginTop: 4,
  },
  inputError: {
    borderColor: 'red',
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
  inputFocused: {
    borderColor: '#96f1a7',
  },

  radioGroup: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DADADA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2F6DFB',
  },

  radioLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },


});

export default Step2PersonalInfo;
