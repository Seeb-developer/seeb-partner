import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import NavigationStack from './src/navigation'
import { Camera } from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';

const App = () => {

    useEffect(() => {
        Camera.requestCameraPermission();
    }, []);
    return (
        <>
            <NavigationStack />
            <Toast config={{
                success: (props) => (
                    <View style={{ backgroundColor: '#D1FAE5', padding: 14, borderRadius: 8 }}>
                        <Text style={{ color: '#065F46', fontWeight: 'bold' }}>{props.text1}</Text>
                    </View>
                ),
                error: (props) => (
                    <View style={{ backgroundColor: '#FEE2E2', padding: 14, borderRadius: 8 }}>
                        <Text style={{ color: '#991B1B', fontWeight: 'bold' }}>{props.text1}</Text>
                    </View>
                )
            }} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})

export default App