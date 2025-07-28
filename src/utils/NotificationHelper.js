// src/utils/NotificationHelper.js

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
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

export function setupNotificationListeners(navigation) {
  // 1. Foreground message
  messaging().onMessage(async message => {
    console.log('📥 Foreground message:', message);

    const { screen, id, title, body } = message.data || {};

    // Get current route name
    const currentRoute = navigation.getCurrentRoute?.()?.name;

    // If on TicketChat screen and same ticketId, skip notification
    if (screen === 'TicketChat' && currentRoute === 'TicketChat') {
      console.log('🟡 Already on TicketChat — skipping notification');
      return;
    }
    if (screen === 'booking_assignment') {
      console.log('🟡 Already on Home — skipping notification');
      return;
    }

    // Otherwise show notification
    await displayNotification(message);
  });

  // 2. When user taps a notification while app is in background
  messaging().onNotificationOpenedApp(message => {
    console.log('📲 Opened from background:', message?.data);
    const { screen, id } = message.data || {};
    if (screen === 'TicketChat' && id) {
      navigation.navigate('TicketChat', { ticketId: id });
    }
  });

  // 3. When app launches from quit state due to tap
  messaging()
    .getInitialNotification()
    .then(message => {
      if (message) {
        console.log('🛑 Opened from quit:', message?.data);
        const { screen, id } = message.data || {};
        if (screen === 'TicketChat' && id) {
          navigation.navigate('TicketChat', { ticketId: id });
        }
      }
    });

  // 4. Notifee tap while app in foreground
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const { screen, id } = detail.notification?.data || {};
      console.log('👆 Notifee foreground press:', detail.notification?.data);
      if (screen === 'TicketChat' && id) {
        navigation.navigate('TicketChat', { ticketId: id });
      }
    }
  });
}

/** 🛠 Background message handler (in index.js) */
export const backgroundMessageHandler = async remoteMessage => {
  console.log('📤 Background message:', remoteMessage);

  const { title, body, screen } = remoteMessage.data || remoteMessage.notification || {};

  // 👇 Only show sticky booking notification if screen === 'booking'
  if (screen === 'booking_assignment') {
    await displayStickyBookingNotification(remoteMessage.data);
  } else {
    await displayNotification(remoteMessage);
  }


  const existing = await AsyncStorage.getItem('notifications');
  const parsed = existing ? JSON.parse(existing) : [];
  
};


export async function displayNotification(remoteMessage) {
  try {
    const { title, body, image, screen, id } =
      remoteMessage.data || remoteMessage.notification || {};

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
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture: image || 'https://example.com/default-image.png', // Fallback image
        },
      },
      ios: {
        sound: 'default',
      },
      data: remoteMessage.data || {}, // important for onForegroundEvent
    });
  } catch (err) {
    console.error('❌ displayNotification error:', err);
  }
}


export async function displayStickyBookingNotification(data) {
  const channelId = await notifee.createChannel({
    id: 'seeb-booking',
    name: 'Booking Alerts',
    importance: AndroidImportance.HIGH,
    sound: 'notificationsound', // must match filename (without extension)
  });

  await notifee.displayNotification({
    title: '🚨 New Booking Request!',
    body: data.body || 'Accept the job before it expires.',
    android: {
      channelId,
      sound: 'notificationsound',
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
      ongoing: true,
      autoCancel: false,
    },
    ios: {
      // sound: 'notificationsound.mp3',
      foregroundPresentationOptions: ['badge', 'sound'],

    },
    data,
  });
}

export async function clearNotifications() {
  try {
    await notifee.cancelAllNotifications();
    console.log('✅ All notifications cleared');
  } catch (err) {
    console.error('❌ Error clearing notifications:', err);
  }
}
