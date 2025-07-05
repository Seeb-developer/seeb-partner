import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => (
  <Modal
    transparent={true}
    animationType="fade"
    visible={visible}
  >
    <View style={styles.modalBackground}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2F6DFB" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 10,
    elevation: 5,
  },
});
export default LoadingModal;