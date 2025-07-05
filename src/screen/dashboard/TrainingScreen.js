import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navbar from '../../component/Navbar';

const mockTrainingData = [
    {
        id: '1',
        title: 'Introduction to SEEB Partner App',
        duration: '5 min',
        status: 'Pending',
    },
    {
        id: '2',
        title: 'How to Accept & Manage Bookings',
        duration: '8 min',
        status: 'Pending',
    },
    {
        id: '3',
        title: 'Customer Communication Tips',
        duration: '7 min',
        status: 'Pending',
    },
];

const TrainingScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('ComingSoon')}>
            <View style={styles.cardContent}>
                <Ionicons
                    name={item.status === 'Completed' ? 'checkmark-circle-outline' : 'play-circle-outline'}
                    size={24}
                    color={item.status === 'Completed' ? '#4CAF50' : '#FF9800'}
                    style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.meta}>{item.duration} • {item.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Navbar title="Training Video" onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <Text style={styles.header}>Training Modules</Text>
                <FlatList
                    data={mockTrainingData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        elevation: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    meta: {
        fontSize: 13,
        color: '#777',
        marginTop: 4,
    },
});

export default TrainingScreen;
