import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../component/Navbar';
import { get, put } from '../../utils/api';
import Toast from 'react-native-toast-message';

const getLabel = (key) => ({
    addressLine: 'Address Line',
    //   addressLine2: 'Address Line 2',
    city: 'City',
    pincode: 'PIN Code',
    state: 'State',
    //   landmark: 'Landmark (Optional)',
}[key]);

const getValidationError = (key, value) => {
    if (!value.trim()) {
        return `${{
            addressLine: 'Address Line',
            city: 'City',
            pincode: 'Pincode',
            state: 'State',
        }[key]} is required`;
    }

    if (key === 'pincode' && !/^\d{6}$/.test(value)) {
        return 'Enter a valid 6-digit pincode';
    }

    return '';
};


const UpdateAddress = ({ navigation, route }) => {
    const { partner_id } = route?.params || {};

    const [form, setForm] = useState({
        addressLine: '',
        // addressLine2: '',
        city: '',
        pincode: '',
        state: '',
        // landmark: '',
    });

    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState('');


    useEffect(() => {
        const loadAddress = async () => {
            try {
                const res = await get(`/onboarding-data/${partner_id}`);
                if (res?.data?.data?.address_details) {
                    const b = res.data.data.address_details;
                    setForm({
                        addressLine: b.address_line_1 || '',
                        city: b.city || '',
                        pincode: b.pincode || '',
                        state: b.state || '',
                    });
                }
            } catch (e) {
                console.error('Error fetching bank data:', e);
            }
        };
        loadAddress();
    }, []);

    const handleChange = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
        validateField(key, val);
    };

    const validateField = (key, value) => {
        const msg = getValidationError(key, value);
        setErrors((prev) => ({ ...prev, [key]: msg }));
    };

    const validateForm = () => {
        const newErrors = {};
        let hasError = false;
        Object.entries(form).forEach(([key, value]) => {
            const msg = getValidationError(key, value);
            if (msg) {
                newErrors[key] = msg;
                hasError = true;
            }
        });
        setErrors(newErrors);
        return !hasError;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                address_line_1: form.addressLine,
                city: form.city,
                pincode: form.pincode,
                state: form.state,
            };

            const res = await put(`/update-address/${partner_id}`, payload);

            if (res?.data?.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Address updated successfully!',
                });

                // Optionally save locally
                // await AsyncStorage.setItem('address_info', JSON.stringify(form));

                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: res?.data?.message || 'Something went wrong.',
                });
            }
        } catch (e) {
            const serverErrors = e?.response?.data?.messages;
            if (serverErrors && typeof serverErrors === 'object') {
                setErrors((prev) => ({
                    ...prev,
                    ...serverErrors,
                }));

                const firstError = Object.values(serverErrors)[0];
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: firstError,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong. Please try again.',
                });
            }

            console.error('Error saving address:', e);
        }
    };

    const renderInput = (key, keyboardType = 'default', maxLength = undefined) => (
        <View key={key}>
            <Text style={styles.label}>{getLabel(key)}</Text>
            <TextInput
                style={[
                    styles.input,
                    errors[key] && styles.inputError,
                    focusedField === key && styles.inputFocused,
                ]}
                placeholder={`Enter ${getLabel(key)}`}
                value={form[key]}
                onChangeText={(val) => handleChange(key, val)}
                placeholderTextColor="#999"
                keyboardType={keyboardType}
                maxLength={maxLength}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField('')}
            />
            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
        </View>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Navbar title="Update Address Info" onBack={() => navigation.goBack()} />
                <ScrollView contentContainerStyle={styles.container}>
                    {renderInput('addressLine')}
                    {/* {renderInput('addressLine2')} */}
                    {renderInput('city')}
                    {renderInput('pincode', 'number-pad', 6)}
                    {renderInput('state')}
                    {/* {renderInput('landmark')} */}

                    <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
                        <Text style={styles.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: '#F6F9FF',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
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
        marginBottom: 4,
    },
    inputError: {
        borderColor: 'red',
    },
    inputFocused: {
        borderColor: '#96f1a7',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginBottom: 8,
    },
    primaryBtn: {
        backgroundColor: '#2F6DFB',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default UpdateAddress;
