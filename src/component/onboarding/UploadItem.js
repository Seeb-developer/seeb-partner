import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import CameraModal from '../modal/CameraModal';
const UploadItem = ({ label, value, onPick, info, fieldKey }) => {
    const aspectMap = {
        aadhar_front: { width: 800, height: 480 },
        aadhar_back: { width: 800, height: 480 },
        pan_card: { width: 800, height: 480 },
        address_proof: { width: 800, height: 1000 },
        photo: { width: 800, height: 800, circular: true }, // 1:1 crop
    };
    const [cameraVisible, setCameraVisible] = useState(false);
    const navigation = useNavigation();

    const handleSelect = () => {
        Alert.alert('Upload Document', '', [
            {
                text: 'Camera',
<<<<<<< HEAD
                onPress: async() => {
                    try {
                        const config = aspectMap[fieldKey] || { width: 800, height: 600 };
                        const image = await ImageCropPicker.openCamera({
                            width: config.width,
                            height: config.height,
                            cropping: true,
                            cropperCircleOverlay: config.circular || false,
                            compressImageQuality: 0.8,
                            useFrontCamera: fieldKey === 'photo',
                        });
                        onPick({ assets: [{ uri: image.path }] });
                    } catch (err) {
                        console.log('Camera cancel or error:', err);
                    }
=======
                onPress: () => {
                    setCameraVisible(true);
                    // const aspect = aspectMap[fieldKey];
>>>>>>> refs/remotes/origin/main
                },
            },
            {
                text: 'Gallery (Crop)',
                onPress: async () => {
                    try {
                        const config = aspectMap[fieldKey] || { width: 800, height: 600 };
                        const image = await ImageCropPicker.openPicker({
                            ...config,
                            cropping: true,
                            cropperCircleOverlay: config.circular || false,
                            compressImageQuality: 0.8,
                        });
                        onPick({ assets: [{ uri: image.path }] });
                    } catch (err) {
                        console.log('Gallery cancel or error:', err);
                    }
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    return (
        <TouchableOpacity style={styles.uploadCard} onPress={handleSelect}>
            <View style={styles.uploadLeft}>
                <Text style={styles.uploadLabel}>{label}</Text>
                {!!info && <Text style={styles.uploadHint}>{info}</Text>}
            </View>
            <View style={styles.uploadRight}>
                {value ? (
                    <Image source={{ uri: value }} resizeMethod='contain' style={styles.previewThumb} />
                ) : (
                    <View style={styles.previewPlaceholder}>
                        <Text style={styles.plusIcon}>+</Text>
                    </View>
                )}

            </View>
            <CameraModal
                visible={cameraVisible}
                circular={fieldKey === 'photo'}
                onClose={() => setCameraVisible(false)}
                aspect={aspectMap[fieldKey]}
                onCapture={(uri) => {
                    onPick({ assets: [{ uri }] });  // ✅ trigger upload handler
                    setCameraVisible(false);
                }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    uploadCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uploadLeft: {
        flex: 1,
        paddingRight: 10,
    },
    uploadLabel: {
        fontWeight: '600',
        fontSize: 15,
        color: '#222',
        marginBottom: 4,
    },
    uploadHint: {
        fontSize: 12,
        color: '#999',
    },
    uploadRight: {
        width: 120,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
    },
    previewThumb: {
        width: '100%',
        height: '100%',
        resizeMode: 'conatain',
    },
    previewPlaceholder: {
        backgroundColor: '#f1f1f1',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 8,
    },
    plusIcon: {
        fontSize: 24,
        color: '#888',
        fontWeight: 'bold',
    },
});


export default UploadItem;
