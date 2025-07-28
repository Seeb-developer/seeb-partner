import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker'; // or use react-native-image-picker
import Navbar from '../../component/Navbar';
import * as Progress from 'react-native-progress';
import { get } from '../../utils/api';
const AcceptedTaskDetailsScreen = ({ route, navigation }) => {
  const { assignmentId } = route.params; // 👈 expect to receive assignmentId
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [status, setStatus] = useState('in_progress');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    fetchAssignmentDetails();
  }, []);

  const fetchAssignmentDetails = async () => {
    try {
      const response = await get(`assignment/details/${assignmentId}`);
      const data = response.data;
      if (data.status === 200) {
        // console.log('Assignment Details:', data.data.assignment);
        setAssignment(data.data.assignment);
        setStatus(data.data.assignment.status || 'in_progress');

        // If checklist items are present in future
        const checklistItems = data?.data.checklist?.items?.length
          ? data?.data?.checklist?.items
          : [
            { label: 'Material Collected', checked: false },
            { label: 'Site Visited', checked: false },
            { label: 'Work Started', checked: false },
            { label: 'Work Completed', checked: false },
          ];
        setChecklist(checklistItems);
      }
    } catch (error) {
      console.error('Failed to fetch details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = (index) => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    setChecklist(updated);
  };

  const handlePhotoUpload = async () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets && res.assets.length > 0) {
        setImageUri(res.assets[0].uri);
      }
    });
  };

  const handleStatusChange = () => {
    setStatus((prev) => (prev === 'in_progress' ? 'completed' : 'in_progress'));
  };

  const openMap = () => {
    const query = encodeURIComponent(
      `${assignment.address_line1 || ''}, ${assignment.address_line2 || ''}`
    );
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const checklistProgress =
    checklist.filter((item) => item.checked).length / checklist.length;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Assignment not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar title={`Booking ID: #${assignment.booking_number}`} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Name: {assignment.customer_name}</Text>
          <Text style={styles.text}>Phone: {assignment.customer_mobile}</Text>
          <Text style={[styles.text, { color: '#007AFF' }]} onPress={openMap}>
            Address: {assignment.address_line1}, {assignment.address_line2} (View on Map)
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Task Details</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Service: {assignment.service_name}</Text>
          <Text style={styles.text}>Date: {assignment.booking_slot_date}</Text>
          <Text style={styles.text}>Amount: ₹{assignment.assigned_amount}</Text>
          <Text style={styles.text}>Helpers: {assignment.helper_count}</Text>
          <View
            style={[
              styles.statusBadge,
              status === 'completed' ? styles.completed : styles.inProgress,
            ]}
          >
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
    // marginTop: 20,
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
