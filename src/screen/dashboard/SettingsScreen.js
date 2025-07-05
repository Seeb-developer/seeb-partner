import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navbar from '../../component/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsScreen = ({ navigation }) => {

    const [partnerId, setPartnerId] = useState(null);
    //   const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const json = await AsyncStorage.getItem('partner');
                const { id } = JSON.parse(json);
                console.log(json)
                setPartnerId(id)
            } catch (err) {
                console.log('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartner();
    }, []);

    const settingsItems = [
        {
            title: 'Account',
            options: [
                { label: 'Edit Profile', icon: 'person-outline', action: () => { navigation.navigate('UpdatePersonalInfo', { partner_id: partnerId }) } },
                {
                    label: 'Edit Bank Details',
                    icon: 'card-outline', // 💳 Represents bank/account details
                    action: () => { navigation.navigate('UpdateBankDetails', { partner_id: partnerId }) }
                },
                {
                    label: 'Edit Address',
                    icon: 'location-outline', // 📄 Represents document editing
                    action: () => { navigation.navigate('UpdateAddress', { partner_id: partnerId }) }
                },
                {
                    label: 'Edit Documents',
                    icon: 'document-text-outline', // 📄 Represents document editing
                    action: () => { navigation.navigate('UpdateDocuments', { partner_id: partnerId }) }
                },
                // { label: 'Change Password', icon: 'lock-closed-outline', action: () => { } },
            ],
        },
        // {
        //     title: 'Notifications',
        //     options: [
        //         { label: 'Push Notifications', icon: 'notifications-outline', action: () => { } },
        //     ],
        // },
        {
            title: 'Help & Support',
            options: [
                { label: 'FAQs', icon: 'help-circle-outline', action: () => navigation.navigate('ComingSoon') },
                { label: 'Contact Support', icon: 'call-outline', action: () => { navigation.navigate('Support')} },
            ],
        },
        {
            title: 'App',
            options: [
                { label: 'Privacy Policy', icon: 'document-text-outline', action: () => { navigation.navigate('PrivacyPolicy')} },
                { label: 'Terms & Conditions', icon: 'shield-checkmark-outline', action: () => {navigation.navigate('TermsAndConditions') } },
            ],
        },
    ];
    return (
        <View style={{ flex: 1 }}>
            <Navbar title="Settings" onBack={() => navigation.goBack()} />
            <ScrollView style={styles.container}>
                {settingsItems.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.options.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.item}
                                onPress={item.action}
                                activeOpacity={0.7}
                            >
                                <Ionicons name={item.icon} size={20} color="#FF9800" style={styles.icon} />
                                <Text style={styles.label}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#aaa" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 8,
        fontWeight: '500',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
    },
    icon: {
        marginRight: 14,
        width: 24,
        textAlign: 'center',
    },
    label: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 30,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    logoutText: {
        fontSize: 16,
        color: '#b00020',
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default SettingsScreen;
