import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardAssignedTask from '../../component/DashboardAssignedTask'
import { getUnreadCount } from '../../utils/NotificationHelper';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationContext } from '../../context/NotificationContext';

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {

  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
const { unreadCount } = useContext(NotificationContext);


  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const json = await AsyncStorage.getItem('partner');
        const { name } = JSON.parse(json);
        setName(name);
      } catch (err) {
        console.log('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, []);

  const [dashboardData, setDashboardData] = useState({
    earnings: 12000,
    totalProjects: 15,
    completedProjects: 10,
    inProgressProjects: 5,
  });

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
    labelColor: () => '#333',
    propsForBackgroundLines: {
      stroke: '#e0e0e0',
    },
  };

  const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [2000, 2500, 1800, 3000, 2200, 2700, 3200],
        color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const sampleTask = {
    booking_id: 1234,
    service_name: 'False Ceiling Installation',
    slot_date: '2025-06-29',
    slot_time: '10:00 AM',
    status: 'assigned',
    amount: 5500,
    description: 'Install gypsum ceiling in living room, 12x15 ft.',
    customer: {
      name: 'Rahul Mehta',
      mobile: '9876543210',
      address: '12/3, MG Road, Pune, Maharashtra',
    },
  };
  ;

  const [assignedTask, setAssignedTask] = useState(sampleTask); // only 1 task now
  const [acceptedTasks, setAcceptedTasks] = useState([]);

  const handleAccept = () => {
    setAcceptedTasks((prev) => [...prev, assignedTask]);
    setAssignedTask(null); // remove from assigned
  };
  const handleReject = () => {
    setAssignedTask(null);
  };
  

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={38} color="#fff" />
        </TouchableOpacity>

        <Image source={require('../../assets/logo-main.png')} style={{ width: 168, height: 58 }} resizeMode="contain" />

        <View style={styles.notificationWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      </View>

      <ScrollView style={styles.container}>

        {/* Welcome */}
        <Text style={styles.welcome}>Welcome, {name || 'Partner'} 👋</Text>

        {assignedTask && (
          <DashboardAssignedTask
            task={assignedTask}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}

        {acceptedTasks.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>Accepted Orders</Text>
            {acceptedTasks.map((task) => (
              <TouchableOpacity
                key={task.booking_id}
                onPress={() =>
                  navigation.navigate('AcceptedTaskDetailsScreen', { task })
                }
                style={styles.acceptedCardWrapper}
              >
                <View style={styles.acceptedCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{task.service_name}</Text>
                    <Text style={styles.bookingInfo}>
                      📅 {task.slot_date}   🕒 {task.slot_time}
                    </Text>
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.amount}>₹{task.amount}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Accepted</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Earnings Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Earnings</Text>
          <Text style={styles.cardValue}>₹{dashboardData.earnings}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatBox label="Total Projects" value={dashboardData.totalProjects} />
          <StatBox label="Completed" value={dashboardData.completedProjects} />
          <StatBox label="In Progress" value={dashboardData.inProgressProjects} />
        </View>

        {/* Chart */}
        <Text style={styles.sectionTitle}>Monthly Earnings</Text>
        <BarChart
          data={earningsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
        />
      </ScrollView>
    </View>
  );
};

const StatBox = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // marginBottom: 20,
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  notificationWrapper: {
    position: 'absolute',
    right: 16,
    top: 14,
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  welcome: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },

  acceptedCardWrapper: {
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  acceptedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },

  bookingInfo: {
    fontSize: 13,
    color: '#666',
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },

  statusBadge: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00796B',
  },

  card: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003366',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
});

export default Home;
