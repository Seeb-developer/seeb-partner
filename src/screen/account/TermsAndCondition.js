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

const TermsAndConditions = ({ navigation }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar title="Terms & Conditions" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Terms & Conditions</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            These Terms and Conditions govern your use of the Seeb Partner app. By accessing or using the app, you agree to comply with these terms.
          </Text>

          <Text style={styles.sectionTitle}>2. Eligibility</Text>
          <Text style={styles.text}>
            You must be at least 18 years old and legally eligible to work in your service area to register as a partner.
          </Text>

          <Text style={styles.sectionTitle}>3. Account Responsibility</Text>
          <Text style={styles.text}>
            You are responsible for maintaining the confidentiality of your account and for all activities conducted under your account.
          </Text>

          <Text style={styles.sectionTitle}>4. Service Commitment</Text>
          <Text style={styles.text}>
            Partners are expected to complete assigned tasks professionally, adhere to timelines, and maintain quality standards set by Seeb.
          </Text>

          <Text style={styles.sectionTitle}>5. Payments</Text>
          <Text style={styles.text}>
            Payments will be processed as per the agreed terms. Seeb reserves the right to withhold payments for incomplete or unsatisfactory work.
          </Text>

          <Text style={styles.sectionTitle}>6. Termination</Text>
          <Text style={styles.text}>
            Seeb may suspend or terminate your account if you violate any of these terms or engage in misconduct.
          </Text>

          <Text style={styles.sectionTitle}>7. Modifications</Text>
          <Text style={styles.text}>
            We reserve the right to update these Terms and Conditions at any time. Continued use of the app after changes constitutes your acceptance.
          </Text>

          <Text style={styles.sectionTitle}>8. Contact</Text>
          <Text style={styles.text}>
            For any questions or concerns regarding these terms, contact us at support@seeb.in
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

export default TermsAndConditions;
