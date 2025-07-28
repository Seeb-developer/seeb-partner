import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Toast from 'react-native-toast-message';
import { post } from '../utils/api';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const onboardingStatus = await AsyncStorage.getItem('onboarding_status'); // "true" or "false"
                const seenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding'); // "true" or null
                const partnerJson = await AsyncStorage.getItem('partner');
                const partner = partnerJson ? JSON.parse(partnerJson) : null;

                // setTimeout(() => {
                if (!token) {
                    // User not logged in
                    if (seenOnboarding === 'true') {
                        navigation.replace('Login');
                    } else {
                        navigation.replace('Onboarding');
                    }
                } else {
                    // User is logged in
                    if (!partner || !partner.status) {
                        navigation.replace('Login');
                        return;
                    }

                    const status = partner.status.toLowerCase();

                    switch (status) {
                        case 'active':

                            const email = `partner_${partner.id}@seeb.in`;
                            const password = 'seeb@chat123';

                            try {
                                await createUserWithEmailAndPassword(auth, email, password);
                                console.log('✅ Firebase user registered');
                            } catch (err) {
                                if (err.code === 'auth/email-already-in-use') {
                                    try {
                                        await signInWithEmailAndPassword(auth, email, password);
                                        console.log('✅ Firebase user logged in');
                                    } catch (loginErr) {
                                        console.error('❌ Firebase login failed:', loginErr.code, loginErr.message);
                                    }
                                } else {
                                    console.error('❌ Firebase registration failed:', err.code, err.message);
                                }
                            }

                            onAuthStateChanged(auth, async (user) => {
                                if (user) {
                                    console.log('✅ Firebase user UID:', user.uid);
                                    await AsyncStorage.setItem('firebase_uid', user.uid);


                                    const payload = {
                                        partner_id: partner.id,
                                        firebase_uid: user.uid,
                                    };

                                    try {
                                        const res = await post('store-firebase-uid', payload);
                                        console.log(res.data);
                                        
                                        // Navigate to DashboardStack after successful login
                                    } catch (err) {
                                        // Toast.show({ type: 'error', text1: 'Failed to store Firebase UID' + err });
                                        console.error('Error submitting ticket:', err);
                                    }
                                    navigation.replace('DashboardStack');
                                } else {
                                    console.log('❌ Firebase user not ready yet');
                                }
                            });


                            // if (onboardingStatus === 'true') {
                            // } else {
                            //     navigation.replace('PendingVerificationScreen', { partner_id: partner.id });
                            // }
                            break;

                        case 'pending':
                            navigation.replace('PendingVerificationScreen', { partner_id: partner.id });
                            break;

                        case 'blocked':
                        case 'terminated':
                        case 'resigned':
                        case 'rejected':
                            navigation.replace('AccessDeniedScreen', { status });
                            break;

                        default:
                            navigation.replace('Login');
                    }
                }
                // }, 2000);
            } catch (error) {
                console.error('Splash error:', error);
                navigation.replace('Login');
            }
        };

        checkStatus();
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')} // ✅ your local logo image
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.tagline}>Seeb Partner App</Text>

            {/* <ActivityIndicator size="large" color="#FFC107" style={{ marginTop: 30 }} /> */}
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 220,
        height: 220,
    },
    tagline: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
        marginTop: 12,
    },
});
