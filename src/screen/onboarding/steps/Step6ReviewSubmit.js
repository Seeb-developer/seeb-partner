import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Navbar from '../../../component/Navbar';
import { OnboardingContext } from '../../../context/OnboardingContext';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';
import { post } from '../../../utils/api';
import LoadingModal from '../../../component/modal/LoadingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Step6ReviewSubmit = ({ navigation }) => {
  const { onboardingData } = useContext(OnboardingContext);
  const mobile = onboardingData.mobile || '';
  const personal = onboardingData.personalInfo || {};
  const bank = onboardingData.bankDetails || {};
  const address = onboardingData.addressInfo || {};
  const documents = onboardingData.documentUploads || {};

  const [teamSize, setTeamSize] = useState(null);
  const [workingArea, setWorkingArea] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({});


  const [loading, setLoading] = useState(false)

  const renderCard = (title, children) => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderInfoRow = (label, value) => (
    <View style={styles.gridRow}>
      <Text style={styles.gridLabel}>{label}</Text>
      <Text style={styles.gridValue}>{value || '-'}</Text>
    </View>
  );
  const formatDOB = (dobStr) => {
    const parts = dobStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!teamSize) errors.teamSize = 'Please select your team size';
    if (!workingArea) errors.workingArea = 'Please select your working area';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLoading(true)

    const formdata = new FormData();
    formdata.append("name", personal.fullName);
    formdata.append("mobile", mobile); // assume mobile is stored
    formdata.append("mobile_verified", "1");
    formdata.append("dob", formatDOB(personal.dob));
    formdata.append("gender", (personal.gender || "male").toLowerCase());
    formdata.append("emergency_contact", personal.emergencyContact);
    formdata.append("profession", personal.profession);
    formdata.append("team_size", teamSize);
    formdata.append("service_areas", workingArea);
    formdata.append("aadhaar_no", (personal.aadhaar || '').replace(/\s+/g, ''));
    formdata.append("pan_no", personal.pan);

    formdata.append("account_holder_name", bank.accountHolderName);
    formdata.append("bank_name", bank.bankName);
    formdata.append("bank_branch", bank.bankBranch || "N/A");
    formdata.append("account_number", bank.accountNumber);
    formdata.append("confirm_account_number", bank.accountNumber);
    formdata.append("ifsc_code", bank.ifscCode);

    formdata.append("address_line_1", address.addressLine);
    formdata.append("pincode", address.pincode);
    formdata.append("city", address.city);
    formdata.append("state", address.state);
    formdata.append("country", address?.country || "India");

    // Append image files - they must be actual File or Blob objects in React Native
    const appendFile = (key, uri) => {
      if (uri) {
        formdata.append(key, {
          uri,
          type: 'image/jpeg',
          name: `${key}.jpg`,
        });
      }
    };

    appendFile('aadhar_front', documents.aadhar_front);
    appendFile('aadhar_back', documents.aadhar_back);
    appendFile('pan_card', documents.pan_card);
    appendFile('address_proof', documents.address_proof);
    appendFile('photo', documents.photo);

    try {
      const res = await post('/register', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.status === 200) {
        Toast.show({ type: 'success', text1: 'Registration submitted!' });
        // Cleanup and redirect
        await AsyncStorage.multiRemove([
          'personal_info',
          'bank_details',
          'address_info',
        ]);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'PendingVerificationScreen',
                params: { partner_id: res?.data?.partner_id },
              },
            ],
          })
        );
        // navigation.replace('PendingVerificationScreen', { patner_id: 1 });
      } else {
        Toast.show({ type: 'error', text1: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('API error:', error);

      if (error.response?.status === 422 && error.response.data?.errors) {
        setApiErrors(error.response.data.errors);
      } else {
        Toast.show({ type: 'error', text1: 'An error occurred while submitting your form.' });
      }
    }
    setLoading(false)
  };

  // const handleSubmit = () => {
  //   if (!teamSize || !workingArea) {
  //     alert('Please select team size and working area');
  //     return;
  //   }

  //   navigation.replace('PendingVerificationScreen', { patner_id: 1 });
  // };

  const RadioGroup = ({ label, options, selected, onSelect }) => (
    <View style={{ marginBottom: 0 }}>
      {/* <Text style={styles.radioLabel}>{label}</Text> */}
      <View style={styles.radioGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.radioOption, selected === option && styles.radioOptionSelected]}
            onPress={() => onSelect(option)}
          >
            <View style={[styles.radioCircle, selected === option && styles.radioCircleSelected]} />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: '#F6F9FF' }}>
        <Navbar title="Work Preferences" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
          {/* <Text style={styles.title}>Select Team Size & Area</Text> */}

          {/* {renderCard('Personal Information', (
            <>
              {renderInfoRow('Full Name', personal.fullName)}
              {renderInfoRow('Date of Birth', personal.dob)}
              {renderInfoRow('Profession', personal.profession)}
              {renderInfoRow('Email', personal.email)}
              {renderInfoRow('Aadhaar No.', personal.aadhaar)}
              {renderInfoRow('PAN No.', personal.pan)}
              {renderInfoRow('Emergency Contact', personal.emergencyContact)}
            </>
          ))}

          {renderCard('Bank Details', (
            <>
              {renderInfoRow('Account Holder Name', bank.accountHolderName)}
              {renderInfoRow('Bank Name', bank.bankName)}
              {renderInfoRow('Account Number', bank.accountNumber)}
              {renderInfoRow('IFSC Code', bank.ifscCode)}
            </>
          ))}

          {renderCard('Address Information', (
            <>
              {renderInfoRow('Address Line', address.addressLine)}
              {renderInfoRow('City', address.city)}
              {renderInfoRow('Pincode', address.pincode)}
              {renderInfoRow('State', address.state)}
            </>
          ))}

          {renderCard('Uploaded Documents', (
            <View style={styles.documentPreviewRow}>
              {documents.aadhar_front && (
                <Image source={{ uri: documents.aadhar_front }} style={styles.docImage} />
              )}
              {documents.aadhar_back && (
                <Image source={{ uri: documents.aadhar_back }} style={styles.docImage} />
              )}
              {documents.pan_card && (
                <Image source={{ uri: documents.pan_card }} style={styles.docImage} />
              )}
              {documents.address_proof && (
                <Image source={{ uri: documents.address_proof }} style={styles.docImage} />
              )}
              {documents.photo && (
                <Image source={{ uri: documents.photo }} style={styles.docImage} />
              )}
            </View>
          ))} */}

          {renderCard('Choose your team size', (
            <>
              <RadioGroup
                label="Choose your team size"
                options={['1', '2-5', '5-10', '10+']}
                selected={teamSize}
                onSelect={setTeamSize}
              />
              {formErrors.teamSize && <Text style={styles.errorText}>{formErrors.teamSize}</Text>}
            </>
          ))}

          {renderCard('Select your working area', (
            <>
              <RadioGroup
                label="Select your working area"
                options={['Pune', 'Mumbai', 'Bangalore', 'Pimpri-Chinchwad']}
                selected={workingArea}
                onSelect={setWorkingArea}
              />
              {formErrors.workingArea && <Text style={styles.errorText}>{formErrors.workingArea}</Text>}
            </>
          ))}

          {Object.keys(apiErrors).length > 0 && (
            <View style={styles.errorBox}>
              {Object.entries(apiErrors).map(([key, msg]) => (
                <Text key={key} style={styles.errorText}>• {msg}</Text>
              ))}
            </View>
          )}


          <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
        <LoadingModal visible={loading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2F6DFB', marginBottom: 10 },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  gridLabel: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  gridValue: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'right',
  },
  documentPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  docImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#EEE',
  },
  dropdown: {
    backgroundColor: '#F0F4FF',
    borderColor: '#DADADA',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#DADADA',
  },
  primaryBtn: {
    backgroundColor: '#2F6DFB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DADADA',
    marginRight: 10,
    marginBottom: 10,
  },
  radioOptionSelected: {
    borderColor: '#2F6DFB',
    backgroundColor: '#E8F0FF',
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioCircleSelected: {
    borderColor: '#2F6DFB',
    backgroundColor: '#2F6DFB',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },

  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },


});

export default Step6ReviewSubmit;
