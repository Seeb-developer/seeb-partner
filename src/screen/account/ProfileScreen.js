import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
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


export default ProfileScreen;
