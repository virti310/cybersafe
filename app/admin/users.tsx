import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
    gender: string;
    is_active: number; // 0 or 1
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                console.error('Failed to fetch users:', data.error);
                Alert.alert('Error', 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert('Error', 'Unable to connect to server');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const toggleStatus = async (id: number, currentStatus: number) => {
        const newStatus = Number(currentStatus) === 1 ? 0 : 1;

        // Optimistic update
        setUsers(users.map(u => u.id === id ? { ...u, is_active: newStatus } : u));

        try {
            const response = await fetch(`${API_URL}/users/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus }),
            });
            const data = await response.json();

            if (!response.ok) {
                // Revert if failed
                setUsers(users.map(u => u.id === id ? { ...u, is_active: currentStatus } : u));
                Alert.alert('Error', data.error || 'Failed to update status');
            }
        } catch (error) {
            // Revert if failed
            setUsers(users.map(u => u.id === id ? { ...u, is_active: currentStatus } : u));
            Alert.alert('Error', 'Network error');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>User Management</Text>
            </View>

            <View style={styles.tableCard}>
                <View style={styles.filterRow}>
                    <TextInput
                        placeholder="Search users..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.filterActions}>
                        <MaterialIcons name="filter-list" size={24} color="#636e72" />
                    </View>
                </View>

                <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Username</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Email</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>Status</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Actions</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ marginVertical: 20 }} />
                ) : (
                    filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <View key={user.id} style={styles.tableRow}>
                                <Text style={[styles.td, { flex: 0.5 }]}>#{user.id}</Text>
                                <Text style={[styles.td, { flex: 2 }]}>{user.username}</Text>
                                <Text style={[styles.td, { flex: 2 }]}>{user.email}</Text>
                                <View style={{ flex: 1.5 }}>
                                    <View style={[styles.statusBadge, { backgroundColor: Number(user.is_active) === 1 ? '#E8F5E9' : '#FFEBEE' }]}>
                                        <Text style={[styles.statusText, { color: Number(user.is_active) === 1 ? '#2E7D32' : '#D32F2F' }]}>
                                            {Number(user.is_active) === 1 ? 'Active' : 'Inactive'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity
                                        style={[styles.toggleButton, { backgroundColor: Number(user.is_active) === 1 ? '#EF4444' : '#10B981' }]}
                                        onPress={() => toggleStatus(user.id, user.is_active)}
                                    >
                                        <Text style={styles.toggleButtonText}>
                                            {Number(user.is_active) === 1 ? 'Deactivate' : 'Activate'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No users found.</Text>
                    )
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
    tableCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#F7F9FC',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: 300,
        fontSize: 14,
        color: '#333',
    },
    filterActions: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
        marginBottom: 12,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
        alignItems: 'center',
    },
    th: {
        fontWeight: '600',
        color: '#636e72',
        fontSize: 14,
    },
    td: {
        color: '#2D3436',
        fontSize: 14,
    },
    noDataText: {
        textAlign: 'center',
        color: '#636e72',
        marginTop: 20,
        fontSize: 16,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 90,
    },
    toggleButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
