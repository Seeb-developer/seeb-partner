import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import hotUpdate from 'react-native-ota-hot-update';
import ReactNativeBlobUtil from 'react-native-blob-util';

const OtaUpdateScreen = () => {
  const [checking, setChecking] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    hotUpdate.getCurrentVersion().then(setCurrentVersion).catch(console.warn);
  }, []);

  const checkForUpdate = async () => {
    try {
      setChecking(true);

      const res = await fetch('https://backend.seeb.in/ota/update.json');
      const data = await res.json();

      const url =
        Platform.OS === 'android'
          ? data.downloadAndroidUrl
          : data.downloadIosUrl;

      const remoteVersion = data.version;

      console.log('📦 Remote version:', remoteVersion);
      console.log('📦 Current version:', currentVersion);

      if (currentVersion !== null && remoteVersion <= currentVersion) {
        Alert.alert('No Updates', 'You already have the latest version.');
        setChecking(false);
        return;
      }

      await hotUpdate.downloadBundleUri(ReactNativeBlobUtil, url, remoteVersion, {
        updateSuccess: () => {
          Alert.alert('✅ Update Installed', 'App will restart now.');
        },
        updateFail: (msg) => {
          Alert.alert('❌ Update Failed', msg || 'Download failed.');
        },
        restartAfterInstall: true,
      });
    } catch (err) {
      console.warn('OTA check failed', err);
      Alert.alert('Error', 'Failed to check for update.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff' }}>
      <Text style={{ fontSize: 22, marginBottom: 15 }}>🚀 OTA Update Test</Text>
      <Text style={{ marginBottom: 10 }}>Current Version: {currentVersion ?? 'Unknown'}</Text>

      {checking ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="🔄 Check for Update" onPress={checkForUpdate} />
      )}
    </View>
  );
};

export default OtaUpdateScreen;
