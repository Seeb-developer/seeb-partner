import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from '../../utils/api';
import Navbar from '../../component/Navbar';

const ProfileScreen = ({ navigation }) => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const json = await AsyncStorage.getItem('partner');
        const { id } = JSON.parse(json);
        const res = await get(`/onboarding-data/${id}`);
        if (res.data.status === 200 && res.data.data?.partner) {
          setPartner(res.data.data.partner);
        }
      } catch (err) {
        console.log('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'onboarding_status', 'partner']);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  const renderBadge = (status) => (
    <View
      style={[
        styles.badge,
        status === 'verified' ? styles.verified : styles.unverified,
      ]}
    >
      <Text style={styles.badgeText}>
        {status === 'verified' ? '✔ Verified' : '✖ Not Verified'}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#004080" style={{ marginTop: 50 }} />;
  }

  if (!partner) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Profile data not available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                partner.profile_photo ||
                'https://backend.seeb.in/public/uploads/team_documents/1744444325_20f3864a62b02fd1ba72.jpg',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{partner.name}</Text>
          <Text style={styles.work}>{partner.work}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Info</Text>
          <DetailRow label="Birthdate" value={partner.dob} />
          <DetailRow label="Mobile" value={partner.mobile} />
          <DetailRow label="Aadhaar" value={partner.aadhaar_no} badge={renderBadge(partner.aadhaar_status)} />
          <DetailRow label="PAN" value={partner.pan_no} badge={renderBadge(partner.pan_status)} />
          <DetailRow label="Bank" value="Linked" badge={renderBadge(partner.bank_status)} />
        </View>

        <View style={styles.section}>
          <MenuRow title="ID Card" icon="card-outline" onPress={() => navigation.navigate('IDCardScreen')} />
          <MenuRow title="Bank Account" icon="wallet-outline" onPress={() => navigation.navigate('BankScreen')} />
          <MenuRow title="Uploaded Documents" icon="document-attach-outline" onPress={() => navigation.navigate('DocumentsScreen')} />
        </View>

        <View style={styles.section}>
          <MenuRow title="Logout" icon="log-out-outline" onPress={handleLogout} color="#b00020" iconcolor='#b00020' />
          <MenuRow title="Delete Account" icon="trash-outline" onPress={handleDeleteAccount} color="#b00020" iconcolor='#b00020' />
        </View>
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value, badge }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.rowRight}>
      <Text style={styles.value}>{value || 'N/A'}</Text>
      {badge}
    </View>
  </View>
);

const MenuRow = ({ title, icon, onPress, color = '#000', iconcolor = "#FF9800" }) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={18} color={iconcolor} style={{ marginRight: 8 }} />
      <Text style={[styles.menuTitle, { color }]}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={18} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fbfd',
    padding: 16,
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  work: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#003366',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  label: {
    color: '#555',
    fontSize: 14,
  },
  value: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  verified: {
    backgroundColor: '#e6f4ea',
  },
  unverified: {
    backgroundColor: '#fdecea',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ProfileScreen;
