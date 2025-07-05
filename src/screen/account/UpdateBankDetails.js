// screens/UpdateBankDetails.js

import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../component/Navbar';
import { get, put } from '../../utils/api';
import Toast from 'react-native-toast-message';

const UpdateBankDetails = ({ navigation, route }) => {
    const { partner_id } = route?.params || {};

    const [form, setForm] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
    });

    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState('');


    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const res = await get(`/onboarding-data/${partner_id}`);
                if (res?.data?.data?.bank_details) {
                    const b = res.data.data.bank_details;
                    setForm({
                        accountHolderName: b.account_holder_name || '',
                        bankName: b.bank_name || '',
                        accountNumber: b.account_number || '',
                        ifscCode: b.ifsc_code || '',
                    });
                }
            } catch (e) {
                console.error('Error fetching bank data:', e);
            }
        };
        fetchBankDetails();
    }, []);

    const getValidationError = (key, value) => {
        if (!value.trim()) {
            return `${{
                accountHolderName: 'Account Holder Name',
                bankName: 'Bank Name',
                accountNumber: 'Account Number',
                ifscCode: 'IFSC Code',
            }[key]} is required`;
        }

        if (key === 'accountHolderName' && /\d/.test(value)) {
            return 'Account Holder Name cannot contain numbers';
        }

        if (key === 'accountNumber') {
            const digits = value.replace(/\D/g, '');
            if (digits.length < 6 || digits.length > 20) {
                return 'Enter valid Account Number';
            }
        }

        if (key === 'ifscCode') {
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase())) {
                return 'Enter valid IFSC Code';
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
            if (message) {
                newErrors[key] = message;
                hasError = true;
            }
        });

        setErrors(newErrors);
        return !hasError;
    };

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        validateField(key, value);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                account_holder_name: form.accountHolderName,
                bank_name: form.bankName,
                account_number: form.accountNumber,
                ifsc_code: form.ifscCode,
                bank_branch: 'N/A',
            };

            const res = await put(`/update-bank-details/${partner_id}`, payload);

            if (res?.data?.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Bank details updated successfully!',
                });

                // Optionally store locally
                // await AsyncStorage.setItem('bank_details', JSON.stringify(form));

                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Update failed',
                    text2: res?.data?.message || 'Something went wrong.',
                });
            }
        } catch (err) {
            const serverErrors = err?.response?.data?.messages;
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

            console.error('Save error:', err);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#F6F9FF' }}>
                <Navbar title="Update Bank Details" onBack={() => navigation.goBack()} />
                <ScrollView contentContainerStyle={styles.container}>
                    {['accountHolderName', 'bankName', 'accountNumber', 'ifscCode'].map((key) => (
                        <View key={key}>
                            <Text style={styles.label}>{{
                                accountHolderName: 'Account Holder Name',
                                bankName: 'Bank Name',
                                accountNumber: 'Account Number',
                                ifscCode: 'IFSC Code',
                            }[key]}</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors[key] && styles.inputError,
                                    focusedField === key && styles.inputFocused // 👈 highlight on focus
                                ]}
                                value={form[key]}
                                onChangeText={(val) => handleChange(key, val)}
                                placeholder={`Enter ${key}`}
                                placeholderTextColor="#999"
                                autoCapitalize="characters"
                                keyboardType={key === 'accountNumber' ? 'number-pad' : 'default'}
                                onFocus={() => setFocusedField(key)}
                                onBlur={() => setFocusedField('')}
                            />
                            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 24, paddingBottom: 40, backgroundColor: '#F6F9FF' },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 8, marginBottom: 4 },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#DADADA',
        marginBottom: 6,
    },
    inputError: { borderColor: 'red' },
    errorText: { color: 'red', fontSize: 13, marginBottom: 10 },
    saveButton: {
        backgroundColor: '#2F6DFB',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    inputFocused: {
        borderColor: '#96f1a7',
    },

});

export default UpdateBankDetails;
