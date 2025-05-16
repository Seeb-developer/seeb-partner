import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AccessDeniedScreen = ({ route, navigation }) => {
    const { status } = route.params || {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Access Denied</Text>
            <Text style={styles.message}>
                Your account is currently <Text style={{ fontWeight: 'bold' }}>{status}</Text>.
            </Text>
            <Text style={styles.subtext}>
                Please contact support for more information.
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
                <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    message: { fontSize: 16, marginBottom: 6 },
    subtext: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
    button: {
        backgroundColor: '#087f5b',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: { color: '#fff', fontWeight: '600' },
});

export default AccessDeniedScreen;
