import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Navbar from '../../component/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPartnerId, post } from '../../utils/api';
import Toast from 'react-native-toast-message';

const InvitePartnerScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');

    const handleSendInvite = async () => {
        if (!name || !mobile || mobile.length !== 10) {
            Alert.alert('Error', 'Enter a valid name and 10-digit mobile number');
            return;
        }

        try {
            const partnerId = await getPartnerId();
            const res = await post(`referral/invite`, {
                referrer_id: partnerId,
                friend_name: name,
                friend_mobile: mobile,
            });

            if (res?.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Invite sent successfully!',
                });
                navigation.goBack();
            } else {
                Alert.alert('Failed', res?.message || 'Something went wrong');
            }
        } catch (e) {
            console.log('Invite error', e);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Navbar title="Invite a Partner" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.label}>Friend's Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter 10-digit mobile number"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSendInvite}>
                        <Ionicons name="send-outline" size={18} color="#000" />
                        <Text style={styles.buttonText}>Send Invite</Text>
                    </TouchableOpacity>
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={18} color="#64748B" />
                        <Text style={styles.infoText}>
                            Once your friend joins and completes their first job, you’ll get your referral bonus!
                        </Text>
                    </View>

                    <Text style={styles.disclaimer}>
                        • Referral bonuses are subject to successful onboarding and job completion.
                    </Text>
                    <Text style={styles.disclaimer}>
                        • Make sure the mobile number is not already registered.
                    </Text>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F9FC' },
    form: { padding: 16 },
    label: { fontSize: 14, marginBottom: 6, color: '#334155' },
    input: {
        backgroundColor: '#fff',
        borderColor: '#CBD5E1',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 14,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#FFE0B2',
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: { color: '#000', fontWeight: '600', marginLeft: 8, fontSize: 15 },
    infoBox: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EEF4FF',
        padding: 12,
        borderRadius: 10,
        gap: 10,
    },
    infoText: {
        flex: 1,
        color: '#334155',
        fontSize: 13,
        lineHeight: 18,
    },
    disclaimer: {
        marginTop: 12,
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
    },

});

export default InvitePartnerScreen;
