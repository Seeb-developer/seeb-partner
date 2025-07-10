import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import Navbar from '../../component/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';

const mockTicket = {
    id: 103,
    category: 'Service Delay',
    subject: 'Electrician not arrived',
    status: 'open',
    created_at: '2025-07-04T15:45:00',
};

const mockMessages = [
    { id: 1, from: 'user', text: 'Hi, no one has come yet!', time: '2025-07-04T15:50:00' },
    { id: 2, from: 'support', text: 'We’re checking this for you.', time: '2025-07-04T15:51:00' },
    { id: 3, from: 'user', text: 'Please update fast.', time: '2025-07-04T15:53:00' },
];

const TicketChat = ({ navigation }) => {
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState('');
    const [showActions, setShowActions] = useState(false);
    const flatListRef = useRef();

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: Date.now(),
            from: 'user',
            text: input.trim(),
            time: new Date().toISOString(),
        };
        setMessages([...messages, newMessage]);
        setInput('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const sendImageMessage = (uri) => {
        const newMessage = {
            id: Date.now(),
            from: 'user',
            text: '[Image]',
            image: uri,
            time: new Date().toISOString(),
        };
        setMessages([...messages, newMessage]);
        setShowActions(false);
    };

    const openCamera = async () => {
        try {
             await new Promise((resolve) => setTimeout(resolve, 400)); 
            const image = await ImagePicker.openCamera({
                width: 800,
                height: 800,
                cropping: true,
            });
            sendImageMessage(image.path);
        } catch (err) {
            setShowActions(false);
        }
    };

    const openGallery = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 800,
                height: 800,
                cropping: true,
            });
            sendImageMessage(image.path);
        } catch (err) {
            setShowActions(false);
        }
    };

    const openDocument = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            console.log('📄 Selected document:', res);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error('❌ Document pick error:', err);
            }
        }
    };

    const renderMessage = ({ item }) => {
        const isUser = item.from === 'user';
        return (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.supportBubble]}>
                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: 180, height: 180, borderRadius: 8, marginBottom: 6 }}
                        resizeMode='contain'
                    />
                )}
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>
                    {dayjs(item.time).format('DD MMM YYYY, hh:mm A')}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={50}
        >
            <View style={styles.container}>
                <Navbar title={`Ticket #${mockTicket.id}`} onBack={() => navigation.goBack()} />

                <View style={styles.ticketDetails}>
                    <Text style={styles.subject}>{mockTicket.subject}</Text>
                    <Text style={styles.meta}>Category: {mockTicket.category}</Text>
                    <Text style={styles.meta}>Status: {mockTicket.status.toUpperCase()}</Text>
                    <Text style={styles.meta}>
                        Created: {dayjs(mockTicket.created_at).format('D MMM YYYY, hh:mm A')}
                    </Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* <View style={{ position: 'relative' }}>
                    {showActions && (
                        <View style={styles.floatingMenu}>
                            <TouchableOpacity style={styles.menuItem} onPress={openCamera}>
                                <Ionicons name="camera-outline" size={18} color="#FF9800" />
                                <Text style={styles.menuLabel}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={openGallery}>
                                <Ionicons name="image-outline" size={18} color="#FF9800" />
                                <Text style={styles.menuLabel}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={openDocument}>
                                <Ionicons name="document-outline" size={18} color="#FF9800" />
                                <Text style={styles.menuLabel}>Document</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View> */}
                <View style={styles.inputRow}>
                    <TouchableOpacity onPress={() => setShowActions(!showActions)} style={styles.attachmentButton}>
                        <Ionicons name="attach" size={22} color="#555" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                <Modal
                    isVisible={showActions}
                    onBackdropPress={() => setShowActions(!showActions)}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Upload Document</Text>
                            <TouchableOpacity onPress={() => setShowActions(!showActions)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.optionRow}>
                            <TouchableOpacity style={styles.optionBox} onPress={() => {
                                setShowActions(!showActions)
                                openCamera()
                            }}>
                                <Icon name="camera" size={24} color="#2F6DFB" />
                                <Text style={styles.optionLabel}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionBox} onPress={openGallery}>
                                <Icon name="image" size={24} color="#2F6DFB" />
                                <Text style={styles.optionLabel}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    ticketDetails: {
        padding: 16,
        backgroundColor: '#f6f6f6',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    subject: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    meta: { fontSize: 13, color: '#666' },
    messageList: { padding: 16, flexGrow: 1 },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '75%',
    },
    userBubble: {
        backgroundColor: '#e1f5fe',
        alignSelf: 'flex-end',
    },
    supportBubble: {
        backgroundColor: '#f1f1f1',
        alignSelf: 'flex-start',
    },
    messageText: { fontSize: 14, color: '#333' },
    messageTime: {
        fontSize: 11,
        color: '#888',
        marginTop: 4,
        textAlign: 'right',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 44,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        fontSize: 14,
        backgroundColor: '#fafafa',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#FF9800',
        borderRadius: 25,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachmentButton: {
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingMenu: {
        position: 'absolute',
        bottom: 3, // Above the input bar
        left: 10,
        // backgroundColor: '#fff',
        paddingVertical: 8,
        // paddingHorizontal: 10,
        borderRadius: 8,
        zIndex: 999,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: '#fff',
        marginBottom: 3,
        paddingHorizontal: 10,
        borderRadius: 10
    },

    menuLabel: {
        color: '#000',
        fontSize: 14,
        marginLeft: 8,
    },


    bottomSheet: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },

    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    sheetTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },

    cancelText: {
        fontSize: 14,
        color: '#F00',
        fontWeight: '500',
    },

    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },

    optionBox: {
        alignItems: 'center',
        padding: 14,
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12,
        width: '45%',
        backgroundColor: '#F9F9F9',
    },

    optionLabel: {
        marginTop: 6,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
});

export default TicketChat;
