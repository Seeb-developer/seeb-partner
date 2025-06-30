import React from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BookingsScreen = () => {
  const bookings = [
    {
      id: 'BKG-001',
      service_name: 'False Ceiling Installation',
      date: '2025-06-26',
      status: 'In Progress',
      customer: 'Ravi Sharma',
      address: 'Baner, Pune',
    },
    {
      id: 'BKG-002',
      service_name: 'Modular Kitchen Setup',
      date: '2025-06-24',
      status: 'Pending',
      customer: 'Nikita Patil',
      address: 'Hadapsar, Pune',
    },
    {
      id: 'BKG-003',
      service_name: 'AC Servicing',
      date: '2025-06-20',
      status: 'Completed',
      customer: 'Amol Desai',
      address: 'Wakad, Pune',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Assigned Tasks</Text>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No bookings yet</Text>
        </View>
      ) : (
        bookings.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>{item.service_name}</Text>
            <Text style={styles.sub}>🧑‍💼 {item.customer}</Text>
            <Text style={styles.sub}>📍 {item.address}</Text>
            <Text style={styles.sub}>📅 {item.date}</Text>
            <Text style={[styles.status, getStatusStyle(item.status)]}>
              Status: {item.status}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return { color: 'green' };
    case 'In Progress':
      return { color: 'orange' };
    case 'Pending':
      return { color: '#b00020' };
    default:
      return { color: '#555' };
  }
};
=======
import { View, Text, StyleSheet } from 'react-native';

const BookingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Bookings Screen</Text>
  </View>
);
>>>>>>> refs/remotes/origin/main

export default BookingsScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
    color: '#999',
  },
=======
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
>>>>>>> refs/remotes/origin/main
});
