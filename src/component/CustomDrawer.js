import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
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
  );
};

const styles = StyleSheet.create({
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
  

export default CustomDrawer;
