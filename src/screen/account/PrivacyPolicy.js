import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Navbar from '../../component/Navbar';

const PrivacyPolicy = ({ navigation }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar title="Privacy Policy" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Privacy Policy</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when using the Seeb Partner app.
          </Text>

          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.text}>
            We collect personal details like name, contact number, Aadhaar, PAN, bank details, and location to verify your identity and provide services.
          </Text>

          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.text}>
            Your data is used for onboarding, task allocation, payment processing, and customer communication. We do not share your information with third parties without consent.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.text}>
            We implement industry-standard security measures to protect your information from unauthorized access, misuse, or disclosure.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You may request to view, update, or delete your personal data by contacting our support team.
          </Text>

          <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this policy periodically. Please review it regularly. Continued use of the app indicates your acceptance of the revised policy.
          </Text>

          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.text}>
            For any questions regarding this policy, please contact support@seeb.in
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#F6F9FF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F6DFB',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});

export default PrivacyPolicy;
