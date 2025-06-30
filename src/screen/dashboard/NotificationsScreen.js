import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navbar from '../../component/Navbar';

const NotificationsScreen = ({ navigation }) => {
  // Example static notifications (replace with dynamic data later)
  const notifications = [
    {
      id: 1,
      title: 'Profile Verified',
      message: 'Your profile has been successfully verified.',
      time: '2 hours ago',
      icon: 'checkmark-circle-outline',
    },
    {
      id: 2,
      title: 'New Service Assigned',
      message: 'You have been assigned a new Carpentry task.',
      time: '1 day ago',
      icon: 'hammer-outline',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Navbar title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Notifications</Text>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View style={styles.card} key={item.id}>
              <Ionicons name={item.icon} size={24} color="#003366" style={styles.icon} />
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8faff',
    padding: 16,
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
    color: '#111',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
});
