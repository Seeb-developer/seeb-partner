import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraDevices } from 'react-native-vision-camera';
import { captureRef } from 'react-native-view-shot';

const { width } = Dimensions.get('window');

const CameraCaptureScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { fieldKey, aspect, circular } = route.params;

    const camera = useRef(null);
    const device = useCameraDevice('back')

    const handleCapture = async () => {
        const photo = await camera.current.takePhoto({
            flash: 'off',
        });

        navigation.navigate('OnboardingForm', {
            fieldKey,
            uri: 'file://' + photo.path,
        });
    };



    const [permission, setPermission] = useState();

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setPermission(status);
        })();
    }, []);

    // if (permission !== 'authorized') {
    //     return (
    //         <View style={styles.container}>
    //             <Text style={{ color: '#fff', textAlign: 'center' }}>Camera permission required</Text>
    //         </View>
    //     );
    // }

    const [isCameraReady, setCameraReady] = useState(false);

    useEffect(() => {
        if (device) setCameraReady(true);
    }, [device]);

    if (!isCameraReady) return <View style={styles.container} />;
    
    if (!device) return null;

    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />
            <View style={styles.overlay}>
                <View style={[styles.frame, circular ? styles.circle : styles.rect]} />
            </View>
            <TouchableOpacity onPress={handleCapture} style={styles.captureBtn}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Capture</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frame: {
        borderColor: '#00ff88',
        borderWidth: 3,
    },
    rect: {
        width: width * 0.8,
        height: width * 0.5,
    },
    circle: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
    },
    captureBtn: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 30,
        alignSelf: 'center',
    },
});

export default CameraCaptureScreen;
