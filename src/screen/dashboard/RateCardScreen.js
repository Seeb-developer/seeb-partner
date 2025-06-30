import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Navbar from '../../component/Navbar';

const rateList = [
    { id: '1', service: 'False Ceiling Installation', rate: 500, unit: 'sqft' },
    { id: '2', service: 'Modular Kitchen Setup', rate: 1200, unit: 'unit' },
    { id: '3', service: 'POP Work', rate: 400, unit: 'sqft' },
    { id: '4', service: 'AC Installation', rate: 850, unit: 'unit' },
    { id: '5', service: 'Tile Fitting', rate: 600, unit: 'sqft' },
];

const RateCardScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Navbar title="Rate Card" onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <Text style={styles.header}>My Rate Card</Text>
                {/* <Text style={{justifyContent:'center', alignItems:'center', color:'#000',fontSize:16, fontWeight:'bold', textAlign:'center'}}>Cooming Soon</Text> */}

                <FlatList
                    data={rateList}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 12 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.service}>{item.service}</Text>
                            <Text style={styles.rate}>₹{item.rate} / {item.unit}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default RateCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        color: '#222',
    },
    card: {
        backgroundColor: '#FFFDE7',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 5,
        borderLeftColor: '#FFC107',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    service: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    rate: {
        fontSize: 14,
        marginTop: 6,
        color: '#777',
    },
});
