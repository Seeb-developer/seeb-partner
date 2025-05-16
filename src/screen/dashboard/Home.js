import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {
    const [dashboardData, setDashboardData] = useState({
        name: 'Haseeb Khan',
        earnings: 12000,
        totalProjects: 15,
        completedProjects: 10,
        inProgressProjects: 5,
    });

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        labelColor: () => '#000',
        propsForBackgroundLines: {
            stroke: '#ccc',
        },
    };

    const earningsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                data: [2000, 2500, 1800, 3000, 2200, 2700, 3200],
                color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Custom color for bars
                strokeWidth: 2, // optional
            },
        ],
    };

    // Fetch data from API if needed in useEffect
    // useEffect(() => { ... }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dashboard</Text>
            </View>
            <Text style={styles.welcome}>Welcome, {dashboardData.name}</Text>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>Earnings</Text>
                <Text style={styles.cardValue}>₹{dashboardData.earnings}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Projects</Text>
                    <Text style={styles.statValue}>{dashboardData.totalProjects}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Completed Projects</Text>
                    <Text style={styles.statValue}>{dashboardData.completedProjects}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>In Progress Projects</Text>
                    <Text style={styles.statValue}>{dashboardData.inProgressProjects}</Text>
                </View>
            </View>
            {/* 
            <TouchableOpacity
                style={styles.profileCard}
                onPress={() => navigation.navigate('Profile')}
            >
                <Text style={styles.profileTitle}>View Profile</Text>
                <Text style={styles.profileHint}>See full details</Text>
            </TouchableOpacity> */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10 }}>
                Monthly Earnings
            </Text>

            <BarChart
                data={earningsData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={{ borderRadius: 12 }}
                fromZero
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    welcome: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFC107',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    cardLabel: {
        fontSize: 16,
        color: '#000',
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    statLabel: {
        color: '#444',
        fontSize: 14,
        marginBottom: 6,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    profileCard: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 10,
        marginTop: 30,
    },
    profileTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileHint: {
        color: '#FFC107',
        fontSize: 14,
        marginTop: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
      },
      headerTitle: { fontSize: 22, fontWeight: 'bold' },
      content: { fontSize: 16 },
});


export default Home;
