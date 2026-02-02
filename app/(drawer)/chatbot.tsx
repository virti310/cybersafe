import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function Chatbot() {
    const router = useRouter();
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! I am your CyberSafe AI assistant. How can I help you today?', sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Mock bot response
        setTimeout(() => {
            const botMsg = { id: (Date.now() + 1).toString(), text: "I'm a simulated AI. I can't process that request for real yet, but stay safe!", sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.botText]}>{item.text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatContent}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={10}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <MaterialIcons name="send" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    chatContent: {
        padding: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#6C5CE7',
        borderBottomRightRadius: 0,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 0,
        borderWidth: 1,
        borderColor: '#E1E8ED',
    },
    messageText: {
        fontSize: 16,
    },
    userText: {
        color: '#FFF',
    },
    botText: {
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E1E8ED',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F3F5',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#6C5CE7',
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
