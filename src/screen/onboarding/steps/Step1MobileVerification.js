import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Navbar from '../../../component/Navbar';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingContext } from '../../../context/OnboardingContext';
import { post } from '../../../utils/api';

const Step1MobileVerification = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');

  const { updateData } = useContext(OnboardingContext);


  const inputsRef = useRef([]);
  const hiddenInputRef = useRef(null);
  const prevOtpRef = useRef('');


  // OTP resend timer logic
  React.useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      // setLoading(true); // ⏳
      const res = await post('/send-otp', { mobile: mobile, type: 'register' });
      Toast.show({ type: 'success', text1: 'OTP sent successfully' });

      setMobileError('');
      setOtpSent(true);
      setTimer(30);
      setResendEnabled(false);

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Failed to send OTP',
      });
    } finally {
      // setLoading(false); // ⏳
    }

  };



  const verifyOtp = async () => {
    if (otp.some(d => d === '')) {
      setOtpError('Please enter full 4-digit OTP');
      return;
    }
    setOtpError('');
    const fullOtp = otp.join('');

    try {
      // setLoading(true);
      const res = await post('/verify-otp', {
        mobile: mobile,
        otp: fullOtp,
      });

      Toast.show({ type: 'success', text1: 'OTP verified successfully!' });

      updateData('mobile', mobile);
      // await AsyncStorage.setItem('verified_mobile', mobile);
      navigation.navigate('Step2PersonalInfo');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Invalid OTP',
      });
    } finally {
      // setLoading(false);
    }

  };




  const handleChange = (text, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < 3) {
      inputsRef.current[index + 1].focus();
    }

    // if pasted full OTP
    if (text.length === 4) {
      const chars = text.split('');
      setOtp(chars);
      chars.forEach((c, i) => {
        inputsRef.current[i].setNativeProps({ text: c });
      });
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index]) {
        // Just clear current input
        const updatedOtp = [...otp];
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      } else if (index > 0) {
        // Move focus to previous input and clear it
        inputsRef.current[index - 1].focus();
        const updatedOtp = [...otp];
        updatedOtp[index - 1] = '';
        setOtp(updatedOtp);
      }
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Navbar title="Mobile Verification" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        {/* <Text style={styles.stepText}>Step 1 of 6</Text> */}
        <Text style={styles.title}>Mobile Number Verification</Text>

        {/* Mobile input */}
        <View style={[styles.inputGroup, focusedIndex == 'number' && { borderColor: '#96f1a7' }]}>
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            style={styles.inputField}
            placeholder="Enter Mobile Number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
            onFocus={() => setFocusedIndex('number')}
            onBlur={() => setFocusedIndex(null)}
          />
        </View>
        {mobileError !== '' && <Text style={{ color: 'red', marginTop: -18, marginBottom: 12 }}>{mobileError}</Text>}


        {/* OTP input */}
        {otpSent && (
          <>
            <TextInput
              ref={hiddenInputRef}
              style={{ position: 'absolute', height: 0, width: 0, opacity: 0 }}
              value={otp.join('')}
              onChangeText={(text) => {
                const chars = text.slice(0, 4).split('');
                const prev = prevOtpRef.current.split('');
                prevOtpRef.current = text;

                setOtp((prevOtp) => {
                  const updated = [...prevOtp];

                  // Handle paste or input
                  chars.forEach((c, i) => {
                    updated[i] = c;
                  });

                  // Handle backspace (when length shrinks)
                  if (text.length < prev.length) {
                    updated[text.length] = '';
                    setFocusedIndex(text.length > 0 ? text.length - 1 : 0);
                  } else {
                    setFocusedIndex(chars.length - 1);
                  }

                  return updated;
                });

                // Blur when 4 digits entered
                if (chars.length === 4) {
                  hiddenInputRef.current?.blur();
                }
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoFocus={true}
              onBlur={() => setFocusedIndex(null)}
            />

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[styles.otpBox, focusedIndex === index && { borderColor: '#96f1a7' },]}
                  placeholder="•"
                  placeholderTextColor="#bbb"
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                />
              ))}
            </View>
            {otpError !== '' && <Text style={{ color: 'red', marginBottom: 12 }}>{otpError}</Text>}

            <TouchableOpacity
              onPress={() => resendEnabled && sendOtp()}
              disabled={!resendEnabled}
            >
              <Text style={[styles.resendText, !resendEnabled && { opacity: 0.5 }]}>
                {resendEnabled ? 'Resend OTP' : `Resend OTP in ${timer}s`}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={otpSent ? verifyOtp : sendOtp}
        >
          <Text style={styles.btnText}>{otpSent ? 'Verify OTP' : 'Send OTP'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flex: 1 },
  stepText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 28,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    marginBottom: 24,
  },
  prefixBox: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#DADADA',
  },
  prefixText: {
    fontSize: 16,
    color: '#333',
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpBox: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  resendText: {
    textAlign: 'right',
    color: '#2F6DFB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#2F6DFB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Step1MobileVerification;
