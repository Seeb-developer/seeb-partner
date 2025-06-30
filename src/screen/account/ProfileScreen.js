<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React from 'react';
>>>>>>> refs/remotes/origin/main
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
<<<<<<< HEAD
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
=======
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const user = {
    name: 'Haseeb Khan',
    dob: '1995-08-10',
    work: 'Electrician',
    aadhaar: '1234 5678 90112',
    pan: 'ABCDE12234F',
    mobile: '9876543210',
    profilePic: 'https://backend.seeb.in/public/uploads/team_documents/1744444325_20f3864a62b02fd1ba72.jpg',
  };

  const handleLogout = () => {
    navigation.replace('Login');
>>>>>>> refs/remotes/origin/main
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

<<<<<<< HEAD
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
=======
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: user.profilePic }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>

      {/* Personal Info + Mobile */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Personal Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Birthdate</Text>
          <Text style={styles.value}>{user.dob}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Work</Text>
          <Text style={styles.value}>{user.work}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Aadhaar</Text>
          <Text style={styles.value}>{user.aadhaar}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>PAN</Text>
          <Text style={styles.value}>{user.pan}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{user.mobile}</Text>
        </View>
      </View>

      {/* Navigable Sections */}
      <TouchableOpacity
        style={styles.sectionRow}
        onPress={() => navigation.navigate('BankScreen')}
      >
        <Text style={styles.rowTitle}>🏦 Bank Accounts</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sectionRow}
        onPress={() => navigation.navigate('DocumentsScreen')}
      >
        <Text style={styles.rowTitle}>📄 Documents</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFBEA', // Cream color
>>>>>>> refs/remotes/origin/main
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
<<<<<<< HEAD
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
=======
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
>>>>>>> refs/remotes/origin/main
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
<<<<<<< HEAD
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
=======
    paddingVertical: 6,
    borderBottomWidth: 0.6,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
>>>>>>> refs/remotes/origin/main
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
<<<<<<< HEAD
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

=======
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  sectionRow: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  buttonRow: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  logoutBtn: {
    backgroundColor: '#FFC107',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  logoutText: {
    color: '#000',
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#ff4d4f',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


>>>>>>> refs/remotes/origin/main
export default ProfileScreen;
