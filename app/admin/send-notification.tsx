import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

export default function SendNotification() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEditing = !!params.id;

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isBroadcast, setIsBroadcast] = useState(true); // Default to ALL
    const [userId, setUserId] = useState(''); // Only used if not broadcast
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setTitle(params.editTitle as string);
            setBody(params.editBody as string);

            // If we had stored type/user_id in params, we could set them too. 
            // For now, simplistically assuming edits might just be fixing typos in title/body
            // But if userId param is present (from our list logic helper), set it.
            if (params.userId) {
                // setUserId(params.userId as string);
                // setIsBroadcast(false);
            }
        }
    }, [params]);

    const handleSend = async () => {
        if (!title || !body) {
            Alert.alert('Error', 'Please enter title and message');
            return;
        }
        if (!isBroadcast && !userId && !isEditing) { // If editing, maybe we don't change targets
            Alert.alert('Error', 'Please enter a User ID for single notification');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/notifications/${params.id}`, {
                    title,
                    body
                });
                Alert.alert('Success', 'Notification updated successfully');
            } else {
                await api.post('/notifications', {
                    title,
                    body,
                    type: isBroadcast ? 'ALL' : 'SINGLE',
                    user_id: isBroadcast ? null : parseInt(userId)
                });
                Alert.alert('Success', 'Notification sent successfully');
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#2D3436" />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>{isEditing ? 'Edit Notification' : 'Send Notification'}</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Notification Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Security Update"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Message Body</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Type your message here..."
                        value={body}
                        onChangeText={setBody}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {!isEditing && (
                    <>
                        <View style={styles.row}>
                            <Text style={styles.label}>Send to All Users</Text>
                            <Switch
                                value={isBroadcast}
                                onValueChange={setIsBroadcast}
                                trackColor={{ false: "#767577", true: "#6C5CE7" }}
                            />
                        </View>

                        {!isBroadcast && (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Target User ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter User ID"
                                    value={userId}
                                    onChangeText={setUserId}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}
                    </>
                )}

                <TouchableOpacity
                    style={[styles.sendButton, loading && styles.disabledButton]}
                    onPress={handleSend}
                    disabled={loading}
                >
                    <MaterialIcons name="send" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.sendButtonText}>{loading ? 'Processing...' : (isEditing ? 'Update Notification' : 'Send Notification')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    formGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#F7F9FC',
        padding: 12,
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3436',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F7F9FC',
        borderWidth: 1,
        borderColor: '#E1E8ED',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#2D3436',
    },
    textArea: {
        height: 120,
    },
    sendButton: {
        backgroundColor: '#6C5CE7',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    sendButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
