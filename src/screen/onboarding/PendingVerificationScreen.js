import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useEffect } from 'react';
import { get } from '../../utils/api'
const PendingVerificationScreen = ({ navigation, route }) => {
  const { partner_id } = route?.params; // Assuming you pass userId from the previous screen
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get(`/onboarding-data/${partner_id}`);
        const { partner, documents, bank_details, onboarding_status } = res?.data?.data;

        const documentMap = {};
        documents.forEach((doc) => {
          documentMap[doc.type] = {
            uri: `https://backend.seeb.in/${doc.file_path}`,
            status: doc.status,
            message: doc.rejection_reason || '',
          };
        });

        if (onboarding_status?.is_onboarding_complete) {
          navigation.replace('Login');
          return;
        }

        setVerification({
          mobile: {
            status: onboarding_status.mobile_verified,
            data: { mobile: partner.mobile },
          },
          personal: {
            status: 'verified',
            data: {
              name: partner.name,
              dob: partner.dob,
              work: partner.work,
              aadhaar_no: partner.aadhaar_no,
              pan_no: partner.pan_no,
            },
          },
          bank: {
            status: onboarding_status.bank_verified,
            data: {
              account_holder_name: bank_details.account_holder_name,
              bank_name: bank_details.bank_name,
              account_number: bank_details.account_number,
              ifsc_code: bank_details.ifsc_code,
            },
          },
          documents: {
            status: onboarding_status.documents_verified,
            data: documentMap,
          },
        });
      } catch (err) {
        console.error('Failed to load verification data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [openSections, setOpenSections] = useState({
    mobile: false,
    personal: false,
    bank: false,
    documents: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderStatus = (status, reason = '') => {
    if (status === 'verified') return <Text style={styles.verified}>✅ Verified</Text>;
    if (status === 'pending') return <Text style={styles.pending}>⏳ Pending</Text>;
    if (status === 'error') return <Text style={styles.error}>❌ Failed</Text>;
    return null;
  };

  const renderData = (data) =>
    Object.entries(data).map(([k, v]) => (
      <View key={k} style={styles.row}>
        <Text style={styles.label}>{k.replace(/_/g, ' ').toUpperCase()}</Text>
        <Text style={styles.value}>{v}</Text>
      </View>
    ));

  const renderDocumentRow = (docKey, doc) => (
    <View key={docKey} style={styles.docRow}>
      {console.log('doc:', doc)}
      <Image source={{ uri: doc.uri }} style={styles.docImage} />
      <View style={styles.docTextBlock}>
        <Text style={styles.docName}>{docKey.replace(/_/g, ' ').toUpperCase()}</Text>
        <Text
          style={[
            styles.docStatus,
            doc.status === 'verified' && styles.verified,
            doc.status === 'error' && styles.error,
            doc.status === 'pending' && styles.pending,
          ]}
        >
          {doc.status === 'verified' ? 'Approved ✅' :
            doc.status === 'pending' ? 'Pending ⏳' : 'Failed ❌'}
        </Text>
        {doc.message ? <Text style={styles.docMessage}>* {doc.message}</Text> : null}
      </View>
    </View>
  );


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!verification) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load data</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verification in Progress 🎉</Text>
      {[
        { key: 'mobile', title: '📱 Mobile Verification', data: verification?.mobile || [] },
        { key: 'personal', title: '👤 Personal Details', data: verification?.personal || [] },
        { key: 'bank', title: '🏦 Bank Details', data: verification?.bank || [] },
      ].map(({ key, title, data }) => (
        <View key={key} style={styles.sectionCard}>
          <TouchableOpacity onPress={() => toggleSection(key)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionStatus}>
              {renderStatus(data.status)}
              <Text style={styles.arrowIcon}>{openSections[key] ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          {openSections[key] && (
            <View style={{ marginTop: 10 }}>{renderData(data.data)}</View>
          )}
        </View>
      ))}


      {/* Document Verification */}
      <View style={styles.sectionCard}>
        <TouchableOpacity onPress={() => toggleSection('documents')} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📄 Document Verification</Text>
          <View style={styles.sectionStatus}>
            {renderStatus(verification?.documents?.status)}
            <Text style={styles.arrowIcon}>{openSections?.documents ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>

        {openSections?.documents && (
          <View style={{ marginTop: 10 }}>
            {Object.entries(verification?.documents?.data).map(([key, doc]) =>
              renderDocumentRow(key, doc)
            )}
          </View>
        )}
      </View>

      <Text style={styles.infoText}>
        The verification process usually takes 3–4 working days. You will be notified upon completion.
      </Text>
      {/* Action Buttons */}
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            { backgroundColor: '#087f5b', opacity: 0.6 },
          ]}
          disabled
        >
          <Text style={styles.ctaText}>Go to Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.ctaButton,
            { backgroundColor: '#EFBF04', marginTop: 12 },
          ]}
          onPress={() => navigation.replace('OnboardingForm', { update: true })}
        >
          <Text style={[styles.ctaText, { color: '#000' }]}>Update Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFFDF4' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 40, textAlign: 'center' },
  infoText: { fontSize: 13, color: '#555', marginBottom: 16, textAlign: 'center', marginTop: 20 },
  sectionHeader: {
    // backgroundColor: '#fff',
    // padding: 14,
    // paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  sectionContent: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  label: { fontSize: 13, color: '#555' },
  value: { fontWeight: '600', color: '#000' },
  verified: { color: 'green', fontWeight: '600' },
  pending: { color: '#EFBF04', fontWeight: '600' },
  error: { color: 'red', fontWeight: '600' },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  docImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  docTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  docName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  docStatus: { fontSize: 13, marginBottom: 4 },
  docMessage: { fontSize: 12, color: '#a00' },
  ctaButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  ctaText: { fontWeight: 'bold', fontSize: 16, color: '#fff' },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  sectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#555',
    marginLeft: 6,
  },
});

export default PendingVerificationScreen;
