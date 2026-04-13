import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { Colors } from '../../constants/theme';

interface Notification {
    id: number | string;
    title: string;
    body: string;
    type: string;
    created_at: string;
    link?: string;
}

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                setLoading(false);
                return;
            }
            const user = JSON.parse(userData);

            // Load dismissed IDs
            const dismissedData = await AsyncStorage.getItem('dismissedNotifications');
            const dismissedIds = dismissedData ? JSON.parse(dismissedData) : [];

            const data: Notification[] = await api.get(`/notifications?user_id=${user.id}`);

            // Fetch RSS News
            let newsData: Notification[] = [];
            try {
                const rssResponse = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
                const rssJson = await rssResponse.json();
                if (rssJson.status === 'ok' && rssJson.items) {
                    newsData = rssJson.items.map((item: any) => {
                        const cleanBody = item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : 'Cybersecurity news alert.';
                        return {
                            id: `news_${item.guid || item.link}`,
                            title: item.title,
                            body: cleanBody,
                            type: 'NEWS',
                            created_at: item.pubDate,
                            link: item.link
                        };
                    });
                }
            } catch (rssError) {
                console.error("Failed to fetch RSS news", rssError);
            }

            // Combine and filter
            const allNotifications = [...data, ...newsData];
            const activeNotifications = allNotifications.filter((n: Notification) => !dismissedIds.includes(n.id));

            // Sort by Date DESC
            activeNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setNotifications(activeNotifications);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDismiss = async (id: number | string) => {
        try {
            // Update local state
            setNotifications(prev => prev.filter(n => n.id !== id));

            // Save to storage
            const dismissedData = await AsyncStorage.getItem('dismissedNotifications');
            const dismissedIds = dismissedData ? JSON.parse(dismissedData) : [];
            dismissedIds.push(id);
            await AsyncStorage.setItem('dismissedNotifications', JSON.stringify(dismissedIds));
        } catch (error) {
            console.error('Failed to dismiss', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchNotifications();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#2D3436" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.light.primary]} />}
                >
                    {notifications.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconBg}>
                                <Feather name="bell" size={32} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>No Notifications</Text>
                            <Text style={styles.emptyText}>You're all caught up! Check back later for updates.</Text>
                        </View>
                    ) : (
                        notifications.map((notif, index) => (
                            <View key={notif.id} style={[styles.card, { animationDelay: `${index * 100}ms` }]}>
                                <View style={styles.cardContent}>
                                        <View style={[styles.iconContainer,
                                        { backgroundColor: notif.type === 'BROADCAST' ? '#E8F5E9' : notif.type === 'NEWS' ? '#FFF3E0' : '#E3F2FD' }
                                        ]}>
                                            <Feather
                                                name={notif.type === 'BROADCAST' ? 'radio' : notif.type === 'NEWS' ? 'globe' : 'user'}
                                                size={20}
                                                color={notif.type === 'BROADCAST' ? '#2E7D32' : notif.type === 'NEWS' ? '#E65100' : '#1565C0'}
                                            />
                                        </View>
                                    <View style={styles.textContainer}>
                                        <View style={styles.topRow}>
                                            <Text style={styles.cardTitle}>{notif.title}</Text>
                                            <Text style={styles.date}>
                                                {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </Text>
                                        </View>
                                        <Text style={styles.cardBody}>{notif.body}</Text>
                                        <View style={styles.footerRow}>
                                            <TouchableOpacity onPress={() => handleDismiss(notif.id)} style={styles.dismissButton}>
                                                <Text style={styles.dismissText}>Dismiss</Text>
                                            </TouchableOpacity>
                                            {notif.link && (
                                                <TouchableOpacity onPress={() => Linking.openURL(notif.link as string)} style={[styles.dismissButton, { marginLeft: 10, backgroundColor: '#FFF3E0' }]}>
                                                    <Text style={[styles.dismissText, { color: '#E65100' }]}>Read Article</Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{ flex: 1 }} />
                                            <Text style={styles.time}>
                                                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
    titleContainer: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerDescription: {
        fontSize: 16,
        color: '#636e72',
        marginTop: 8,
        lineHeight: 24,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: '#636e72',
        textAlign: 'center',
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3, // Android shadow
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        flex: 1,
        marginRight: 8,
    },
    date: {
        fontSize: 12,
        fontWeight: '600',
        color: '#95a5a6',
    },
    cardBody: {
        fontSize: 14,
        color: '#636e72',
        lineHeight: 21,
        marginBottom: 8,
    },
    time: {
        fontSize: 12,
        color: '#b2bec3',
        alignSelf: 'flex-end',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    dismissButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F1F3F5',
        borderRadius: 12,
    },
    dismissText: {
        fontSize: 12,
        color: '#636e72',
        fontWeight: '600',
    },
});
