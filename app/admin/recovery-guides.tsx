import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

interface RecoveryGuide {
    id: number;
    title: string;
    content: string;
    guide?: string; // deprecated
    category_id: number;
    category_name?: string;
    created_at: string;
}

export default function RecoveryGuidesManagement() {
    const router = useRouter();
    const [guides, setGuides] = useState<RecoveryGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchGuides = async () => {
        try {
            setLoading(true);
            const data = await api.get('/recovery-guides');
            setGuides(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch recovery guides');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchGuides();
        }, [])
    );

    const handleDelete = (id: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this guide?')) {
                deleteItem(id);
            }
        } else {
            Alert.alert(
                'Confirm Delete',
                'Are you sure you want to delete this guide?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteItem(id)
                    }
                ]
            );
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await api.delete(`/recovery-guides/${id}`);
            setGuides(prev => prev.filter(g => g.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete guide');
        }
    };

    const filteredGuides = guides.filter(guide =>
        (guide.title && guide.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (guide.category_name && guide.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Recovery Guides</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/admin/add-recovery-guide')}>
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Guide</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tableCard}>
                <View style={styles.filterRow}>
                    <TextInput
                        placeholder="Search guides..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.th, { flex: 3 }]}>Guide Title</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>Category</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Actions</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ marginVertical: 20 }} />
                ) : (
                    filteredGuides.map((guide) => (
                        <View key={guide.id} style={styles.tableRow}>
                            <Text style={[styles.td, { flex: 0.5 }]}>#{guide.id}</Text>
                            <Text numberOfLines={1} style={[styles.td, { flex: 3 }]}>{guide.title}</Text>
                            <Text style={[styles.td, { flex: 1.5 }]}>{guide.category_name || 'N/A'}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity onPress={() => router.push({ pathname: '/admin/add-recovery-guide', params: { id: guide.id } })}>
                                    <MaterialIcons name="edit" size={20} color="#6C5CE7" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(guide.id)}>
                                    <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                {!loading && filteredGuides.length === 0 && (
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>No guides found.</Text>
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
});
