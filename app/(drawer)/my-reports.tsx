import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyReports() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    const fetchReports = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');

            if (!userDataStr) {
                setReports([]);
                setIsGuest(true);
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const userData = JSON.parse(userDataStr);
            if (!userData || !userData.id) {
                setReports([]);
                setIsGuest(true);
                setLoading(false);
                setRefreshing(false);
                return;
            }

            setIsGuest(false);
            const response = await fetch(`${API_URL}/reports?user_id=${userData.id}`);
            const data = await response.json();
            if (response.ok) {
                setReports(data);
            } else {
                console.error('Failed to fetch reports:', data);
                // Optionally handle error state
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchReports();
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return Colors.light.success;
            case 'in progress': return Colors.light.primary;
            case 'rejected': return Colors.light.error;
            default: return '#D97706'; // Pending (Orange)
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return '#DCFCE7';
            case 'in progress': return '#DBEAFE';
            case 'rejected': return '#FEE2E2';
            default: return '#FEF3C7'; // Pending
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/report-details/${item.id}` as any)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="security" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.cardTitle}>{item.incident_type || 'Incident Report'}</Text>
                    <Text style={styles.date}>{item.incident_date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status || 'Pending'}
                    </Text>
                </View>
            </View>

            <Text style={styles.details} numberOfLines={2}>
                {item.incident_details}
            </Text>

            {item.is_financial_fraud && (
                <View style={styles.fraudTag}>
                    <MaterialIcons name="attach-money" size={16} color="#FFF" />
                    <Text style={styles.fraudTagText}>Financial Fraud</Text>
                </View>
            )}

            <View style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Status</Text>
                <MaterialIcons name="arrow-forward" size={16} color={Colors.light.primary} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Reports</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.light.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            {isGuest ? (
                                <>
                                    <MaterialIcons name="lock-outline" size={64} color={Colors.light.icon} />
                                    <Text style={styles.emptyText}>Login Required</Text>
                                    <Text style={styles.emptySubText}>Please login to view your reported incidents.</Text>
                                    <TouchableOpacity
                                        style={styles.loginButton}
                                        onPress={() => router.push('/(auth)/login')}
                                    >
                                        <Text style={styles.loginButtonText}>Login</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <MaterialIcons name="assignment-late" size={64} color={Colors.light.icon} />
                                    <Text style={styles.emptyText}>No reports found.</Text>
                                    <Text style={styles.emptySubText}>Any incidents you report will appear here.</Text>
                                </>
                            )}
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        marginRight: 15,
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    date: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    details: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 20,
        marginBottom: 12,
    },
    fraudTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.error,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 12,
    },
    fraudTagText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    detailsButtonText: {
        color: Colors.light.primary,
        fontWeight: '600',
        fontSize: 14,
        marginRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.light.icon,
        marginTop: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 2,
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
