import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Image,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker'; // or use react-native-image-picker
import Navbar from '../../component/Navbar';
import * as Progress from 'react-native-progress';

const AcceptedTaskDetailsScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const [status, setStatus] = useState(task.status || 'in_progress');
  const [checklist, setChecklist] = useState([
    { label: 'Material Collected', checked: false },
    { label: 'Site Visited', checked: false },
    { label: 'Work Started', checked: false },
    { label: 'Work Completed', checked: false },
  ]);
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const toggleChecklistItem = (index) => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    setChecklist(updated);
  };

  const handlePhotoUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleStatusChange = () => {
    setStatus((prev) => (prev === 'in_progress' ? 'completed' : 'in_progress'));
  };

  const openMap = () => {
    const address = task.customer_address || '';
    const query = encodeURIComponent(address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const checklistProgress = checklist.filter(item => item.checked).length / checklist.length;

  return (
    <View style={{ flex: 1 }}>
      <Navbar title={`Booking ID: #${task.booking_id}`} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Name: {task.customer?.name || 'John Doe'}</Text>
          <Text style={styles.text}>Phone: {task.customer?.mobile || '9876543210'}</Text>
          <Text style={[styles.text, { color: '#007AFF' }]} onPress={openMap}>
            Address: {task.customer?.address || 'Bangalore, India'} (View on Map)
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Task Details</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Service: {task.service_name}</Text>
          <Text style={styles.text}>Date: {task.slot_date}</Text>
          <Text style={styles.text}>Time: {task.slot_time}</Text>
          <Text style={styles.text}>Amount: ₹{task.amount}</Text>
          <Text style={styles.text}>Description: {task.description || 'No additional info'}</Text>
          <View style={[styles.statusBadge, status === 'completed' ? styles.completed : styles.inProgress]}>
            <Text style={styles.statusText}>{status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Checklist</Text>
        <Progress.Bar progress={checklistProgress} width={null} color="#4CAF50" style={{ marginBottom: 10 }} height={10} />
        {checklist.map((item, index) => (
          <View key={index} style={styles.checkItem}>
            <Text style={styles.text}>{item.label}</Text>
            <Switch
              value={item.checked}
              onValueChange={() => toggleChecklistItem(index)}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Partner Notes</Text>
        <TextInput
          placeholder="Add any notes or comments here..."
          value={notes}
          onChangeText={setNotes}
          multiline
          style={styles.textArea}
          placeholderTextColor="#222"
        />

        {/* <Text style={styles.sectionTitle}>Upload Photo</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={handlePhotoUpload}>
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity> */}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        <TouchableOpacity style={styles.statusBtn} onPress={handleStatusChange}>
          <Ionicons name="sync-outline" size={20} color="#fff" />
          <Text style={styles.statusBtnText}>Mark as {status === 'in_progress' ? 'Completed' : 'In Progress'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={() => alert('Report Submitted')}>
          <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
          <Text style={styles.submitBtnText}>Submit Final Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  statusBtn: {
    flexDirection: 'row',
    backgroundColor: '#03A9F4',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  uploadBtn: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  statusBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completed: { backgroundColor: '#C8E6C9' },
  inProgress: { backgroundColor: '#FFE082' },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AcceptedTaskDetailsScreen;
