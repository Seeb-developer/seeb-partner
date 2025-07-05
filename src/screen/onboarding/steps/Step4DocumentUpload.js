import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Navbar from '../../../component/Navbar';
import UploadItem from '../../../component/onboarding/UploadItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingContext } from '../../../context/OnboardingContext';


const Step4DocumentUpload = ({ navigation }) => {
    const [documents, setDocuments] = useState({
        aadhar_front: null,
        aadhar_back: null,
        pan_card: null,
        address_proof: null,
        photo: null,
    });

    const [errors, setErrors] = useState({});
    const { updateData } = useContext(OnboardingContext);


    // useEffect(() => {
    //     const loadDocs = async () => {
    //         const saved = await AsyncStorage.getItem('document_upload');
    //         if (saved) {
    //             console.log(JSON.parse(saved))
    //             setDocuments(JSON.parse(saved));
    //         }
    //     };
    //     loadDocs();
    // }, []);

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         AsyncStorage.setItem('document_upload', JSON.stringify(documents));
    //     }, 400); // throttle to avoid saving on every keystroke

    //     return () => clearTimeout(timeout);
    // }, [documents]);



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


    const handleNext = async() => {
        if (validateForm()) {

            try {
                updateData?.('documentUploads', documents); // if context exists
                // await AsyncStorage.setItem('document_upload', JSON.stringify(''));
                navigation.navigate('Step6ReviewSubmit');
            } catch (e) {
                console.error('Error saving address details:', e);
            }
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
                <Navbar title="Document Upload" onBack={() => navigation.goBack()} />
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.stepText}>Step 4 of 4</Text>
                    <Text style={styles.title}>Upload Required Documents</Text>

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
                        <Text style={styles.btnText}>Continue</Text>
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

export default Step4DocumentUpload;
