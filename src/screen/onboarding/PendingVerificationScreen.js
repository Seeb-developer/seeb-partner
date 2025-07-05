import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../../utils/api';

const PendingVerificationScreen = ({ navigation, route }) => {
  const { partner_id } = route?.params;
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    mobile: false,
    personal: false,
    bank: false,
    documents: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get(`/onboarding-data/${partner_id}`);
        const { partner, documents, bank_details, onboarding_status, address_details } = res?.data?.data;

        if (onboarding_status?.is_onboarding_complete) {
          navigation.replace('Login');
          return;
        }

        const documentMap = {};
        documents.forEach((doc) => {
          documentMap[doc.type] = {
            uri: `https://backend.seeb.in/${doc.file_path}`,
            status: doc.status,
            message: doc.rejection_reason || '',
          };
        });

        setVerification({

          personal: {
            status: 'verified',
            data: {
              Name: partner.name,
              Mobile: partner.mobile,
              DOB: partner.dob,
              Profession: partner.profession,
              'Aadhaar No': partner.aadhaar_no,
              'PAN No': partner.pan_no,
              'Team Size': partner.team_size,
              'Service Areas': partner.service_areas,
              'Emergency Contact': partner.emergency_contact
            },
          },
          address: {
            status: 'verified',
            data: {
              'Address Line': address_details.address_line_1,
              City: address_details.city,
              State: address_details.state,
              Pincode: address_details.pincode,
              Country: address_details.country || 'India',
            },
          },
          bank: {
            status: onboarding_status.bank_verified,
            data: {
              'Account Holder': bank_details.account_holder_name,
              'Bank Name': bank_details.bank_name,
              'Account No': bank_details.account_number,
              IFSC: bank_details.ifsc_code,
            },
          },
          documents: {
            status: onboarding_status.documents_verified,
            data: documentMap,
          },
        });

      } catch (err) {
        console.error('Error fetching verification data', err);
        Alert.alert('Error', 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isAllVerified = Object.values(verification || {}).every(
    (section) => section.status === 'verified'
  );

  const renderStatus = (status) => {
    if (status === 'verified') return <Text style={styles.verified}>✅ Verified</Text>;
    if (status === 'pending') return <Text style={styles.pending}>⏳ Pending</Text>;
    if (status === 'error') return <Text style={styles.error}>❌ Failed</Text>;
    return null;
  };

  const renderDataRows = (data) =>
    Object.entries(data).map(([label, value]) => (
      <View key={label} style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    ));

  const renderDocumentRow = (key, doc) => (
    <View key={key} style={styles.docRow}>
      <Image source={{ uri: doc.uri }} style={styles.docImage} />
      <View style={styles.docTextBlock}>
        <Text style={styles.docName}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
        <Text style={[
          styles.docStatus,
          doc.status === 'verified' && styles.verified,
          doc.status === 'error' && styles.error,
          doc.status === 'pending' && styles.pending
        ]}>
          {doc.status === 'verified' ? 'Approved ✅' :
            doc.status === 'pending' ? 'Pending ⏳' : 'Rejected ❌'}
        </Text>
        {doc.message ? <Text style={styles.docMessage}>* {doc.message}</Text> : null}
      </View>
    </View>
  );

  if (loading || !verification) {
    return (
      <View style={styles.centerScreen}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Thank you for submitting your details!</Text>
      <Text style={styles.subtitle}>
        Our team is reviewing your information. You’ll be notified once approved.
      </Text>

      {/* Training Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📽 Partner Training Video</Text>
        <TouchableOpacity
          style={styles.trainingBox}
          onPress={() => navigation.navigate('TrainingVideo')}
        >
          <Image
            source={require('../../assets/training_thumbnail.png')}
            style={styles.trainingImage}
            resizeMode='contain'
          />
          <Text style={styles.trainingLabel}>▶ Watch Now</Text>
        </TouchableOpacity>
      </View>

      {/* Section Cards */}
      {[
        { key: 'personal', title: '👤 Personal & Work Details' },
        { key: 'address', title: '🏠 Address Information' },
        { key: 'bank', title: '🏦 Bank Details' },
        { key: 'documents', title: '📄 Document Verification' },
      ].map(({ key, title }) => (
        <View key={key} style={styles.card}>
          <TouchableOpacity
            onPress={() => toggleSection(key)}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={styles.statusWrap}>
              {renderStatus(verification[key].status)}
              <Text style={styles.arrow}>{openSections[key] ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>

          {openSections[key] && (
            <View style={{ marginTop: 10 }}>
              {key === 'documents'
                ? Object.entries(verification[key].data).map(([k, doc]) =>
                  renderDocumentRow(k, doc)
                )
                : renderDataRows(verification[key].data)}
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => {
                  const screenMap = {
                    personal: 'UpdatePersonalInfo',
                    bank: 'UpdateBankDetails',
                    address: 'UpdateAddress',
                    documents: 'UpdateDocuments',
                  };
                  const screen = screenMap[key];
                  if (screen) {
                    navigation.navigate(screen,{partner_id});
                  }
                }}

              >
                <Text style={styles.updateBtnText}>Update {title.replace(/📱|👤|🏦|📄/, '')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* Final Buttons */}
      <Text style={styles.infoText}>
        The verification process usually takes 3–4 working days. You will be notified once completed.
      </Text>

      <TouchableOpacity
        style={[styles.ctaBtn, { backgroundColor: isAllVerified ? '#087f5b' : '#ccc' }]}
        disabled={!isAllVerified}
      >
        <Text style={styles.ctaText}>Go to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ctaBtn, { backgroundColor: '#d32f2f', marginTop: 10 }]}
        onPress={handleLogout}
      >
        <Text style={styles.ctaText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F6F9FF' },
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrow: { fontSize: 14, color: '#555', marginLeft: 6 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: { fontSize: 13, color: '#777' },
  value: { fontWeight: '600', color: '#000' },
  verified: { color: 'green', fontWeight: '600' },
  pending: { color: '#EFBF04', fontWeight: '600' },
  error: { color: 'red', fontWeight: '600' },
  docRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  docImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  docTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  docName: { fontSize: 14, fontWeight: '600' },
  docStatus: { fontSize: 13 },
  docMessage: { fontSize: 12, color: '#a00' },
  updateBtn: {
    marginTop: 10,
    backgroundColor: '#EFBF04',
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  updateBtnText: {
    fontWeight: 'bold',
    color: '#000',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: '#087f5b',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  trainingBox: {
    alignItems: 'center',
    marginTop: 10,
  },
  trainingImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  trainingLabel: {
    marginTop: 8,
    color: '#2F6DFB',
    fontWeight: '600',
  },
});

export default PendingVerificationScreen;
