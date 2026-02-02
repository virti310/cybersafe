import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

interface Category {
    id: number;
    name: string;
    // Schema doesn't have description/icon yet, only id/name.
    // We will just handle name for now, or assume backend ignores extras if we post them, but UI shows description/icon.
    // If we want to persist description/icon, we'd need schema changes.
    // For now we will allow creating categories with just Name.
}

export default function CategoriesManagement() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
        }, [])
    );

    const handleDelete = (id: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this category?')) {
                deleteItem(id);
            }
        } else {
            Alert.alert(
                'Confirm Delete',
                'Are you sure you want to delete this category?',
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
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete category');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Categories</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/admin/add-category')}
                >
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Category</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Category Name</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Actions</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ marginVertical: 20 }} />
                ) : (
                    categories.map((cat) => (
                        <View key={cat.id} style={styles.tableRow}>
                            <Text style={[styles.td, { flex: 0.5 }]}>#{cat.id}</Text>
                            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.iconBox}>
                                    <FontAwesome5 name="folder" size={14} color="#6C5CE7" />
                                </View>
                                <Text style={styles.td}>{cat.name}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity onPress={() => router.push({ pathname: '/admin/add-category', params: { id: cat.id } })}>
                                    <MaterialIcons name="edit" size={20} color="#6C5CE7" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(cat.id)}>
                                    <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                {!loading && categories.length === 0 && (
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>No categories found.</Text>
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
    iconBox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#F0F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    }
});
