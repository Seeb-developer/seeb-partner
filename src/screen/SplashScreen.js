import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                            navigation.replace('DashboardStack');
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
