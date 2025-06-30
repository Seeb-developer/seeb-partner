import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  Modal, SafeAreaView, Image, Alert
} from 'react-native';
<<<<<<< HEAD
// import { Camera, useCameraDevice } from 'react-native-vision-camera';
=======
import { Camera, useCameraDevice } from 'react-native-vision-camera';
>>>>>>> refs/remotes/origin/main
import ImageCropPicker from 'react-native-image-crop-picker';
// import TextRecognition from 'react-native-text-recognition';
import TextRecognition from '@react-native-ml-kit/text-recognition';

const { width } = Dimensions.get('window');

const CameraModal = ({ visible, onClose, onCapture, circular = false }) => {
  const camera = useRef(null);
<<<<<<< HEAD
  // const device = useCameraDevice(circular ? 'front' : 'back'); 
=======
  const device = useCameraDevice(circular ? 'front' : 'back');
>>>>>>> refs/remotes/origin/main
  const [permission, setPermission] = useState();
  const [previewUri, setPreviewUri] = useState(null);
  const [ocrText, setOcrText] = useState([]);

<<<<<<< HEAD
  // useEffect(() => {
  //   (async () => {
  //     const status = await Camera.requestCameraPermission();
  //     setPermission(status);
  //   })();
  // }, []);
=======
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
    })();
  }, []);
>>>>>>> refs/remotes/origin/main

  const handleTakePhoto = async () => {
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({ flash: 'off' });
    const path = 'file://' + photo.path;

    try {
      const cropped = await ImageCropPicker.openCropper({
        path,
        width: 800,
        height: circular ? 800 : 600,
        cropping: true,
        cropperCircleOverlay: circular,
        compressImageQuality: 0.8,
      });

      setPreviewUri(cropped.path);

      // Run OCR
      const text = await TextRecognition.recognize(cropped.path);
      console.log('OCR Result:', text);
      setOcrText(text);
    } catch (err) {
      console.warn('Cropping or OCR failed', err);
    }
  };

  const handleConfirm = () => {
    if (previewUri) {
      onCapture(previewUri, ocrText); // send uri and OCR text
      setPreviewUri(null);
      setOcrText([]);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={styles.modalWrap}>
        {!previewUri ? (
          <>
            {device ? (
              <>
                <Camera
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive
                  photo
                />
                <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto}>
                  <Text style={styles.btnText}>Capture</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.permissionText}>Camera not available</Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.previewWrap}>
            <Image source={{ uri: previewUri }} resizeMode='contain' style={styles.previewImage} />
            <TouchableOpacity style={styles.captureBtn} onPress={handleConfirm}>
              <Text style={styles.btnText}>Use Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPreviewUri(null)} style={styles.closeBtn}>
              <Text style={{ color: '#fff' }}>Retake</Text>
            </TouchableOpacity>
            {/* Optional: Show recognized text */}
            {ocrText.length > 0 && (
              <View style={styles.textPreview}>
                <Text style={styles.ocrTitle}>Recognized Text:</Text>
                {ocrText.map((line, index) => (
                  <Text key={index} style={styles.ocrText}>{line}</Text>
                ))}
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrap: { flex: 1, backgroundColor: '#000' },
  captureBtn: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: '#00000088',
    borderRadius: 8,
  },
  btnText: { fontSize: 16, fontWeight: 'bold' },
  permissionText: { color: '#fff', marginTop: 100, textAlign: 'center' },
  previewWrap: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: width * 0.9,
    height: width * 1.2,
    borderRadius: 12,
    marginBottom: 20,
  },
  textPreview: {
    marginTop: 10,
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 10,
    maxWidth: width * 0.9,
  },
  ocrTitle: {
    color: '#00ff88',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  ocrText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default CameraModal;
