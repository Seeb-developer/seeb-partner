import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { post } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Login = ({ navigation }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    // const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const otpInputRef = useRef(null); // ✅ Ref for auto-focus
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const [focusedIndex, setFocusedIndex] = useState(null);
    
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');


    const inputsRef = useRef([]);
    const hiddenInputRef = useRef(null);
    const prevOtpRef = useRef('');

    const handleSendOtp = async () => {
        if (mobile.length !== 10) {
            Toast.show({ type: 'error', text1: 'Invalid mobile number' });
            return;
        }
        try {
            setLoading(true);
            const res = await post('/send-otp', { mobile, type: 'login' });
            setOtpSent(true);
            Toast.show({ type: 'success', text1: 'OTP sent successfully' });

            setOtpSent(true);
            setCanResend(false);
            setResendTimer(30);

            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setTimeout(() => {
                otpInputRef.current?.focus(); // ✅ Autofocus after short delay
            }, 300);
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: err.response?.data?.message || 'Failed to send OTP',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        
        // Alert.alert(typeof otp)
        if (!otp || otp.length < 4) {
            Toast.show({ type: 'error', text1: 'Invalid OTP' });
            return;
        }

        try {
            const fcm_token = await AsyncStorage.getItem('fcmtoken')
            setLoading(true);

            const res = await post('/login', { mobile, otp: otp?.join(''), fcm_token });
            console.log('Login response:', res.data);

            // Save token
            await AsyncStorage.setItem('token', res.data.token);

            // Save partner info
            const partnerData = res.data.data || {};
            await AsyncStorage.setItem('partner', JSON.stringify(partnerData));

            // Save onboarding status (only the boolean)
            const onboarding = res.data.onboarding_status || {};
            await AsyncStorage.setItem('onboarding_status', JSON.stringify(onboarding.is_onboarding_complete));

            // Save partner status separately
            if (partnerData.status) {
                await AsyncStorage.setItem('partner_status', partnerData.status);
            }

            Toast.show({ type: 'success', text1: 'Login successful' });

            // Navigate to SplashScreen for further decision
            navigation.replace('Splash');
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: err.response?.data?.message || 'OTP verification failed',
            });
        } finally {
            setLoading(false);
        }
    };


    const handleResendOtp = async () => {
        if (!canResend) return;

        try {
            setLoading(true);
            const res = await post('/send-otp', { mobile, type: 'login' });
            Toast.show({ type: 'success', text1: 'OTP resent successfully' });

            setCanResend(false);
            setResendTimer(30);

            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: err.response?.data?.message || 'Failed to resend OTP',
            });
        } finally {
            setLoading(false);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../../assets/playstore.png')} style={{ width: 150, height: 150, marginBottom: 30, borderRadius: 20 }} resizeMode='contain' />
                </View>
                <Text style={styles.title}>Login with OTP</Text>
                <View>
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

                    {otpSent && (
                        <TouchableOpacity
                            onPress={() => {
                                setOtpSent(false);
                                setOtp(['', '', '', '']);
                                setCanResend(false);
                                setResendTimer(0);
                            }}
                            style={styles.editIcon}
                        >
                            <MaterialIcons name="edit" size={24} color="#000" />
                        </TouchableOpacity>
                    )}
                </View>

                {otpSent && (
                    <>
                        {/* <TextInput
                            ref={otpInputRef}
                            placeholder="Enter OTP"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            autoFocus={true}
                            placeholderTextColor={'gray'}
                        /> */}
                        <TextInput
                            ref={hiddenInputRef}
                            style={{ position: 'absolute', height: 0, width: 0, opacity: 0 }}
                            value={otp?.join('')}
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
                            {otp?.map((digit, index) => (
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
                        <TouchableOpacity onPress={handleResendOtp} disabled={!canResend}>
                            <Text style={[styles.resendText, !canResend && { color: '#aaa' }]}>
                                {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={otpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {otpSent ? 'Verify OTP' : 'Send OTP'}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => navigation.navigate('OnboardingForm')}> */}
                <TouchableOpacity onPress={() => navigation.navigate('Step1_Mobile')}>
                    <Text style={styles.registerText}>
                        New to Seeb Partner? <Text style={styles.registerLink}>Register Now</Text>
                    </Text>
                </TouchableOpacity>

                <Text style={styles.privacy}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.link}>Terms</Text> &{' '}
                    <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#000' },
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
        marginBottom: 24,
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
    button: {
        backgroundColor: '#FFC107',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 16,
    },
    privacy: { fontSize: 12, textAlign: 'center', marginTop: 30, color: '#6b7280' },
    link: { textDecorationLine: 'underline', color: '#000' },
    registerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#444',
    },
    registerLink: {
        color: '#000',
        fontWeight: 'bold',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 14,
        paddingRight: 10,
        backgroundColor: '#fff',
    },
    editIcon: {
        // padding: 6,
        // marginLeft: 8,
        position: 'absolute',
        right: 10,
        top: 10
    },
    resendText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#007AFF',
        fontWeight: '500',
    },
});
