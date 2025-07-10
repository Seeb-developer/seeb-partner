// src/utils/NotificationHelper.js

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

/** 🔐 Request permission + get token */
export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('❌ Notification permission denied on Android 13+');
      return;
    } else {
      console.log('✅ Android 13+ notification permission granted');
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Firebase permission granted');
    await registerFCMToken();
  } else {
    console.warn('❌ Firebase permission denied');
  }
}

/** 📲 Get + store FCM token */
export async function registerFCMToken() {
  try {
    let token = await AsyncStorage.getItem('fcmtoken');
    if (!token) {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }
      token = await messaging().getToken();
      if (token) {
        console.log('📱 New FCM Token:', token);
        await AsyncStorage.setItem('fcmtoken', token);
      }
    } else {
      console.log('🔁 Existing FCM Token:', token);
    }
  } catch (err) {
    console.error('❌ Error fetching token:', err);
  }
}

/** 🔔 Show Notifee notification manually */
export async function displayNotification(remoteMessage) {
  // Alert.alert('New Notification')
  try {
    const { title, body } = remoteMessage.notification || remoteMessage.data || {};

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    await notifee.displayNotification({
      title: title || 'Seeb Notification',
      body: body || 'You have a new message!',
      android: {
        channelId,
        sound: 'default',
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher',
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (err) {
    console.error('❌ displayNotification error:', err);
  }
}

/** 📥 Setup notification listeners */
export function setupNotificationListeners(navigation, addNotification) {
  // console.log
  // Foreground message
  messaging().onMessage(async message => {
    console.log('📥 Foreground:', message);

    const isFromFirebaseConsole =
      Platform.OS === 'android' && message.notification ||
      Platform.OS === 'ios' && message.notification;

    if (!isFromFirebaseConsole) {
    }
    await displayNotification(message);

    const { title, body } = message.notification || message.data || {};
    if (addNotification) {
      await addNotification({
        id: Date.now(),
        title,
        message: body,
        time: new Date().toISOString(),
        icon: 'notifications-outline',
        read: false,
      });
    }
  });


  // App opened from background state
  messaging().onNotificationOpenedApp(async message => {
    console.log('📲 From background:', message?.notification);
    await displayNotification(message.notification)
    const { title, body } = message.notification || message.data || {};
    if (addNotification) {
      await addNotification({
        id: Date.now(),
        title,
        message: body,
        time: new Date().toISOString(),
        icon: 'notifications-outline',
        read: false,
      });
    }
  });

  // App opened from quit state
  messaging()
    .getInitialNotification()
    .then(async message => {
      if (message) {
        console.log('🛑 From quit state:', message?.notification);
        const { title, body } = message.notification || message.data || {};
        if (addNotification) {
          await addNotification({
            id: Date.now(),
            title,
            message: body,
            time: new Date().toISOString(),
            icon: 'notifications-outline',
            read: false,
          });
        }
      }
    });

  // Notification press inside app (foreground)
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('👆 Notification pressed:', detail.notification);
      // Optional: navigation logic
    }
  });
}

/** 🛠 Background message handler (in index.js) */
export const backgroundMessageHandler = async remoteMessage => {
  console.log('📤 Background message:', remoteMessage);

  const { title, body } = remoteMessage.data || remoteMessage.notification || {};

  await displayNotification(remoteMessage);

  const existing = await AsyncStorage.getItem('notifications');
  const parsed = existing ? JSON.parse(existing) : [];

  const newNotification = {
    id: Date.now(),
    title: title || 'Seeb Notification',
    message: body || 'You got a new message!',
    time: new Date().toISOString(),
    icon: 'notifications-outline',
    read: false,
  };

  await AsyncStorage.setItem('notifications', JSON.stringify([newNotification, ...parsed]));
};

