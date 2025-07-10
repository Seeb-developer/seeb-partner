import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, get } from '../../utils/api';
import Navbar from '../../component/Navbar';

const IDCardScreen = ({ navigation }) => {
  const viewRef = useRef();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const json = await AsyncStorage.getItem('partner');
        const { id } = JSON.parse(json);
        const res = await get(`/profile/${id}`);
        console.log('Profile Response:', res);
        if (res.data.status === 200 && res.data.data) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.log('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, []);


  const handleDownload = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      await Share.share({
        title: 'My SEEB ID Card',
        url: uri,
        message: 'Here is my SEEB Partner ID Card',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to capture card.');
    }
  };

  const imageUrl = user?.id
    ? `${API_URL}partner/photo/${user.id}?t=${Date.now()}`
    : 'https://backend.seeb.in/public/uploads/team_documents/1744444325_20f3864a62b02fd1ba72.jpg';

  return (
    <View style={{ flex: 1, backgroundColor: '#cce6ff' }}>
      <Navbar title="ID Card" onBack={() => navigation.goBack()} />
      <View style={styles.screen}>
        <ViewShot ref={viewRef} style={styles.cardWrapper} options={{ format: 'png', quality: 1 }}>
          <View style={styles.card}>
            {/* Company Logo */}
            <Image
              source={{ uri: 'https://seeb.in/logo_name.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.company}>Seeb Design Pvt Ltd</Text>

            {/* User Profile */}
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
            {/* <Image source={require('../../assets/id.jpeg')} style={styles.avatar} /> */}
            <Text style={styles.name}>{user?.name}</Text>
            {/* <Text style={styles.position}>C.E.O</Text> */}


            <View style={styles.row}>
              <Text style={styles.label}>User ID:</Text>
              <Text style={styles.value}>#{user?.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mobile:</Text>
              {/* <Text style={styles.value}>9665113736</Text> */}
              <Text style={styles.value}>{user?.mobile}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Profession:</Text>
              <Text style={styles.value}>{user?.profession}</Text>
            </View>

            {/* QR Code */}
            <View style={styles.qrBox}>
              <QRCode value={'demo.seeb.in'} size={80} />
            </View>
            <View style={styles.addressBlock}>
              <Text style={styles.addressHeader}>Office Address</Text>
              <Text style={styles.addressTitle}>SEEB Design Private Limited</Text>
              <Text style={styles.addressText}>
                Address: S. No. 29/13b, Wadachiwadi Road, Jakat Naka, Undri, Pune- 411060
              </Text>
            </View>
          </View>
        </ViewShot>

        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
          <Text style={styles.downloadText}>📥 Download / Share</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#cce6ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#121212', // Dark card
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border
  },
  logo: {
    width: 170,
    height: 80,
    // marginBottom: 5,
  },
  company: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700', // Gold color
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  position: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    fontWeight: '800'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: '600',
    color: '#bbb',
  },
  value: {
    color: '#fff',
  },
  qrBox: {
    marginTop: 20,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
  },
  downloadBtn: {
    marginTop: 20,
    backgroundColor: '#004080',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressBlock: {
    marginTop: 18,
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    width: '100%',
    marginBottom:8,
  },
  addressHeader: {
    fontWeight: '700',
    color: '#004080',
    fontSize: 16,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  addressTitle: {
    fontWeight: 'bold',
    color: '#003366',
    fontSize: 15,
    marginBottom: 2,
  },
  addressText: {
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default IDCardScreen;
