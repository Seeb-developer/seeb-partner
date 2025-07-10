import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Vibration } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navbar from '../../component/Navbar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NotificationContext } from '../../context/NotificationContext';
import { useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
// import Ionicons from 'react-native-vector-icons/Ionicons';

dayjs.extend(relativeTime);

const NotificationsScreen = ({ navigation }) => {
  const { notifications, markAllAsRead, removeNotification, clearAllNotifications } = useContext(NotificationContext);


  useFocusEffect(
    React.useCallback(() => {
      markAllAsRead(); // ✅ correct usage
      // optional: return cleanup if needed
    }, [])
  );

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications?',
      'This action cannot be undo.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          onPress: clearAllNotifications,
          style: 'destructive',
        },
      ]
    );
  };


  return (
    <View style={{ flex: 1 }}>
      <Navbar title="Notifications" onBack={() => navigation.goBack()} rightIcon={
        notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Ionicons name="trash-bin-outline" size={26} color="#B00020" />
          </TouchableOpacity>
        )
      } />
      <View style={styles.container}>
        {/* <ScrollView > */}
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <SwipeListView
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={item.icon || 'notifications-outline'}
                    size={24}
                    color="#003366"
                    style={styles.icon}
                  />
                </View>
                <View style={styles.content}>
                  <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.message}>{item.message}</Text>
                  <Text style={styles.time}>{dayjs(item.time).fromNow()}</Text>
                </View>
              </View>
            )}
            renderHiddenItem={({ item }) => (
              <View style={styles.rowBack}>
                <Ionicons name="trash-outline" size={22} color="#fff" style={styles.trashIcon} />
                {/* <Text style={styles.deleteLabel}>Delete</Text> */}
              </View>

            )}
            rightOpenValue={-75}
            disableRightSwipe={true}
            onRowOpen={(rowKey, rowMap) => {
              Vibration.vibrate(50);
              setTimeout(() => {
                rowMap[rowKey]?.closeRow();
                removeNotification(Number(rowKey));
              }, 200); // slight delay
            }}
          />

        )}
        {/* </ScrollView> */}
      </View>
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
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  clearAllText: {
    marginLeft: 6,
    color: '#B00020',
    fontWeight: '600',
    fontSize: 13,
  },

  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    // marginRight: 12,
    // marginTop: 4,
  },
  iconWrapper: {
    backgroundColor: '#E5F0FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    color: '#AAA',
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
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#B00020',
    borderRadius: 18,
    paddingRight: 20,
    marginBottom: 13,
  },
  trashIcon: {
    marginRight: 2,
  },
  deleteLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },


});
