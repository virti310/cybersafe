import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

export default function CommunityReports() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReports = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/reports/feed`);
            const data = await response.json();
            if (response.ok) {
                setReports(data);
            } else {
                console.error('Failed to fetch community reports:', data);
            }
        } catch (error) {
            console.error('Error fetching community reports:', error);
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

    const renderItem = ({ item }: { item: any }) => (
        <View
            style={styles.card}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="security" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.cardTitle}>{item.incident_type || 'Incident Report'}</Text>
                    <Text style={styles.date}>{item.incident_date}</Text>
                </View>
            </View>

            <Text style={styles.details} numberOfLines={3}>
                {item.incident_details}
            </Text>

            <View style={styles.anonymousTag}>
                <Feather name="eye-off" size={14} color={Colors.light.icon} />
                <Text style={styles.anonymousText}>Anonymous Report</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Community Reports</Text>
                    <Text style={styles.headerSubtitle}>Recent alerts from your community</Text>
                </View>
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
                            <MaterialIcons name="security" size={64} color={Colors.light.icon} />
                            <Text style={styles.emptyText}>No reports yet</Text>
                            <Text style={styles.emptySubText}>Community incidents will appear here.</Text>
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
        paddingVertical: 16,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 10,
    },
    backButton: {
        marginRight: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.background,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.light.icon,
        marginTop: 2,
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
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    headerTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: Colors.light.icon,
        fontWeight: '500',
    },
    details: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 16,
    },
    anonymousTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    anonymousText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 6,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.7,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 15,
        color: Colors.light.icon,
        marginTop: 8,
        textAlign: 'center',
    },
});
