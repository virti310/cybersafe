
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

export default function FAQsList() {
    const router = useRouter();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const data = await api.get('/faqs');
            setFaqs(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch FAQs');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFaqs();
        }, [])
    );

    const handleDelete = (id: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this FAQ?')) {
                deleteItem(id);
            }
        } else {
            Alert.alert(
                'Confirm Delete',
                'Are you sure you want to delete this FAQ?',
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
            await api.delete(`/faqs/${id}`);
            setFaqs(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete FAQ');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>FAQs</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/admin/add-edit-faq')}
                >
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add FAQ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ margin: 20 }} />
                ) : (
                    faqs.map((faq) => (
                        <View key={faq.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.question}>{faq.question}</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => router.push({ pathname: '/admin/add-edit-faq', params: { id: faq.id } })}
                                    >
                                        <MaterialIcons name="edit" size={20} color="#6C5CE7" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => handleDelete(faq.id)}
                                    >
                                        <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.answer}>{faq.answer}</Text>
                        </View>
                    ))
                )}
                {!loading && faqs.length === 0 && (
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>
                        No FAQs found. Add one to get started.
                    </Text>
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
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    question: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        padding: 8,
        backgroundColor: '#F0F3FF',
        borderRadius: 6,
    },
    answer: {
        color: '#636e72',
        fontSize: 14,
        lineHeight: 20,
    }
});
