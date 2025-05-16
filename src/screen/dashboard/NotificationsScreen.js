import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationsScreen = () => (
    <View style={styles.container}>
        <Text style={styles.text}>Notifications Screen</Text>
    </View>
);

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20 },
});
