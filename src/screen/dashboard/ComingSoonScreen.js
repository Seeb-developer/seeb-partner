import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ComingSoonScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/coming-soon.png')} // Add your own image here
                style={styles.image}
                resizeMode="contain"
            />
            {/* <Text style={styles.heading}>Coming Soon</Text>
            <Text style={styles.subtext}>
                We’re working hard on this feature. Stay tuned!
            </Text> */}

            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 320,
        height: 320,
        marginBottom: 30,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#ff9900',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
