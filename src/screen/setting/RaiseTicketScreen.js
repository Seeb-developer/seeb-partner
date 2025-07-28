import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Navbar from '../../component/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_URL, post } from '../../utils/api';
import { getFirestore, collection, doc, addDoc, onSnapshot, query, orderBy, writeBatch, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const RaiseTicketScreen = ({ navigation, route }) => {
  const { task_id = null, booking_id = null } = route?.params || {};
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories] = useState([
    { label: 'App Issue', value: 'app' },
    { label: 'Payment', value: 'payment' },
    { label: 'Service Delay', value: 'delay' },
    { label: 'Service Not Assigned', value: 'unassigned' },
    { label: 'Customer Unavailable', value: 'customer_unavailable' },
    { label: 'Material Requirement', value: 'material' },
    { label: 'Address/Location Issue', value: 'location' },
    { label: 'Document Verification', value: 'verification' },
    { label: 'Task Cancellation', value: 'cancellation' },
    { label: 'Other', value: 'other' },
  ]);


  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setPriority(getDefaultPriority(category, task_id));
  }, [category, task_id]);



  const handleImagePick = async () => {
    const img = await ImagePicker.openPicker({ cropping: true });
    setImage(img);
  };

  const getDefaultPriority = (category, taskId) => {
    if (taskId) return 'high'; // Always high if task exists

    // Set priority based on category
    switch (category) {
      case 'app':
      case 'other':
        return 'low';
      case 'delay':
      case 'unassigned':
      case 'customer_unavailable':
      case 'cancellation':
        return 'high';
      case 'payment':
      case 'material':
      case 'location':
      case 'verification':
        return 'medium';
      default:
        return 'medium';
    }
  };


    const categoryMap = categories.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
    }, {});

  const handleSubmit = async () => {
    console.log('Category:', category, 'Task ID:', task_id, message);

    if (!category) {
      Toast.show({ type: 'error', text1: 'Please select a category' });
      return;
    }

    if (!subject.trim() && !message.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter subject or message' });
      return;
    }

    setLoading(true)
    

    // Optional: Auto-fill subject if left blank
    const finalSubject = subject.trim() || `Regarding ${categoryMap[category]}`;
    const partnerJson = await AsyncStorage.getItem('partner');
    const partner = partnerJson ? JSON.parse(partnerJson) : null;

    let uploadedFileUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? `file://${image.path}` : image.path,
        name: 'ticket-image.jpg',
        type: image.mime || 'image/jpeg',
      });

      try {
        const res = await fetch(`${API_URL}tickets/upload-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const json = await res.json();
        console.log(json)
        uploadedFileUrl = json?.file_path || null;
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    const payload = {
      user_type: 'partner',
      partner_id: partner?.id,
      subject: finalSubject,
      priority,
      category,
      assigned_admin_id: null,
      message,
      file: uploadedFileUrl,
    };

    if (task_id) payload.task_id = task_id;

    try {
      const res = await post('tickets/create', payload); // adjust API endpoint if needed
      console.log(res.data)
      const newTicketId = res.data?.data?.ticket_uid;
      const ticket_id = res.data?.data?.ticket_id;
      Toast.show({ type: 'success', text1: 'Ticket created successfully' });


      const db = getFirestore();
      await addDoc(collection(db, 'tickets', newTicketId, 'messages'), {
        user_id: auth.currentUser?.uid,
        ticket_id: newTicketId,
        sender_id: partner?.id,
        sender_type: 'partner',
        message,
        image: null, // You can also upload image if needed
        timestamp: serverTimestamp(),
        is_read_by_admin: false,
        is_read_by_user: true,
      });

      // 3. Navigate to TicketChat screen
      navigation.replace('TicketChat', { ticketId: ticket_id });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to create ticket' + err });

      console.error('Error submitting ticket:', err);
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar title="Raise Ticket" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Select Category</Text>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={category}
          items={categories}
          setValue={setCategory}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
        <Text style={styles.label}>Subject</Text>
        <TextInput
          placeholder="Write subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
          placeholderTextColor={"#999"}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          placeholder="Write message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholderTextColor='#999'
        />

        <Text style={styles.label}>Attach Screenshot (optional)</Text>
        {image ? (
          <Image source={{ uri: image.path }} style={styles.preview} />
        ) : (
          <TouchableOpacity onPress={handleImagePick} style={styles.uploadBtn}>
            <Ionicons name="image-outline" size={22} color="#FF9800" />
            <Text style={{ marginLeft: 8, color: '#FF9800' }}>Choose Image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSubmit} style={[styles.button, loading && { opacity: 0.6 }]} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Ticket'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default RaiseTicketScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 16, marginBottom: 6, fontWeight: '500', color: '#333' },
  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 0,
  },
  dropdownBox: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginTop: 6,
    width: 160,
  },
  preview: {
    height: 150,
    width: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#FF9800',
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
