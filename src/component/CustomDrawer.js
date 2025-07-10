import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/api';

const ACCENT_COLOR = '#FF9800'; // Orange

const CustomDrawer = ({ navigation, state }) => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [id, setId] = useState('')

  useEffect(() => {
    const fetchName = async () => {
      try {
        const json = await AsyncStorage.getItem('partner');
        const { name, id, profession } = JSON.parse(json);
        setId(id)
        setName(name);
        setProfession(profession)
      } catch (e) {
        console.log('Error:', e);
      }
    };
    fetchName();
  }, []);

  const currentRoute = state.routeNames[state.index];

  const drawerItems = [
  { label: 'Home', icon: 'home-outline', screen: 'Home' },
  { label: 'Earnings', icon: 'wallet-outline', screen: 'Earnings' },
  { label: 'Rate Card', icon: 'bookmark-outline', screen: 'Rate Card' },
  // { label: 'Notification', icon: 'notifications-outline', screen: 'Notification' },
  { label: 'Training', icon: 'pulse-outline', screen: 'Training' },
  { label: 'Payments Transactions', icon: 'cash-outline', screen: 'Payments' },
  { label: 'Refer and Earn', icon: 'gift-outline', screen: 'Refer' },
  { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
  { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
];



  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'onboarding_status', 'partner']);
    navigation.replace('Login');
  };
  
  const imageUrl = `${API_URL}partner/photo/${id}?t=${Date.now()}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        style={{ marginTop: 0 }}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>

          <View style={styles.avatarBox}>

            <Image
              source={{ uri: imageUrl }}
              style={styles.avatar}
            />
          </View>
          </TouchableOpacity>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.work}>{profession}</Text>
          
        </View>

        <View style={styles.menu}>
          {drawerItems.map((item, index) => {
            const isActive = currentRoute === item.screen;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(item.screen)}
                style={[styles.menuItem, isActive && styles.activeItem]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isActive ? '#000' : ACCENT_COLOR}
                  style={styles.icon}
                />
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#b00020"
            style={styles.icon}
          />
          <Text style={[styles.label, { color: '#b00020', fontWeight: 'bold' }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF3E0', // soft orange background
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  avatarBox: {
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  work: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  menu: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  activeItem: {
    backgroundColor: '#FFE0B2', // soft accent
  },
  icon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: '#555',
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#000',
  },

  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default CustomDrawer;
