import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, get, post } from '../../utils/api';
import Navbar from '../../component/Navbar';
import UploadItem from '../../component/onboarding/UploadItem';
import Toast from 'react-native-toast-message';


const UpdateDocumnet = ({ navigation, route }) => {
    const { partner_id } = route?.params || {};
    const [documents, setDocuments] = useState({
        aadhar_front: null,
        aadhar_back: null,
        pan_card: null,
        address_proof: null,
        photo: null,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const res = await get(`/onboarding-data/${partner_id}`);
                if (res?.data?.data?.documents) {
                    const docsArray = res.data.data.documents;

                    const updatedDocs = {};
                    docsArray.forEach((doc) => {
                        updatedDocs[doc.type] = `${API_URL}${doc.file_path}`;
                    });

                    setDocuments((prev) => ({
                        ...prev,
                        ...updatedDocs,
                    }));
                }
            } catch (e) {
                console.error('Error fetching document data:', e);
            }
        };
        loadDocs();
    }, []);

    const handlePick = (key) => (response) => {
        if (response?.assets?.[0]?.uri) {
            setDocuments((prev) => ({ ...prev, [key]: response.assets[0].uri }));
            setErrors((prev) => ({ ...prev, [key]: '' }));
        }
    };
    const documentLabels = {
        aadhar_front: 'Aadhaar Card (Front)',
        aadhar_back: 'Aadhaar Card (Back)',
        pan_card: 'PAN Card',
        address_proof: 'Address Proof',
        photo: 'Photo',
    };

    const validateForm = () => {
        let hasError = false;
        const newErrors = {};

        Object.keys(documents).forEach((key) => {
            if (!documents[key]) {
                const label = documentLabels[key] || 'This field';
                newErrors[key] = `${label} is required`;
                hasError = true;
            }
        });

        setErrors(newErrors);
        return !hasError;
    };

    const handleNext = async () => {
        if (!validateForm()) return;

        try {
            const formdata = new FormData();
            formdata.append('partner_id', partner_id)
            const fileFields = ['aadhar_front', 'aadhar_back', 'pan_card', 'address_proof', 'photo'];

            let hasNewFiles = false;

            fileFields.forEach((key) => {
                const value = documents[key];
                console.log("new", value)

                if (value && typeof value === 'string' &&
                    (value.startsWith('file://') || value.includes('/react-native-image-crop-picker/'))) {
                    formdata.append(key, {
                        uri: value,
                        name: `${key}.jpg`,
                        type: 'image/jpeg',
                    });

                    hasNewFiles = true
                }

                if (value && typeof value === 'string' && (value.startsWith('file://') || value.startsWith('content://'))) {
                    formdata.append(key, {
                        uri: value,
                        name: `${key}.jpg`,
                        type: 'image/jpeg',
                    });
                    hasNewFiles = true;
                }
            });

            if (!hasNewFiles) {
                Toast.show({
                    type: 'info',
                    text1: 'No Changes',
                    text2: 'No new documents selected for update.',
                });
                return;
            }

            const res = await post(`/update-documents`, formdata, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res?.data?.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Documents Uploaded',
                    text2: 'Your documents have been updated successfully!',
                });
                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Upload Failed',
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

            console.error('Error uploading documents:', e);
        }
    };


    const uploadFields = [
        { key: 'aadhar_front', label: 'Aadhaar Card (Front)', info: 'JPG/PNG, max 2MB' },
        { key: 'aadhar_back', label: 'Aadhaar Card (Back)', info: 'JPG/PNG, max 2MB' },
        { key: 'pan_card', label: 'PAN Card', info: 'JPG/PNG or PDF' },
        { key: 'address_proof', label: 'Address Proof', info: 'Utility bill, rental agreement, etc.' },
        { key: 'photo', label: 'Your Photo', info: 'Clear face photo, JPG only' },
    ];

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Navbar title="Update Documents" onBack={() => navigation.goBack()} />
                <ScrollView contentContainerStyle={styles.container}>
                    {/* <Text style={styles.stepText}>Step 4 of 4</Text> */}
                    {/* <Text style={styles.title}>Upload Required Documents</Text> */}

                    {uploadFields.map(({ key, label, info }) => (
                        <View key={key}>
                            <UploadItem
                                label={label}
                                value={documents[key]}
                                onPick={handlePick(key)}
                                info={info}
                                fieldKey={key}
                            />
                            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
                        <Text style={styles.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 24, paddingBottom: 40 },
    stepText: { fontSize: 14, color: '#777', marginBottom: 10 },
    title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginBottom: 12,
        marginTop: -8,
        marginLeft: 4,
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

export default UpdateDocumnet;
