import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../../utils/api';
import Navbar from '../../component/Navbar';

const DocumentsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const partnerStr = await AsyncStorage.getItem('partner');
        const partner = JSON.parse(partnerStr);
        const res = await get(`/onboarding-data/${partner.id}`);

        if (res.data.status === 200) {
          const docsArray = res.data.data.documents;
          const partnerData = res.data.data.partner;

          const docsObj = {};
          docsArray.forEach(doc => {
            docsObj[doc.type] = {
              uri: `https://backend.seeb.in/${doc.file_path}`,
              status: doc.status || 'pending',
            };
          });

          if (partnerData?.photo) {
            docsObj['photo'] = {
              uri: `https://backend.seeb.in/${partnerData.photo}`,
              status: 'verified',
            };
          }

          setDocuments({
            aadhar_front: docsObj['aadhar_front'],
            aadhar_back: docsObj['aadhar_back'],
            pan_card: docsObj['pan_card'],
            address_proof: docsObj['address_proof'],
            photo: docsObj['photo'],
          });
        }
      } catch (error) {
        console.log('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
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

  const renderDoc = (label, doc) => (
    <View style={styles.card} key={label}>
      <View style={styles.row}>
        {doc && doc.uri ? (
          <Image source={{ uri: doc.uri }} style={styles.docImage} />
        ) : (
          <View style={[styles.docImage, styles.notUploaded]}>
            <Text style={styles.notUploadedText}>Not Uploaded</Text>
          </View>
        )}
        <View style={styles.docInfo}>
          <Text style={styles.docLabel}>{label}</Text>
          {doc?.status && getStatusBadge(doc.status)}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#004080" style={{ marginTop: 50 }} />;
  }

  if (!documents) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No documents found.</Text>
      </View>
    );
  }

  return (
    <View style={{flex:1}}>
      <Navbar title="Documents" onBack={() => navigation.goBack()} />
      <ScrollView style={{ backgroundColor: '#f8faff' }}>
        <Text style={styles.sectionTitle}>Uploaded Documents</Text>
        {renderDoc('Aadhaar Front', documents.aadhar_front)}
        {renderDoc('Aadhaar Back', documents.aadhar_back)}
        {renderDoc('PAN Card', documents.pan_card)}
        {renderDoc('Address Proof', documents.address_proof)}
        {renderDoc('Photo', documents.photo)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
    color: '#1c1c1e',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docImage: {
    width: 150,
    height: 120,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
  },
  docInfo: {
    flex: 1,
    marginLeft: 20,
  },
  docLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  notUploaded: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notUploadedText: {
    fontSize: 12,
    color: '#aaa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
});

export default DocumentsScreen;
