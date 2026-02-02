import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

interface Notification {
    id: number;
    title: string;
    body: string;
    type: string; // 'SINGLE' or 'BROADCAST' usually, based on how we stored it
    created_at: string;
    username?: string; // joined from users table
}

export default function NotificationsManagement() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const deleteNotification = async (id: number) => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm('Are you sure you want to delete this notification?');
            if (confirm) {
                try {
                    await api.delete(`/notifications/${id}`);
                    setNotifications(prev => prev.filter(n => n.id !== id));
                } catch (error) {
                    window.alert('Failed to delete notification');
                }
            }
        } else {
            Alert.alert(
                'Delete Notification',
                'Are you sure you want to delete this notification?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await api.delete(`/notifications/${id}`);
                                setNotifications(prev => prev.filter(n => n.id !== id));
                            } catch (error) {
                                Alert.alert('Error', 'Failed to delete notification');
                            }
                        }
                    }
                ]
            );
        }
    };



    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.pageTitle}>Notifications History</Text>
                    <Text style={styles.pageSubtitle}>Manage and track sent alerts</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/admin/send-notification')}
                >
                    <MaterialIcons name="send" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Send New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ margin: 20 }} />
                ) : (
                    notifications.map((notif) => (
                        <View key={notif.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{notif.title}</Text>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity onPress={() => deleteNotification(notif.id)} style={styles.iconBtn}>
                                        <MaterialIcons name="delete" size={20} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.date}>{new Date(notif.created_at).toLocaleDateString()}</Text>
                            <Text style={styles.cardBody} numberOfLines={2}>{notif.body}</Text>
                            <View style={styles.metaRow}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{notif.type || 'ALERT'}</Text>
                                </View>
                                {notif.username && (
                                    <Text style={styles.recipient}>To: {notif.username}</Text>
                                )}
                            </View>
                        </View>
                    ))
                )}
                {!loading && notifications.length === 0 && (
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>No notifications sent yet.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#636e72',
        marginTop: 4,
    },
    addButton: {
        backgroundColor: '#6C5CE7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    listContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        padding: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3436',
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: '#b2bec3',
        marginBottom: 8,
    },
    cardBody: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        backgroundColor: '#F0F3FF',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    badgeText: {
        color: '#6C5CE7',
        fontSize: 12,
        fontWeight: 'bold',
    },
    recipient: {
        fontSize: 12,
        color: '#888',
    }
});
