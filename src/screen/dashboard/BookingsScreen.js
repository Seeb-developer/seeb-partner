import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Bookings Screen</Text>
  </View>
);

export default BookingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});
