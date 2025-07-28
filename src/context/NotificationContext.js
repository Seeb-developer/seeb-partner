import React, { createContext, useEffect, useState } from 'react';
import { get, post, del } from '../utils/api'; // your API utility
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [partnerId, setPartnerId] = useState(null);

  const getPartnerId = async () => {
    try {
      const partnerJson = await AsyncStorage.getItem('partner');
      const partner = partnerJson ? JSON.parse(partnerJson) : null;

      if (partner && partner.id) {
        setPartnerId(partner.id);
        return partner.id;
      } else {
        console.warn('❌ Partner not found in storage');
        return null;
      }
    } catch (error) {
      console.error('🔥 Error getting partner ID:', error);
      return null;
    }
  };


  // 🔄 Load from backend only
  const loadNotifications = async () => {
    try {
      const partnerId = await getPartnerId();

      const res = await post('notifications/user', { user_id: partnerId, user_type: 'partner' });
      const data = res.data || [];
      setNotifications(data.data || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('❌ Failed to load notifications:', err);
    }
  };

  // ✅ Just mark as read via API
  const markAllAsRead = async () => {
    try {
      await post('notifications/mark-all-read', { user_id: partnerId, user_type: 'partner' });
      await notifee.setBadgeCount(0); // Reset badge count
      setUnreadCount(0);
      loadNotifications();
    } catch (err) {
      console.error('❌ Failed to mark all as read:', err);
    }
  };

  const removeNotification = async (id) => {
    try {
      await del(`notifications/delete/${id}`);
      loadNotifications();
    } catch (err) {
      console.error('❌ Failed to remove notification:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await post('notifications/clear-all', { user_id: partnerId, user_type: 'partner' });
      await notifee.setBadgeCount(0);
      setNotifications([]);
      setUnreadCount(0);
      loadNotifications();
    } catch (err) {
      console.error('❌ Failed to clear notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        refreshNotifications: loadNotifications,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
