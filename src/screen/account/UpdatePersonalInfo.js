import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../component/Navbar';
import { get, put } from '../../utils/api';
import { capitalizeWord, formatAadhaar, formatDate, formatPAN, isValidAadhaar, isValidEmail, isValidPAN } from '../../utils/formatters';
import Toast from 'react-native-toast-message';

const genderOptions = ['Male', 'Female', 'Other'];
const professionOptions = [
  { label: 'Electrician', value: 'Electrician' },
  { label: 'Plumber', value: 'Plumber' },
  { label: 'Painter', value: 'Painter' },
  { label: 'Carpenter', value: 'Carpenter' },
  { label: 'Other', value: 'Other' },
];


const UpdatePersonalInfo = ({ navigation, route }) => {
  const { partner_id } = route.params;
  const [form, setForm] = useState({
    fullName: '', dob: '', gender: '', profession: '',
    email: '', aadhaar: '', pan: '', emergencyContact: '',
  });
  const [errors, setErrors] = useState({});
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [openProfession, setOpenProfession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get(`/onboarding-data/${partner_id}`);
        const partner = res?.data?.data?.partner;
        if (partner) {
          setForm({
            fullName: partner.name || '',
            dob: formatDate(partner.dob),
            gender: capitalizeWord(partner.gender) || '',
            profession: partner.profession || '',
            email: partner.email || '',
            aadhaar: formatAadhaar(partner.aadhaar_no || ''),
            pan: partner.pan_no || '',
            emergencyContact: partner.emergency_contact || '',
          });
        }
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key, val) => {
    let updated = val;
    if (key === 'fullName') updated = val.replace(/[0-9]/g, '');
    if (key === 'aadhaar') updated = formatAadhaar(val);
    if (key === 'pan') updated = formatPAN(val);
    if (key === 'emergencyContact') updated = val.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, [key]: updated }));
    validateField(key, updated);
  };

  const getValidationError = (key, value) => {
    // console.log(key, value)
    if (!value.trim()) {
      const requiredFields = {
        fullName: 'Full Name',
        dob: 'Date of Birth',
        gender: 'Gender',
        profession: 'Profession',
        aadhaar: 'Aadhaar Number',
        pan: 'PAN Number',
        emergencyContact: 'Emergency Contact',
      };
      if (requiredFields[key]) {
        return `${requiredFields[key]} is required`;
      }
    }

    if (key === 'fullName' && /\d/.test(value)) {
      return 'Full Name cannot contain numbers';
    }

    if (key === 'dob') {
      const [dd, mm, yyyy] = value.split('/');
      const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (age < 18 || (age === 18 && m < 0)) {
        return 'Must be 18 years or older';
      }
    }

    if (key === 'aadhaar') {
      const cleaned = value.replace(/\s/g, '');
      if (!/^\d{12}$/.test(cleaned)) {
        return 'Enter valid 12-digit Aadhaar';
      }
    }

    if (key === 'pan' && !isValidPAN(value)) {
      return 'Enter valid PAN (ABCDE1234F)';
    }

    if (key === 'emergencyContact') {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) {
        return 'Enter a valid 10-digit number';
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
      console.log(message)
      if (message) {
        newErrors[key] = message;
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

const formatDOB = (dobStr) => {
    const parts = dobStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const data = {
          name: form.fullName,
          dob: formatDOB(form.dob),
          gender: form.gender.toLocaleLowerCase(),
          profession: form.profession,
          aadhaar_no: (form.aadhaar || '').replace(/\s+/g, ''),
          pan_no: form.pan,
          emergency_contact: form.emergencyContact,
        };

        const res = await put(`/update-personal-info/${partner_id}`, data);

        if (res?.data?.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Personal info updated successfully!',
          });

          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Update failed',
            text2: res?.data?.message || 'Something went wrong',
          });
        }
      } catch (e) {
        console.error('Error updating personal info:', e);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
        });
      }
    }
  };

  const handleDobConfirm = (date) => {
    const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    handleChange('dob', formatted);
    setDobPickerVisible(false);
  };

  const [focusedInput, setFocusedInput] = useState(null);

  const renderInput = (label, key, props = {}) => {
    const isFocused = focusedInput === key;
    const isDisabled = props.editable === false;


    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={[
              styles.input,
              errors[key] && styles.inputError,
              isFocused && styles.inputFocused,
              isDisabled && styles.inputDisabled,
            ]}
            placeholder={label}
            value={form[key]}
            onChangeText={(v) => handleChange(key, v)}
            onFocus={() => setFocusedInput(key)}
            onBlur={() => setFocusedInput(null)}
            placeholderTextColor="#999"
            {...props}
          />
          {isDisabled && (
            <Icon
              name="lock"
              size={18}
              color="#aaa"
              style={{ position: 'absolute', right: 12, top: 14 }}
            />
          )}
        </View>

        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </>
    );
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#F6F9FF' }}>
      <View style={{ flex: 1, backgroundColor: '#F6F9FF' }}>
        <Navbar title="Update Personal Details" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
          {renderInput('Full Name', 'fullName')}

          <Text style={styles.label}>Date of Birth</Text>
          <View style={[styles.inputWrapper, errors.dob && styles.inputError]}>
            <TextInput
              style={styles.dobinput}
              placeholder="DD/MM/YYYY"
              value={form.dob}
              onChangeText={(v) => handleChange('dob', v)}
              keyboardType="number-pad"
              maxLength={10}
              placeholderTextColor="#999"
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

          <Text style={styles.label}>Profession</Text>
          <DropDownPicker
            open={openProfession}
            value={form.profession}
            items={professionOptions}
            setOpen={setOpenProfession}
            setValue={(cb) => handleChange('profession', cb())}
            placeholder="Select Profession"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {errors.profession && <Text style={styles.errorText}>{errors.profession}</Text>}

          {renderInput('Aadhaar Number', 'aadhaar', { keyboardType: 'number-pad', maxLength: 14 })}
          {renderInput('PAN Number', 'pan', { maxLength: 10, })}
          {renderInput('Emergency Contact', 'emergencyContact', { keyboardType: 'number-pad', maxLength: 10 })}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.btnText}>Save Changes</Text>
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
  container: { padding: 20, backgroundColor: '#F6F9FF' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 8, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12,
    backgroundColor: '#fff', marginBottom: 4,
  },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, alignItems: 'center', backgroundColor: '#fff', marginBottom: 10,
  },
  dobinput: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
  iconRight: { padding: 10 },
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
  dropdown: {
    borderColor: '#ccc', borderRadius: 8, minHeight: 50,
    marginBottom: 10, backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ccc', zIndex: 1000,
  },
  saveBtn: {
    backgroundColor: '#2F6DFB', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  inputFocused: {
    // borderColor: '#FF9900', // Seeb accent color
    borderColor: '#96f1a7'
  },
  textInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  inputDisabled: {
    backgroundColor: '#eee',
    color: '#666',
  },

});

export default UpdatePersonalInfo;
