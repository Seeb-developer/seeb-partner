import React, { useState } from 'react';
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

const RaiseTicketScreen = ({ navigation }) => {
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories] = useState([
    { label: 'App Issue', value: 'app' },
    { label: 'Payment', value: 'payment' },
    { label: 'Service Delay', value: 'delay' },
    { label: 'Other', value: 'other' },
  ]);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  const handleImagePick = async () => {
    const img = await ImagePicker.openPicker({ cropping: true });
    setImage(img);
  };

  const handleSubmit = () => {
    if (!category || !subject || !message) return alert('All fields required');

    // 🔁 API call here
    console.log({ category, subject, message, image });
    navigation.replace('TicketChat', { ticketId: Date.now() }); // fake ticket ID
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
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          placeholder="Write message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
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

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit Ticket</Text>
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
