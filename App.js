import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import NavigationStack from './src/navigation';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import hotUpdate from 'react-native-ota-hot-update';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OnboardingProvider } from './src/context/OnboardingContext';

const App = () => {

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [checking, setChecking] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [updateUrl, setUpdateUrl] = useState(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        setChecking(true);
        const version = DeviceInfo.getVersion();
        // setCurrentVersion(version);

        const res = await fetch(`https://backend.seeb.in/ota/update.json?ts=${Date.now()}`);
        const data = await res.json();

        const url =
          Platform.OS === 'android'
            ? data.downloadAndroidUrl
            : data.downloadIosUrl;

        setRemoteVersion(data.version);
        console.log(data.version)
        if (data.version > version) {
          setUpdateUrl(url);
          setShowUpdateModal(true); // show modal or button
        } else {
          setShowUpdateModal(false)
        }
      } catch (err) {
        console.warn('OTA check failed', err);
      } finally {
        setChecking(false);
      }
    };

    checkVersion();
  }, []);

  const installUpdate = async () => {
    try {
      await hotUpdate.downloadBundleUri(ReactNativeBlobUtil, updateUrl, remoteVersion, {
        updateSuccess: () => {
          Alert.alert('✅ Update Installed', 'App will restart now.');
        },
        updateFail: (msg) => {
          Alert.alert('❌ Update Failed', msg || 'Download failed.');
        },
        restartAfterInstall: true,
      });
    } catch (err) {
      console.warn('Update failed:', err);
      Alert.alert('Error', 'Update failed. Please try again.');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <OnboardingProvider>
          <NavigationStack />
        </OnboardingProvider>

        {/* Optional: Bottom Banner */}
        {showUpdateModal && (
          <TouchableOpacity style={styles.bottomBanner} onPress={installUpdate}>
            <Text style={styles.bannerText}>🔄 Update Available – Tap to Install</Text>
          </TouchableOpacity>
        )}

        {/* Optional: Full Modal */}

        <Modal visible={showUpdateModal} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              {/* Close Icon */}
              <TouchableOpacity style={styles.closeIcon} onPress={() => setShowUpdateModal(false)}>
                <Ionicons name="close" size={24} color="red" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>New Update Available</Text>
              <Text style={styles.modalText}>Current: {currentVersion} → New: {remoteVersion}</Text>

              <TouchableOpacity onPress={installUpdate} style={styles.updateBtn}>
                <Text style={styles.updateBtnText}>Install Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    padding: 14,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    position: 'relatirve',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  updateBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
