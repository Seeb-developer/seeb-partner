import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../../utils/api';
import Navbar from '../../component/Navbar';

const BankScreen = ({ navigation }) => {
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const partnerStr = await AsyncStorage.getItem('partner');
        const partner = JSON.parse(partnerStr);

        const res = await get(`/onboarding-data/${partner.id}`);
        if (res.data.status === 200) {
          const partnerData = res.data.data.bank_details;
          setBank({
            account_holder: partnerData?.account_holder_name || '',
            bank_name: partnerData?.bank_name || '',
            ifsc: partnerData?.ifsc_code || '',
            account_number: partnerData?.account_number || '',
            upi: partnerData?.upi || '',
            status: partnerData?.status || 'pending',
          });
        }
      } catch (error) {
        console.log('Error fetching bank data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBankData();
  }, []);

  const getStatusBadge = (status) => {
    let color = '#f0ad4e';
    let icon = '⏳';
    let text = 'Pending';

    if (status === 'verified') {
      color = '#5cb85c';
      icon = '✔️';
      text = 'Verified';
    } else if (status === 'rejected') {
      color = '#d9534f';
      icon = '❌';
      text = 'Rejected';
    }

    return (
      <View style={[styles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.badgeText, { color }]}>{`${icon} ${text}`}</Text>
      </View>
    );
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#004080" style={{ marginTop: 50 }} />;
  }

  if (!bank) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No bank details found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8faff' }}>
      <Navbar title="Bank Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Bank Account Info</Text>
            {getStatusBadge(bank.status)}
          </View>
          <DetailRow label="Account Holder" value={bank.account_holder} />
          <DetailRow label="Bank Name" value={bank.bank_name} />
          <DetailRow label="IFSC Code" value={bank.ifsc} />
          <DetailRow label="Account Number" value={bank.account_number} />
          <DetailRow label="UPI ID" value={bank.upi} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#111',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default BankScreen;
