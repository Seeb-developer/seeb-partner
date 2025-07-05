import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navbar from '../../component/Navbar';

const supportOptions = [
    {
        label: 'Call Support',
        icon: 'call-outline',
        action: () => Linking.openURL('tel:18005703133'),
    },
    {
        label: 'Email Support',
        icon: 'mail-outline',
        action: () =>
            Linking.openURL('mailto:support@seeb.in?subject=Support%20Request'),
    },
    {
        label: 'WhatsApp Support',
        icon: 'logo-whatsapp',
        action: () => Linking.openURL('https://wa.me/7709899729'),
    },
    // {
    //     label: 'FAQs',
    //     icon: 'help-circle-outline',
    //     action: () => Alert.alert('Coming Soon', 'FAQs will be added shortly.'),
    // },
];

const SupportScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor:'#fff' }}>
            <Navbar title="Support" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>We're here to help</Text>
                {supportOptions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.option}
                        onPress={item.action}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={item.icon} size={22} color="#FF9800" style={styles.icon} />
                        <Text style={styles.label}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#aaa" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
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
});

export default SupportScreen;
