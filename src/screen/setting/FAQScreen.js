// src/screens/support/FAQScreen.js

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navbar from '../../component/Navbar';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    {
        category: 'Account & Onboarding',
        items: [
            {
                question: 'How do I register on the Seeb Partner App?',
                answer: 'Download the app and complete the onboarding steps including mobile verification, personal info, bank details, documents, and address.',
            },
            {
                question: 'What documents are required for registration?',
                answer: 'Aadhaar (front & back), PAN card, address proof, and a recent photo.',
            },
            {
                question: 'My verification is pending. What should I do?',
                answer: 'Ensure all documents are clear and uploaded correctly. Our team usually verifies within 24–48 hours.',
            },
            {
                question: 'Can I update my profile details later?',
                answer: 'Yes, go to Settings > Account to edit personal, bank, address, or document information.',
            },
        ],
    },
    {
        category: 'Services & Assignments',
        items: [
            {
                question: 'How will I receive new tasks or job requests?',
                answer: 'You\'ll be notified via push notification and can view tasks on the Home screen under "Assigned Tasks".',
            },
            {
                question: 'Can I reject a task if I’m unavailable?',
                answer: 'You may reject a task from the task details screen, but repeated rejections may affect your rating.',
            },
            {
                question: 'What happens if I miss a task deadline?',
                answer: 'Timely completion is crucial. Delays may be reviewed and could impact future assignments.',
            },
        ],
    },
    {
        category: 'Payments & Earnings',
        items: [
            {
                question: 'How do I receive my payments?',
                answer: 'Payments are directly transferred to your registered bank account after task completion and client approval.',
            },
            {
                question: 'Where can I check my earnings?',
                answer: 'Go to the Earnings section in the app to view your income breakdown and history.',
            },
            {
                question: 'My payment is delayed. What should I do?',
                answer: 'Contact support via Raise a Ticket or Call Support under the Help & Support section.',
            },
        ],
    },
    {
        category: 'App Usage',
        items: [
            {
                question: 'How do I raise a support ticket?',
                answer: 'Go to Settings > Help & Support > Raise Ticket, select category, type your issue, and attach optional screenshots.',
            },
            {
                question: 'Can I chat with support?',
                answer: 'Yes, once a ticket is raised, you can chat with the support team under My Tickets > Ticket Details.',
            },
            {
                question: 'I’m not receiving notifications. Why?',
                answer: 'Ensure notification permissions are enabled in your phone settings and app settings.',
            },
            {
                question: 'Is there a dark mode?',
                answer: 'Not currently, but we\'re working on it based on user feedback.',
            },
        ],
    },
    {
        category: 'Ratings & Reviews',
        items: [
            {
                question: 'How is my rating calculated?',
                answer: 'Based on client feedback, task punctuality, and quality of work.',
            },
            {
                question: 'Can I see customer feedback?',
                answer: 'Yes, detailed feedback is shown under each completed task summary.',
            },
        ],
    },
    {
        category: 'Other Common Questions',
        items: [
            {
                question: 'What happens if I change my phone?',
                answer: 'Just reinstall the app and log in with your registered mobile number.',
            },
            {
                question: 'Can I work in multiple cities?',
                answer: 'Yes, just update your working area in the profile settings.',
            },
            {
                question: 'What should I do if the app crashes?',
                answer: 'Update to the latest version and report the issue via a ticket if it continues.',
            },
            {
                question: 'Is my data secure?',
                answer: 'Yes, Seeb follows industry-standard encryption and security practices to protect your data.',
            },
        ],
    },
];

const FAQScreen = ({ navigation }) => {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (catIndex, qIndex) => {
        const key = `${catIndex}-${qIndex}`;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Navbar title="FAQs" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Frequently Asked Questions</Text>

                {FAQS.map((section, catIndex) => (
                    <View key={catIndex} style={styles.section}>
                        <Text style={styles.category}>{section.category}</Text>
                        {section.items.map((faq, qIndex) => {
                            const isOpen = expanded[`${catIndex}-${qIndex}`];
                            return (
                                <View key={faq.id} style={styles.card}>
                                    <TouchableOpacity
                                        style={styles.questionRow}
                                        onPress={() => toggleExpand(catIndex, qIndex)}
                                    >
                                        <Ionicons
                                            name={
                                                isOpen
                                                    ? 'remove-circle-outline'
                                                    : 'add-circle-outline'
                                            }
                                            size={20}
                                            color="#FF9800"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text style={styles.question}>{faq.question}</Text>
                                    </TouchableOpacity>
                                    {isOpen && <Text style={styles.answer}>{faq.answer}</Text>}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    section: {
        marginBottom: 28,
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 12,
    },
    card: {
        marginBottom: 10,
        padding: 14,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    answer: {
        marginTop: 10,
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});

export default FAQScreen;
