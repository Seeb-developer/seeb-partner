import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { post } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Login = ({ navigation }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const otpInputRef = useRef(null); // ✅ Ref for auto-focus
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);


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
        if (!otp || otp.length < 4) {
            Toast.show({ type: 'error', text1: 'Invalid OTP' });
            return;
        }

        try {
            setLoading(true);

            const res = await post('/login', { mobile, otp });
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


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login with OTP</Text>
            <View>
                <TextInput
                    placeholder="Enter Mobile Number"
                    style={[styles.input]}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={setMobile}
                    editable={!otpSent}
                />
                {otpSent && (
                    <TouchableOpacity
                        onPress={() => {
                            setOtpSent(false);
                            setOtp('');
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
                    <TextInput
                        ref={otpInputRef}
                        placeholder="Enter OTP"
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                        autoFocus={true}
                    />
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

            <TouchableOpacity onPress={() => navigation.navigate('OnboardingForm')}>
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
    );
};

export default Login;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        fontSize: 16,
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
