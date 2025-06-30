import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Keyboard,
  ActivityIndicator,
<<<<<<< HEAD
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
=======
>>>>>>> refs/remotes/origin/main
} from 'react-native';
import UploadItem from '../../component/onboarding/UploadItem';
import { ProgressSteps, ProgressStep } from '@ouedraogof/react-native-progress-steps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { get, post } from '../../utils/api';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
<<<<<<< HEAD
import DropDownPicker from 'react-native-dropdown-picker';
=======
>>>>>>> refs/remotes/origin/main

const { width } = Dimensions.get('window');

const steps = ['Verify Mobile', 'Personal Details', 'Bank Details', 'Upload Documents'];

const getDefaultForm = () => ({
  name: '',
  mobile: '',
  mobile_verified: false,
  otp: '',
  dob: '',
  work: '',
  labour_count: '',
  area: '',
  service_areas: '',
  aadhaar_no: '',
  pan_no: '',
  aadhar_front: '',
  aadhar_back: '',
  pan_card: '',
  address_proof: '',
  photo: '',
  account_holder_name: '',
  bank_name: '',
  bank_branch: '',
  account_number: '',
  confirm_account_number: '',
  ifsc_code: '',
  bank_document: '',
});


const OnboardingForm = ({ navigation }) => {

  const [form, setForm] = useState(() => getDefaultForm());
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const otpInputRef = useRef(null);
  const [touched, setTouched] = useState({});
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [apiErrors, setApiErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [workOptions, setWorkOptions] = useState([
=======
  const [isLoading, setIsLoading] = useState(true);
  const [partnerId, setPartnerId] = useState(null);
  const [apiErrors, setApiErrors] = useState({});


  const workOptions = [
>>>>>>> refs/remotes/origin/main
    { label: 'Carpenter', value: 'Carpenter' },
    { label: 'Electrician', value: 'Electrician' },
    { label: 'Painter', value: 'Painter' },
    { label: 'Plumber', value: 'Plumber' },
    { label: 'Mason', value: 'Mason' },
    { label: 'Other', value: 'Other' },
<<<<<<< HEAD
  ]);
=======
  ];
>>>>>>> refs/remotes/origin/main


  const handleChange = (key, val) => {
    setForm(prevForm => {
      const updatedForm = { ...prevForm, [key]: val };
      AsyncStorage.setItem('onboarding_form', JSON.stringify(updatedForm));
      return updatedForm;
    });

    setTouched(prev => ({ ...prev, [key]: true }));
  };



  const handleSendOtp = async () => {
    if (form.mobile.length !== 10) {
      Toast.show({ type: 'error', text1: 'Enter valid mobile number' });
      return;
    }

    try {
      setLoading(true); // ⏳
      const res = await post('/send-otp', { mobile: form.mobile, type: 'register' });
      Toast.show({ type: 'success', text1: 'OTP sent successfully' });

      setOtpSent(true);
      setOtpVerified(false);
      setTimer(30);
      setResendEnabled(false);
      startTimer();

      setTimeout(() => {
        otpInputRef.current?.focus(); // ✅ Autofocus after short delay
      }, 300);

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false); // ⏳
    }
  };

  const handleVerifyOtp = async () => {
    if (form.otp.length < 4) {
      Toast.show({ type: 'error', text1: 'Enter valid OTP' });
      return;
    }

    try {
      setLoading(true);
      const res = await post('/verify-otp', {
        mobile: form.mobile,
        otp: form.otp,
      });

      Toast.show({ type: 'success', text1: 'OTP verified successfully!' });

      setOtpVerified(true);
      clearInterval(timerRef.current);
      setResendEnabled(false);
      setForm((prev) => ({ ...prev, mobile_verified: true }));
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Invalid OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const next = () => {
    setStep(prev => {
      const newStep = Math.min(prev + 1, steps.length - 1);
      AsyncStorage.setItem('onboarding_step', JSON.stringify(newStep));
      return newStep;
    });
  };

  const back = () => {
    setStep(prev => {
      const newStep = Math.max(prev - 1, 0);
      AsyncStorage.setItem('onboarding_step', JSON.stringify(newStep));
      return newStep;
    });
  };

  const handleDobConfirm = (date) => {
    setTouched({ ...touched, dob: true });
    const formatted = date.toISOString().split('T')[0]; // yyyy-mm-dd
    handleChange('dob', formatted);
    setDobPickerVisible(false);

  };

  const isAdult = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  // Validate Aadhaar
  const isValidAadhaar = (aadhaar) => {
    const cleaned = aadhaar.replace(/\s/g, '');
    return /^\d{12}$/.test(cleaned);
  };

  // Validate PAN
  const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  // Format Aadhaar
  const formatAadhaar = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Format PAN
  const formatPAN = (val) => val.toUpperCase();

  const isNextDisabled = () => {
    if (step === 0) {
      return !otpVerified;
    }
    if (step === 1) {
      return !(
        form.name &&
        form.dob &&
        isAdult(form.dob) &&
        form.work &&
        isValidAadhaar(form.aadhaar_no) &&
        isValidPAN(form.pan_no)
      );
    }
    if (step === 2) {
      return !(
        form.account_holder_name &&
        form.bank_name &&
        form.bank_branch &&
        form.account_number &&
        form.confirm_account_number &&
        form.account_number.length >= 9 &&
        form.confirm_account_number.length >= 9 &&
        form.account_number === form.confirm_account_number &&
        isValidIFSC(form.ifsc_code)
      );
    }
    if (step === 3) {
      return !(form.aadhar_front && form.aadhar_back && form.pan_card && form.address_proof && form.photo && form.bank_document);
    }
    return false;
  };

  const isValidIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  const handleSubmit = async () => {
    try {
      setLoading(true); // optional loading indicator

      const formdata = new FormData();

      // Append basic fields
      formdata.append('partner_id', partnerId);
      formdata.append('name', form.name);
      formdata.append('mobile', form.mobile);
      formdata.append('mobile_verified', form.mobile_verified.toString());
      formdata.append('otp', form.otp);
      formdata.append('dob', form.dob);
<<<<<<< HEAD
      formdata.append('work', value || form.work);
=======
      formdata.append('work', form.work);
>>>>>>> refs/remotes/origin/main
      formdata.append('labour_count', form.labour_count);
      formdata.append('area', form.area);
      formdata.append('service_areas', form.service_areas);
      formdata.append('aadhaar_no', form.aadhaar_no.replace(/\s/g, ''));
      formdata.append('pan_no', form.pan_no);

      // Bank details
      formdata.append('account_holder_name', form.account_holder_name);
      formdata.append('bank_name', form.bank_name);
      formdata.append('bank_branch', form.bank_branch);
      formdata.append('account_number', form.account_number);
      formdata.append('confirm_account_number', form.confirm_account_number);
      formdata.append('ifsc_code', form.ifsc_code);

      // Attach file fields (must be valid URI or file object)
      const fileFields = [
        'aadhar_front',
        'aadhar_back',
        'pan_card',
        'address_proof',
        'photo',
        'bank_document',
      ];

      fileFields.forEach((key) => {
        const value = form[key];
        if (value) {
          if (typeof value === 'string' && value.startsWith('http')) {
            // It's a remote URL, maybe already uploaded – skip or handle if needed
            // Optional: Extract relative path
            const path = value.replace(/^.*\/uploads\//, 'uploads/');
            formdata.append(key, path); // Pass string path directly
          } else if (typeof value === 'string' && value.startsWith('uploads/')) {
            // Already a server path
            formdata.append(key, value);
          } else {
            // Local file URI
            formdata.append(key, {
              uri: value,
              name: `${key}.jpg`,
              type: 'image/jpeg',
            });
          }
        }
      });


      // Submit to backend
      const res = await post('/register', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({ type: 'success', text1: 'Registration submitted!' });

      // Cleanup and redirect
      await AsyncStorage.removeItem('onboarding_form');
      await AsyncStorage.removeItem('onboarding_step');
      navigation.replace('PendingVerificationScreen', { partner_id: res?.data?.partner_id });

    } catch (e) {
      // console.log('Submit error:', e);

      if (e.response?.status === 422) {
        const errors = e.response?.data?.errors || {};
        setApiErrors(errors); // 🔥 Set field-level errors
        Toast.show({ type: 'error', text1: 'Please fix the errors in the form.' });
      } else {
        Toast.show({ type: 'error', text1: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };



<<<<<<< HEAD
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const savedForm = await AsyncStorage.getItem('onboarding_form');
  //       const savedStep = await AsyncStorage.getItem('onboarding_step');
  //       if (savedForm) setForm(JSON.parse(savedForm));
  //       if (savedStep) setStep(Number(savedStep));
  //     } catch (error) {
  //       console.log('Failed to load onboarding data:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();

  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // const savedStep = await AsyncStorage.getItem('onboarding_step');
  //       const user = await AsyncStorage.getItem('partner');
  //       const parsedUser = JSON.parse(user);
  //       setPartnerId(parsedUser?.id);
  //       const res = await get(`/onboarding-data/${parsedUser?.id}`);
  //       const data = res?.data?.data;

  //       const docMap = {};
  //       data?.documents?.forEach(doc => {
  //         docMap[doc.type] = 'https://backend.seeb.in/' + doc.file_path;
  //       });

  //       const updatedForm = {
  //         name: data.partner.name || '',
  //         mobile: data.partner.mobile || '',
  //         mobile_verified: data.partner.mobile_verified === '1',
  //         otp: '',
  //         dob: data.partner.dob || '',
  //         work: data.partner.work || '',
  //         labour_count: data.partner.labour_count || '',
  //         area: data.partner.area || '',
  //         service_areas: data.partner.service_areas || '',
  //         aadhaar_no: data.partner.aadhaar_no || '',
  //         pan_no: data.partner.pan_no || '',
  //         aadhar_front: docMap.aadhar_front || '',
  //         aadhar_back: docMap.aadhar_back || '',
  //         pan_card: docMap.pan_card || '',
  //         address_proof: docMap.address_proof || '',
  //         photo: docMap.photo || '',
  //         account_holder_name: data.bank_details.account_holder_name || '',
  //         bank_name: data.bank_details.bank_name || '',
  //         bank_branch: data.bank_details.bank_branch || '',
  //         account_number: data.bank_details.account_number || '',
  //         confirm_account_number: data.bank_details.account_number || '',
  //         ifsc_code: data.bank_details.ifsc_code || '',
  //         bank_document: "https://backend.seeb.in/" + data.bank_details.bank_document || '',
  //       };
  //       setOtpVerified(data.partner.mobile_verified ? true : false);
  //       setForm(updatedForm);
  //       // if (savedStep) setStep(Number(savedStep));
  //     } catch (e) {
  //       console.error('Error loading onboarding data:', e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, []);
=======

  useEffect(() => {
    (async () => {
      try {
        const savedForm = await AsyncStorage.getItem('onboarding_form');
        const savedStep = await AsyncStorage.getItem('onboarding_step');
        if (savedForm) setForm(JSON.parse(savedForm));
        if (savedStep) setStep(Number(savedStep));
      } catch (error) {
        console.log('Failed to load onboarding data:', error);
      } finally {
        setIsLoading(false);
      }
    })();

  }, []);
  useEffect(() => {
    (async () => {
      try {
        // const savedStep = await AsyncStorage.getItem('onboarding_step');
        const user = await AsyncStorage.getItem('partner');
        const parsedUser = JSON.parse(user);
        setPartnerId(parsedUser?.id);
        const res = await get(`/onboarding-data/${parsedUser?.id}`);
        const data = res?.data?.data;

        const docMap = {};
        data?.documents?.forEach(doc => {
          docMap[doc.type] = 'https://backend.seeb.in/' + doc.file_path;
        });

        const updatedForm = {
          name: data.partner.name || '',
          mobile: data.partner.mobile || '',
          mobile_verified: data.partner.mobile_verified === '1',
          otp: '',
          dob: data.partner.dob || '',
          work: data.partner.work || '',
          labour_count: data.partner.labour_count || '',
          area: data.partner.area || '',
          service_areas: data.partner.service_areas || '',
          aadhaar_no: data.partner.aadhaar_no || '',
          pan_no: data.partner.pan_no || '',
          aadhar_front: docMap.aadhar_front || '',
          aadhar_back: docMap.aadhar_back || '',
          pan_card: docMap.pan_card || '',
          address_proof: docMap.address_proof || '',
          photo: docMap.photo || '',
          account_holder_name: data.bank_details.account_holder_name || '',
          bank_name: data.bank_details.bank_name || '',
          bank_branch: data.bank_details.bank_branch || '',
          account_number: data.bank_details.account_number || '',
          confirm_account_number: data.bank_details.account_number || '',
          ifsc_code: data.bank_details.ifsc_code || '',
          bank_document: "https://backend.seeb.in/" + data.bank_details.bank_document || '',
        };
        setOtpVerified(data.partner.mobile_verified ? true : false);
        setForm(updatedForm);
        // if (savedStep) setStep(Number(savedStep));
      } catch (e) {
        console.error('Error loading onboarding data:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
>>>>>>> refs/remotes/origin/main


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (form === null || step === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: '#FFFDF4' }}>
<<<<<<< HEAD
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>

            <ProgressSteps
              activeStepIconBorderColor="#087f5b"
              completedStepIconColor="#087f5b"
              completedProgressBarColor="#087f5b"
              activeLabelColor="#087f5b"
              labelColor="#999"
              progressBarColor="#ccc"
              activeStep={step}
            >
              {/* Step 1 - Verify Mobile */}
              <ProgressStep
                label={steps[0]}
                nextBtnText=""
                previousBtnText=""
                finishBtnText=""
                nextBtnStyle={{ display: 'none' }}
                removeBtnRow={true}
              >
                <View style={styles.card}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Eneter Mobile Number"
                      keyboardType="phone-pad"
                      value={form.mobile}
                      onChangeText={(val) => handleChange('mobile', val)}
                      editable={!otpSent || resendEnabled}
                      maxLength={10}
                      onBlur={() => setTouched({ ...touched, mobile: true })}
                      placeholderTextColor={'gray'}
                    />
                    {otpVerified && (
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() => {
                          clearInterval(timerRef.current);
                          setOtpSent(false);
                          setOtpVerified(false);
                          setForm((prev) => ({ ...prev, otp: '' }));
                        }}
                      >
                        <MaterialIcons name="edit" size={24} color="#000" />
                      </TouchableOpacity>
                    )}

                  </View>
                  {touched.mobile && form.mobile.length !== 10 && <Text style={styles.errorText}>Enter valid mobile number.</Text>}
                  {apiErrors.mobile && <Text style={styles.errorText}>{apiErrors.mobile}</Text>}
                  {!otpSent ? (
                    <TouchableOpacity style={[styles.ctaButton, { marginVertical: 20 }]} onPress={handleSendOtp}>
                      {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                      ) : (
                        <Text style={styles.ctaText}>Send OTP</Text>
                      )}
                    </TouchableOpacity>
                  ) : !otpVerified ? (
                    <>
                      <Text style={styles.label}>Enter OTP</Text>
                      <TextInput
                        ref={otpInputRef}
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="numeric"
                        value={form.otp}
                        maxLength={4}
                        onBlur={() => setTouched({ ...touched, otp: true })}
                        onChangeText={(val) => handleChange('otp', val)}
                        autoFocus={true}
                        placeholderTextColor={'gray'}
                      />
                      {touched.otp && form.otp.length < 4 && <Text style={styles.errorText}>Enter valid OTP.</Text>}
                      <TouchableOpacity style={[styles.ctaButton, { marginVertical: 20 }]} onPress={handleVerifyOtp}>
                        {loading ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <Text style={styles.ctaText}>Verify OTP</Text>
                        )}
                      </TouchableOpacity>

                      {/* Timer Section */}
                      {timer > 0 ? (
                        <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                          Resend OTP in {timer}s
                        </Text>
                      ) : (
                        <TouchableOpacity onPress={handleSendOtp} style={{ marginTop: 10 }}>
                          <Text style={{ textAlign: 'center', color: '#087f5b', fontWeight: 'bold' }}>Resend OTP</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <View style={{ marginVertical: 20 }}>
                      <Text style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                        OTP Verified Successfully!
                      </Text>
                    </View>
                  )}
                </View>
              </ProgressStep>

              {/* Step 2 - Personal Details */}
              <ProgressStep label={steps[1]} nextBtnText="" previousBtnText="" removeBtnRow={true}>
                <ScrollView style={{ paddingHorizontal: 5 }}>
                  <View style={styles.card}>
                    {/* Full Name */}
                    <Text style={styles.label}>Full Name <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                      style={[styles.input, !form.name && touched.name && styles.errorInput]}
                      placeholder="Enter Full Name(As per Pan Card)"
                      autoCapitalize="words"
                      autoComplete="name"
                      value={form.name}
                      onChangeText={(val) => handleChange('name', val)}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      placeholderTextColor={'gray'}
                    />
                    {touched.name && !form.name && <Text style={styles.errorText}>Name is required.</Text>}

                    {/* Date of Birth */}
                    <Text style={styles.label}>Date of Birth <Text style={{ color: 'red' }}>*</Text></Text>
                    <TouchableOpacity onPress={() => setDobPickerVisible(true)} style={[styles.input, !form.dob && touched.dob && styles.errorInput]}>
                      <Text style={{ color: form.dob ? '#000' : '#aaa' }}>
                        {form.dob || 'Select Date of Birth'}
                      </Text>
                    </TouchableOpacity>
                    {touched.dob && (!form.dob || !isAdult(form.dob)) && (
                      <Text style={styles.errorText}>
                        {form.dob ? 'Must be 18 years or older.' : 'Date of birth is required.'}
                      </Text>
                    )}
                    <DateTimePickerModal
                      isVisible={dobPickerVisible}
                      mode="date"
                      maximumDate={new Date()}
                      onConfirm={handleDobConfirm}
                      onCancel={() => setDobPickerVisible(false)}
                    />

                    {/* Work */}
                    <Text style={styles.label}>Work <Text style={{ color: 'red' }}>*</Text></Text>
                    <View style={{ position: 'relative', marginBottom: 10 }}>
                      <DropDownPicker
                        open={open}
                        value={value}
                        items={workOptions}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setWorkOptions}
                      />
                    </View>

                    {touched.work && !form.work && <Text style={styles.errorText}>Work is required.</Text>}

                    {/* Labour Count */}
                    <Text style={styles.label}>Labour Count</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="5"
                      keyboardType="numeric"
                      value={form.labour_count}
                      onChangeText={(val) => handleChange('labour_count', val)}
                    />

                    {/* Area */}
                    <Text style={styles.label}>Area</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Pune"
                      value={form.area}
                      onChangeText={(val) => handleChange('area', val)}
                      placeholderTextColor={'gray'}
                    />

                    {/* Service Areas */}
                    <Text style={styles.label}>Service Areas</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Pune, Mumbai"
                      value={form.service_areas}
                      onChangeText={(val) => handleChange('service_areas', val)}
                      placeholderTextColor={'gray'}
                    />

                    {/* Aadhaar No */}
                    <Text style={styles.label}>Aadhaar No <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                      style={[styles.input, (touched.aadhaar_no && !isValidAadhaar(form.aadhaar_no)) && styles.errorInput]}
                      placeholder="1234 5678 9012"
                      keyboardType="numeric"
                      value={form.aadhaar_no}
                      maxLength={14}
                      onChangeText={(val) => handleChange('aadhaar_no', formatAadhaar(val))}
                      onBlur={() => setTouched({ ...touched, aadhaar_no: true })}
                      placeholderTextColor={'gray'}
                    />
                    {touched.aadhaar_no && !isValidAadhaar(form.aadhaar_no) && <Text style={styles.errorText}>Enter valid 12 digit Aadhaar No.</Text>}
                    {apiErrors.aadhaar_no && <Text style={styles.errorText}>{apiErrors.aadhaar_no}</Text>}
                    {/* PAN No */}
                    <Text style={styles.label}>PAN No <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                      style={[styles.input, (touched.pan_no && !isValidPAN(form.pan_no)) && styles.errorInput]}
                      placeholder="ABCDE1234F"
                      autoCapitalize="characters"
                      value={form.pan_no}
                      maxLength={10}
                      onChangeText={(val) => handleChange('pan_no', formatPAN(val))}
                      onBlur={() => setTouched({ ...touched, pan_no: true })}
                      placeholderTextColor={'gray'}
                    />
                    {touched.pan_no && !isValidPAN(form.pan_no) && <Text style={styles.errorText}>Enter valid PAN No (ABCDE1234F).</Text>}
                    {apiErrors.pan_no && <Text style={styles.errorText}>{apiErrors.pan_no}</Text>}
                  </View>
                </ScrollView>
              </ProgressStep>

              {/* Step 3 - Bank Details (empty now, you can fill later) */}
              <ProgressStep label={steps[2]} nextBtnText="" previousBtnText="" removeBtnRow={true}>
                <ScrollView style={{ paddingHorizontal: 5 }}>
                  <View style={styles.card}>
                    {/* Account Holder Name */}
                    <Text style={styles.label}>Account Holder Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Full Name"
                      value={form.account_holder_name}
                      onChangeText={(val) => handleChange('account_holder_name', val)}
                      onBlur={() => setTouched({ ...touched, account_holder_name: true })}
                    />
                    {touched.account_holder_name && !form.account_holder_name && (
                      <Text style={styles.error}>Account holder name is required</Text>
                    )}

                    {/* Bank Name */}
                    <Text style={styles.label}>Bank Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Bank Name"
                      value={form.bank_name}
                      onChangeText={(val) => handleChange('bank_name', val)}
                      onBlur={() => setTouched({ ...touched, bank_name: true })}
                    />
                    {touched.bank_name && !form.bank_name && (
                      <Text style={styles.error}>Bank name is required</Text>
                    )}

                    {/* Bank Branch */}
                    <Text style={styles.label}>Branch Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Bank Branch Name"
                      value={form.bank_branch}
                      onChangeText={(val) => handleChange('bank_branch', val)}
                      onBlur={() => setTouched({ ...touched, bank_branch: true })}
                    />
                    {touched.bank_branch && !form.bank_branch && (
                      <Text style={styles.error}>Bank branch is required</Text>
                    )}
                    {/* Account Number */}
                    <Text style={styles.label}>Account Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Account Number"
                      value={form.account_number}
                      onChangeText={(val) => handleChange('account_number', val)}
                      keyboardType="numeric"
                      onBlur={() => setTouched({ ...touched, account_number: true })}
                    />
                    {(form.account_number && form.account_number.length < 9) && (
                      <Text style={styles.error}>Account number must be at least 9 digits</Text>
                    )}
                    {touched.account_number && !form.account_number && (
                      <Text style={styles.error}>Bank branch is required</Text>
                    )}
                    {apiErrors.account_number && <Text style={styles.error}>{apiErrors.account_number}</Text>}
                    {/* Confirm Account Number */}
                    <Text style={styles.label}>Confirm Account Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter Account Number"
                      value={form.confirm_account_number}
                      onChangeText={(val) => handleChange('confirm_account_number', val)}
                      keyboardType="numeric"
                      onBlur={() => setTouched({ ...touched, confirm_account_number: true })}
                    />
                    {(form.confirm_account_number && form.confirm_account_number.length < 9) && (
                      <Text style={styles.error}>Account number must be at least 9 digits</Text>
                    )}
                    {touched.confirm_account_number && !form.confirm_account_number && (
                      <Text style={styles.error}>Confirm account number is required</Text>
                    )}
                    {form.confirm_account_number !== form.account_number && (
                      <Text style={styles.error}>Account numbers do not match</Text>
                    )}

                    {/* IFSC Code */}
                    <Text style={styles.label}>IFSC Code</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter IFSC Code"
                      value={form.ifsc_code}
                      onChangeText={(val) => handleChange('ifsc_code', val.toUpperCase())}
                      autoCapitalize="characters"
                      maxLength={11}
                      onBlur={() => setTouched({ ...touched, ifsc_code: true })}
                    />
                    {(!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc_code) && form.ifsc_code) && (
                      <Text style={styles.error}>Invalid IFSC code format</Text>
                    )}
                    {touched.ifsc_code && !form.ifsc_code && (
                      <Text style={styles.error}>IFSC code is required</Text>
                    )}
                    {apiErrors.ifsc_code && <Text style={styles.error}>{apiErrors.ifsc_code}</Text>}

                  </View>
                </ScrollView>

              </ProgressStep>

              {/* Step 4 - Upload Documents */}
              <ProgressStep label={steps[3]} nextBtnText="" previousBtnText="" finishBtnText="" removeBtnRow={true}>
                <ScrollView contentContainerStyle={styles.scroll}>
                  <View style={styles.card}>
                    {[
                      { key: 'aadhar_front', label: 'Aadhaar Card (Front)', info: 'JPG/PNG, max 2MB' },
                      { key: 'aadhar_back', label: 'Aadhaar Card (Back)', info: 'JPG/PNG, max 2MB' },
                      { key: 'pan_card', label: 'PAN Card', info: 'JPG/PNG or PDF' },
                      { key: 'bank_document', label: 'Bank Passbook or Cancelled Cheque', info: 'JPG/PNG only, clear photo' },
                      { key: 'address_proof', label: 'Address Proof', info: 'Utility bill, rental agreement, etc.' },
                      { key: 'photo', label: 'Your Photo', info: 'Clear face photo, JPG only' },
                    ].map(({ key, label, info }) => (
                      <UploadItem
                        key={key}
                        fieldKey={key}
                        label={label}
                        value={form[key]}
                        info={info}
                        onPick={(response) => {
                          if (response?.assets && response.assets[0]) {
                            handleChange(key, response.assets[0].uri);
                          }
                        }}
                      />
                    ))}
                  </View>
                </ScrollView>
              </ProgressStep>
            </ProgressSteps>

            {/* Custom Footer Buttons */}
            {step === 0 ?
              <View style={{ margin: 20 }}>
=======
      <ProgressSteps
        activeStepIconBorderColor="#087f5b"
        completedStepIconColor="#087f5b"
        completedProgressBarColor="#087f5b"
        activeLabelColor="#087f5b"
        labelColor="#999"
        progressBarColor="#ccc"
        activeStep={step}
      >
        {/* Step 1 - Verify Mobile */}
        <ProgressStep
          label={steps[0]}
          nextBtnText=""
          previousBtnText=""
          finishBtnText=""
          nextBtnStyle={{ display: 'none' }}
          removeBtnRow={true}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Mobile Number</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Eneter Mobile Number"
                keyboardType="phone-pad"
                value={form.mobile}
                onChangeText={(val) => handleChange('mobile', val)}
                editable={!otpSent || resendEnabled}
                maxLength={10}
                onBlur={() => setTouched({ ...touched, mobile: true })}
              />
              {otpVerified && (
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => {
                    clearInterval(timerRef.current);
                    setOtpSent(false);
                    setOtpVerified(false);
                    setForm((prev) => ({ ...prev, otp: '' }));
                  }}
                >
                  <MaterialIcons name="edit" size={24} color="#000" />
                </TouchableOpacity>
              )}

            </View>
            {touched.mobile && form.mobile.length !== 10 && <Text style={styles.errorText}>Enter valid mobile number.</Text>}
            {apiErrors.mobile && <Text style={styles.errorText}>{apiErrors.mobile}</Text>}
            {!otpSent ? (
              <TouchableOpacity style={[styles.ctaButton, { marginVertical: 20 }]} onPress={handleSendOtp}>
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.ctaText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            ) : !otpVerified ? (
              <>
                <Text style={styles.label}>Enter OTP</Text>
                <TextInput
                  ref={otpInputRef}
                  style={styles.input}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  value={form.otp}
                  maxLength={4}
                  onBlur={() => setTouched({ ...touched, otp: true })}
                  onChangeText={(val) => handleChange('otp', val)}
                  autoFocus={true}
                />
                {touched.otp && form.otp.length < 4 && <Text style={styles.errorText}>Enter valid OTP.</Text>}
                <TouchableOpacity style={[styles.ctaButton, { marginVertical: 20 }]} onPress={handleVerifyOtp}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={styles.ctaText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                {/* Timer Section */}
                {timer > 0 ? (
                  <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                    Resend OTP in {timer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleSendOtp} style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: 'center', color: '#087f5b', fontWeight: 'bold' }}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={{ marginVertical: 20 }}>
                <Text style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                  OTP Verified Successfully!
                </Text>
              </View>
            )}
          </View>
        </ProgressStep>

        {/* Step 2 - Personal Details */}
        <ProgressStep label={steps[1]} nextBtnText="" previousBtnText="" removeBtnRow={true}>
          <ScrollView style={{ paddingHorizontal: 5 }}>
            <View style={styles.card}>
              {/* Full Name */}
              <Text style={styles.label}>Full Name <Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[styles.input, !form.name && touched.name && styles.errorInput]}
                placeholder="Enter Full Name(As per Pan Card)"
                autoCapitalize="words"
                autoComplete="name"
                value={form.name}
                onChangeText={(val) => handleChange('name', val)}
                onBlur={() => setTouched({ ...touched, name: true })}
              />
              {touched.name && !form.name && <Text style={styles.errorText}>Name is required.</Text>}

              {/* Date of Birth */}
              <Text style={styles.label}>Date of Birth <Text style={{ color: 'red' }}>*</Text></Text>
              <TouchableOpacity onPress={() => setDobPickerVisible(true)} style={[styles.input, !form.dob && touched.dob && styles.errorInput]}>
                <Text style={{ color: form.dob ? '#000' : '#aaa' }}>
                  {form.dob || 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              {touched.dob && (!form.dob || !isAdult(form.dob)) && (
                <Text style={styles.errorText}>
                  {form.dob ? 'Must be 18 years or older.' : 'Date of birth is required.'}
                </Text>
              )}
              <DateTimePickerModal
                isVisible={dobPickerVisible}
                mode="date"
                maximumDate={new Date()}
                onConfirm={handleDobConfirm}
                onCancel={() => setDobPickerVisible(false)}
              />

              {/* Work */}
              <Text style={styles.label}>Work <Text style={{ color: 'red' }}>*</Text></Text>
              <View style={styles.pickerWrapper}>
                <RNPickerSelect
                  placeholder={{ label: 'Select your work type', value: '' }}
                  value={form.work}
                  onValueChange={(val) => handleChange('work', val)}
                  onDonePress={() => setTouched({ ...touched, work: true })}
                  items={workOptions}
                  style={pickerSelectStyles}
                />
              </View>
              {touched.work && !form.work && <Text style={styles.errorText}>Work is required.</Text>}

              {/* Labour Count */}
              <Text style={styles.label}>Labour Count</Text>
              <TextInput
                style={styles.input}
                placeholder="5"
                keyboardType="numeric"
                value={form.labour_count}
                onChangeText={(val) => handleChange('labour_count', val)}
              />

              {/* Area */}
              <Text style={styles.label}>Area</Text>
              <TextInput
                style={styles.input}
                placeholder="Pune"
                value={form.area}
                onChangeText={(val) => handleChange('area', val)}
              />

              {/* Service Areas */}
              <Text style={styles.label}>Service Areas</Text>
              <TextInput
                style={styles.input}
                placeholder="Pune, Mumbai"
                value={form.service_areas}
                onChangeText={(val) => handleChange('service_areas', val)}
              />

              {/* Aadhaar No */}
              <Text style={styles.label}>Aadhaar No <Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[styles.input, (touched.aadhaar_no && !isValidAadhaar(form.aadhaar_no)) && styles.errorInput]}
                placeholder="1234 5678 9012"
                keyboardType="numeric"
                value={form.aadhaar_no}
                maxLength={14}
                onChangeText={(val) => handleChange('aadhaar_no', formatAadhaar(val))}
                onBlur={() => setTouched({ ...touched, aadhaar_no: true })}
              />
              {touched.aadhaar_no && !isValidAadhaar(form.aadhaar_no) && <Text style={styles.errorText}>Enter valid 12 digit Aadhaar No.</Text>}
              {apiErrors.aadhaar_no && <Text style={styles.errorText}>{apiErrors.aadhaar_no}</Text>}
              {/* PAN No */}
              <Text style={styles.label}>PAN No <Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[styles.input, (touched.pan_no && !isValidPAN(form.pan_no)) && styles.errorInput]}
                placeholder="ABCDE1234F"
                autoCapitalize="characters"
                value={form.pan_no}
                maxLength={10}
                onChangeText={(val) => handleChange('pan_no', formatPAN(val))}
                onBlur={() => setTouched({ ...touched, pan_no: true })}
              />
              {touched.pan_no && !isValidPAN(form.pan_no) && <Text style={styles.errorText}>Enter valid PAN No (ABCDE1234F).</Text>}
              {apiErrors.pan_no && <Text style={styles.errorText}>{apiErrors.pan_no}</Text>}
            </View>
          </ScrollView>
        </ProgressStep>

        {/* Step 3 - Bank Details (empty now, you can fill later) */}
        <ProgressStep label={steps[2]} nextBtnText="" previousBtnText="" removeBtnRow={true}>
          <ScrollView style={{ paddingHorizontal: 5 }}>
            <View style={styles.card}>
              {/* Account Holder Name */}
              <Text style={styles.label}>Account Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                value={form.account_holder_name}
                onChangeText={(val) => handleChange('account_holder_name', val)}
                onBlur={() => setTouched({ ...touched, account_holder_name: true })}
              />
              {touched.account_holder_name && !form.account_holder_name && (
                <Text style={styles.error}>Account holder name is required</Text>
              )}

              {/* Bank Name */}
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Bank Name"
                value={form.bank_name}
                onChangeText={(val) => handleChange('bank_name', val)}
                onBlur={() => setTouched({ ...touched, bank_name: true })}
              />
              {touched.bank_name && !form.bank_name && (
                <Text style={styles.error}>Bank name is required</Text>
              )}

              {/* Bank Branch */}
              <Text style={styles.label}>Branch Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Bank Branch Name"
                value={form.bank_branch}
                onChangeText={(val) => handleChange('bank_branch', val)}
                onBlur={() => setTouched({ ...touched, bank_branch: true })}
              />
              {touched.bank_branch && !form.bank_branch && (
                <Text style={styles.error}>Bank branch is required</Text>
              )}
              {/* Account Number */}
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Account Number"
                value={form.account_number}
                onChangeText={(val) => handleChange('account_number', val)}
                keyboardType="numeric"
                onBlur={() => setTouched({ ...touched, account_number: true })}
              />
              {(form.account_number && form.account_number.length < 9) && (
                <Text style={styles.error}>Account number must be at least 9 digits</Text>
              )}
              {touched.account_number && !form.account_number && (
                <Text style={styles.error}>Bank branch is required</Text>
              )}
              {apiErrors.account_number && <Text style={styles.error}>{apiErrors.account_number}</Text>}
              {/* Confirm Account Number */}
              <Text style={styles.label}>Confirm Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter Account Number"
                value={form.confirm_account_number}
                onChangeText={(val) => handleChange('confirm_account_number', val)}
                keyboardType="numeric"
                onBlur={() => setTouched({ ...touched, confirm_account_number: true })}
              />
              {(form.confirm_account_number && form.confirm_account_number.length < 9) && (
                <Text style={styles.error}>Account number must be at least 9 digits</Text>
              )}
              {touched.confirm_account_number && !form.confirm_account_number && (
                <Text style={styles.error}>Confirm account number is required</Text>
              )}
              {form.confirm_account_number !== form.account_number && (
                <Text style={styles.error}>Account numbers do not match</Text>
              )}

              {/* IFSC Code */}
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter IFSC Code"
                value={form.ifsc_code}
                onChangeText={(val) => handleChange('ifsc_code', val.toUpperCase())}
                autoCapitalize="characters"
                maxLength={11}
                onBlur={() => setTouched({ ...touched, ifsc_code: true })}
              />
              {(!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc_code) && form.ifsc_code) && (
                <Text style={styles.error}>Invalid IFSC code format</Text>
              )}
              {touched.ifsc_code && !form.ifsc_code && (
                <Text style={styles.error}>IFSC code is required</Text>
              )}
              {apiErrors.ifsc_code && <Text style={styles.error}>{apiErrors.ifsc_code}</Text>}

            </View>
          </ScrollView>

        </ProgressStep>

        {/* Step 4 - Upload Documents */}
        <ProgressStep label={steps[3]} nextBtnText="" previousBtnText="" finishBtnText="" removeBtnRow={true}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              {[
                { key: 'aadhar_front', label: 'Aadhaar Card (Front)', info: 'JPG/PNG, max 2MB' },
                { key: 'aadhar_back', label: 'Aadhaar Card (Back)', info: 'JPG/PNG, max 2MB' },
                { key: 'pan_card', label: 'PAN Card', info: 'JPG/PNG or PDF' },
                { key: 'bank_document', label: 'Bank Passbook or Cancelled Cheque', info: 'JPG/PNG only, clear photo' },
                { key: 'address_proof', label: 'Address Proof', info: 'Utility bill, rental agreement, etc.' },
                { key: 'photo', label: 'Your Photo', info: 'Clear face photo, JPG only' },
              ].map(({ key, label, info }) => (
                <UploadItem
                  key={key}
                  fieldKey={key}
                  label={label}
                  value={form[key]}
                  info={info}
                  onPick={(response) => {
                    if (response?.assets && response.assets[0]) {
                      handleChange(key, response.assets[0].uri);
                    }
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </ProgressStep>
      </ProgressSteps>

      {/* Custom Footer Buttons */}
      {step === 0 ?
        <View style={{ margin: 20 }}>
          <TouchableOpacity style={[
            styles.ctaButton,
            { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
          ]}
            onPress={next}
            disabled={isNextDisabled()}
          >
            <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        : step === 1 ?
          <View style={styles.navRow}>
            <View style={{ width: '45%' }} >
              <TouchableOpacity style={styles.backBtn} onPress={back}>
                <Text style={styles.ctaText}>Back</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '45%' }} >
              <TouchableOpacity style={[
                styles.ctaButton,
                { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
              ]}
                onPress={next}
                disabled={isNextDisabled()}
              >
                <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
                  Save & Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          : step === 2 ?
            <View style={styles.navRow}>
              <View style={{ width: '45%' }} >
                <TouchableOpacity style={styles.backBtn} onPress={back}>
                  <Text style={styles.ctaText}>Back</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '45%' }} >
>>>>>>> refs/remotes/origin/main
                <TouchableOpacity style={[
                  styles.ctaButton,
                  { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
                ]}
                  onPress={next}
                  disabled={isNextDisabled()}
                >
                  <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
<<<<<<< HEAD
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
              : step === 1 ?
                <View style={styles.navRow}>
                  <View style={{ width: '45%' }} >
                    <TouchableOpacity style={styles.backBtn} onPress={back}>
                      <Text style={styles.ctaText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: '45%' }} >
                    <TouchableOpacity style={[
                      styles.ctaButton,
                      { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
                    ]}
                      onPress={next}
                      disabled={isNextDisabled()}
                    >
                      <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
                        Save & Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                : step === 2 ?
                  <View style={styles.navRow}>
                    <View style={{ width: '45%' }} >
                      <TouchableOpacity style={styles.backBtn} onPress={back}>
                        <Text style={styles.ctaText}>Back</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '45%' }} >
                      <TouchableOpacity style={[
                        styles.ctaButton,
                        { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
                      ]}
                        onPress={next}
                        disabled={isNextDisabled()}
                      >
                        <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
                          Save & Next
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  : step === 3 &&
                  <View style={styles.navRow}>
                    <View style={{ width: '45%' }} >
                      <TouchableOpacity style={styles.backBtn} onPress={back}>
                        <Text style={styles.ctaText}>Back</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '45%' }} >
                      <TouchableOpacity style={[
                        styles.ctaButton,
                        { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
                      ]}
                        onPress={() => handleSubmit()}
                        disabled={isNextDisabled()}
                      >
                        <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
=======
                    Save & Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            : step === 3 &&
            <View style={styles.navRow}>
              <View style={{ width: '45%' }} >
                <TouchableOpacity style={styles.backBtn} onPress={back}>
                  <Text style={styles.ctaText}>Back</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '45%' }} >
                <TouchableOpacity style={[
                  styles.ctaButton,
                  { backgroundColor: isNextDisabled() ? '#ccc' : '#EFBF04' },
                ]}
                  onPress={() => handleSubmit()}
                  disabled={isNextDisabled()}
                >
                  <Text style={[styles.ctaText, { color: isNextDisabled() ? '#666' : '#000   ' }]}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
      }
>>>>>>> refs/remotes/origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#FFFDF4', flexGrow: 1 },
  card: { borderRadius: 16, marginHorizontal: 10, shadowRadius: 6 },
  heading: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  label: { marginTop: 13, marginBottom: 4, fontWeight: '400', fontSize: 13, color: '#000' },
<<<<<<< HEAD
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fff', color: '#000' },
=======
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fff' },
>>>>>>> refs/remotes/origin/main
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  ctaButton: {
    backgroundColor: '#EFBF04',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  backBtn: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  pickerWrapper: {
<<<<<<< HEAD
    // backgroundColor: '#fff',
    // borderColor: '#ddd',
    // borderWidth: 1,
    // borderRadius: 8,
    // paddingHorizontal: 12,
    // marginBottom: 14,
    // justifyContent: 'center',
    // height: 50,

=======
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    justifyContent: 'center',
    // height: 50,
>>>>>>> refs/remotes/origin/main
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },

});
const pickerSelectStyles = {
<<<<<<< HEAD
  inputIOS: { fontSize: 14, height: 50, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff', color: '#000', marginBottom: 2 },
  inputAndroid: { fontSize: 14, height: 50, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff', color: '#000', marginBottom: 0 },
=======
  inputIOS: { fontSize: 14, padding: 2, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff', color: '#000', marginBottom: 2 },
  inputAndroid: { fontSize: 14, padding: 2, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff', color: '#000', marginBottom: 0 },
>>>>>>> refs/remotes/origin/main
};
export default OnboardingForm;
