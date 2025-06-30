import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Navbar = ({ title, onBack }) => (
  <View style={styles.navbar}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="chevron-left" size={24} color="#000" />
    </TouchableOpacity>
    <Text style={styles.navTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  navbar: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // centers content in row
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Navbar;
