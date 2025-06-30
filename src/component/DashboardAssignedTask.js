import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DashboardAssignedTask = ({ task, onAccept, onReject }) => {
  if (!task) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>New Task Assigned</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Service:</Text>
        <Text style={styles.value}>{task.service_name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{task.slot_date}</Text>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{task.slot_time}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={[styles.value, { color: '#388E3C', fontWeight: 'bold' }]}>
          ₹{task.amount}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffbea',
    padding: 12,
    borderRadius: 10,
    // marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginRight: 4,
  },
  value: {
    fontSize: 14,
    color: '#000',
    marginRight: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  rejectButton: {
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#43a047',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default DashboardAssignedTask;
