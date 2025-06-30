import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Navbar from '../../component/Navbar';

const weekOptions = [
    { label: 'Week 3', range: '20 May – 27 May', value: '2_weeks_ago' },
    { label: 'Last Week', range: '28 May – 4 Jun', value: 'last_week' },
    { label: 'This Week', range: '5 Jun – 12 Jun', value: 'this_week' },
];

const sampleData = {
    this_week: {
        data: [
            { id: 1, date: 'Mon, Jun 5', service: 'False Ceiling', amount: 1200, status: 'Accepted' },
            { id: 2, date: 'Tue, Jun 6', service: 'Plumbing Repair', amount: 800, status: 'Completed' },
            { id: 3, date: 'Thu, Jun 8', service: 'Curtain Setup', amount: 1500, status: 'Rejected' },
        ],
        accepted: 1,
        rejected: 1,
        completed: 1,
    },
    last_week: {
        data: [
            { id: 4, date: 'Mon, May 29', service: 'Modular Kitchen', amount: 3000, status: 'Completed' },
            { id: 5, date: 'Wed, May 31', service: 'Electric Work', amount: 1800, status: 'Accepted' },
        ],
        accepted: 1,
        rejected: 0,
        completed: 1,
    },
    '2_weeks_ago': {
        data: [
            { id: 6, date: 'Tue, May 21', service: 'Fabrication', amount: 2200, status: 'Completed' },
        ],
        accepted: 0,
        rejected: 0,
        completed: 1,
    },
};

const EarningsScreen = ({ navigation }) => {
    const [selectedWeek, setSelectedWeek] = useState('this_week');
    const week = sampleData[selectedWeek];
    const earnings = week.data;
    const totalAmount = earnings.reduce((sum, e) => sum + e.amount, 0);

    return (
        <View style={{flex:1}}>
            <Navbar title="Earnings" onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                {/* Week Selector */}
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.weekSelector}
                    >
                        {weekOptions.map((weekItem) => {
                            const isActive = selectedWeek === weekItem.value;
                            return (
                                <TouchableOpacity
                                    key={weekItem.value}
                                    style={[styles.weekButton, isActive && styles.weekButtonActive]}
                                    onPress={() => setSelectedWeek(weekItem.value)}
                                >
                                    <Text style={[styles.weekRange, isActive && styles.weekRangeActive]}>
                                        {weekItem.range}
                                    </Text>
                                    <Text style={[styles.weekLabel, isActive && styles.weekLabelActive]}>
                                        {weekItem.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                </View>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Total Earnings</Text>
                    <Text style={styles.summaryAmount}>₹ {totalAmount}</Text>
                    <View style={styles.metaStatsContainer}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Accepted</Text>
                            <Text style={styles.metaValue}>{week.accepted}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Rejected</Text>
                            <Text style={styles.metaValue}>{week.rejected}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Completed</Text>
                            <Text style={styles.metaValue}>{week.completed}</Text>
                        </View>
                    </View>

                </View>

                {/* Earnings List */}
                <FlatList
                    data={earnings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.earningItem}>
                            <View>
                                <Text style={styles.service}>{item.service}</Text>
                                <Text style={styles.date}>
                                    {item.date}{' '}
                                    <Text style={[styles.status, getStatusStyle(item.status)]}>
                                        ({item.status})
                                    </Text>
                                </Text>
                            </View>
                            <Text style={styles.amount}>₹{item.amount}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
                            No earnings for this week.
                        </Text>
                    }
                />
            </View>
        </View>
    );
};

// Status Color Helper
const getStatusStyle = (status) => {
    switch (status) {
        case 'Accepted':
            return { color: '#2196F3' };
        case 'Completed':
            return { color: '#4CAF50' };
        case 'Rejected':
            return { color: '#F44336' };
        default:
            return { color: '#777' };
    }
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    weekSelector: { marginBottom: 16, height: 60 },
    weekButton: {
        height: 60, // fixed height
        width: 120,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // ensure inner spacing doesn’t leak
    },
    weekButtonActive: {
        backgroundColor: '#FFC107',
    },
    weekRange: {
        fontSize: 12,
        color: '#777',
        textAlign: 'center',
        lineHeight: 16,
    },
    weekLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 18,
    },
    weekRangeActive: {
        color: '#222',
    },
    weekLabelActive: {
        color: '#000',
        fontWeight: '700',
    },
    summaryCard: {
        backgroundColor: '#FFF9C4',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 14,
        color: '#000',
        marginBottom: 6,
    },
    summaryAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    metaStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        // paddingHorizontal: 10,
    },

    metaItem: {
        alignItems: 'center',
    },

    metaLabel: {
        fontSize: 13,
        color: '#666',
    },
    metaValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    earningItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fafafa',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
    },
    service: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    date: {
        fontSize: 13,
        color: '#888',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
    },
    status: {
        fontSize: 13,
        fontWeight: '500',
    },
});

export default EarningsScreen;
