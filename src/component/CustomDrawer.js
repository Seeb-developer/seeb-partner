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
  TouchableOpacity,
<<<<<<< HEAD
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCENT_COLOR = '#FF9800'; // Orange

const CustomDrawer = ({ navigation, state }) => {
  const [name, setName] = useState('Haseeb Khan');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const json = await AsyncStorage.getItem('partner');
        const { name } = JSON.parse(json);
        setName(name);
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
    { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
    { label: 'Support', icon: 'help-circle-outline', screen: 'Support' },
    { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
  ];


  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'onboarding_status', 'partner']);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        style={{ marginTop: 0 }}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarBox}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/14.jpg' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{name}</Text>
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
=======
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomDrawer = (props) => {
  const { state, navigation } = props;

  const activeRoute = state.routeNames[state.index];

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const drawerItems = [
    { label: 'Home', icon: 'home-outline', navigate: 'Home' },
    { label: 'Earnings', icon: 'wallet-outline', navigate: 'Earnings' },
    { label: 'Rate Card', icon: 'pricetag-outline', navigate: 'Rate Card' },
    { label: 'Profile', icon: 'person-outline', navigate: 'Profile' },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#fff' }}>
        
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://backend.seeb.in/public/uploads/team_documents/1744444325_20f3864a62b02fd1ba72.jpg',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Haseeb Khan</Text>
      </View>

      <View style={styles.drawerList}>
        {drawerItems.map((item, index) => {
          const isActive = activeRoute === item.navigate;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.navigate)}
              style={[
                styles.drawerItem,
                isActive && styles.activeItemBackground,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? '#000' : '#444'}
                style={styles.drawerIcon}
              />
              <Text style={[styles.drawerLabel, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#000"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
>>>>>>> refs/remotes/origin/main
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
    header: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: '#FFC107',
      borderRadius: 10,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 50,
      marginBottom: 10,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#000',
    },
    drawerList: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 10,
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 12,
      marginHorizontal: 10,
      marginBottom: 6,
    },
    activeItemBackground: {
      backgroundColor: '#FFF5D0', // light yellow for active item
    },
    drawerIcon: {
      marginRight: 16,
    },
    drawerLabel: {
      fontSize: 16,
      color: '#444',
    },
    activeLabel: {
      color: '#000',
      fontWeight: 'bold',
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    logout: {
      fontSize: 16,
      color: '#000',
      fontWeight: 'bold',
    },
  });
  
>>>>>>> refs/remotes/origin/main

export default CustomDrawer;
