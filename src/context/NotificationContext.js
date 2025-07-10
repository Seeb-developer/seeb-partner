// src/context/NotificationContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    const stored = await AsyncStorage.getItem('notifications');
    const parsed = stored ? JSON.parse(stored) : [];
    setNotifications(parsed);
    const unread = parsed.filter(n => !n.read).length;
    setUnreadCount(unread);
  };

  const addNotification = async (newNotif) => {
    const stored = await AsyncStorage.getItem('notifications');
    const parsed = stored ? JSON.parse(stored) : [];
    const updated = [newNotif, ...parsed];
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const removeNotification = async (id) => {
    const updated = notifications.filter(n => n.id !== id);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const clearAllNotifications = async () => {
    await AsyncStorage.removeItem('notifications');
    setNotifications([]);
    setUnreadCount(0);
  };


  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        refreshNotifications: loadNotifications,
        removeNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
