import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import CameraModal from '../modal/CameraModal';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';

const UploadItem = ({ label, value, onPick, info, fieldKey }) => {
    const aspectMap = {
        aadhar_front: { width: 800, height: 480 },
        aadhar_back: { width: 800, height: 480 },
        pan_card: { width: 800, height: 480 },
        address_proof: { width: 800, height: 1000 },
        photo: { width: 800, height: 800, circular: true },
    };

    const [cameraVisible, setCameraVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleCamera = async () => {
        setModalVisible(false);
        setTimeout(async () => {
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
        }, 400);
    };

    const handleGallery = async () => {
        setModalVisible(false);
        setTimeout(async () => {
            try {
                const config = aspectMap[fieldKey] || { width: 800, height: 600 };
                const image = await ImageCropPicker.openPicker({
                    width: config.width,
                    height: config.height,
                    cropping: true,
                    cropperCircleOverlay: config.circular || false,
                    compressImageQuality: 0.8,
                });
                onPick({ assets: [{ uri: image.path }] });
            } catch (err) {
                console.log('Gallery cancel or error:', err);
            }
        }, 400);
    };

    return (
        <>
            <TouchableOpacity style={styles.uploadCard} onPress={() => setModalVisible(true)}>
                <View style={styles.uploadLeft}>
                    <Text style={styles.uploadLabel}>{label}</Text>
                    {!!info && <Text style={styles.uploadHint}>{info}</Text>}
                </View>
                <View style={styles.uploadRight}>
                    {value ? (
                        <Image source={{ uri: value }} resizeMethod='contain' style={styles.previewThumb} />
                    ) : (
                        <View style={styles.previewPlaceholder}>
                            <Icon name="upload" size={20} color="#FF9800" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {/* Modal Upload Options */}
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View style={styles.bottomSheet}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Upload Document</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionRow}>
                        <TouchableOpacity style={styles.optionBox} onPress={() => {
                            setModalVisible(false)
                            handleCamera()
                        }}>
                            <Icon name="camera" size={24} color="#2F6DFB" />
                            <Text style={styles.optionLabel}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBox} onPress={handleGallery}>
                            <Icon name="image" size={24} color="#2F6DFB" />
                            <Text style={styles.optionLabel}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* Optional Advanced Camera Modal */}
            <CameraModal
                visible={cameraVisible}
                circular={fieldKey === 'photo'}
                onClose={() => setCameraVisible(false)}
                aspect={aspectMap[fieldKey]}
                onCapture={(uri) => {
                    onPick({ assets: [{ uri }] });
                    setCameraVisible(false);
                }}
            />
        </>
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
        resizeMode: 'contain',
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
    bottomSheet: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },

    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    sheetTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },

    cancelText: {
        fontSize: 14,
        color: '#F00',
        fontWeight: '500',
    },

    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },

    optionBox: {
        alignItems: 'center',
        padding: 14,
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12,
        width: '45%',
        backgroundColor: '#F9F9F9',
    },

    optionLabel: {
        marginTop: 6,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },

});

export default UploadItem;
