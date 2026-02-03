import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

interface Policy {
    id: number;
    title: string;
    content: string;
}

export default function PoliciesList() {
    const router = useRouter();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const data = await api.get('/policies');
            setPolicies(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch policies');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPolicies();
        }, [])
    );

    const handleDelete = (id: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this policy?')) {
                deleteItem(id);
            }
        } else {
            Alert.alert(
                'Confirm Delete',
                'Are you sure you want to delete this policy?',
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
            await api.delete(`/policies/${id}`);
            setPolicies(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete policy');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Legal Documents</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/admin/add-edit-policy')}
                >
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Policy</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ margin: 20 }} />
                ) : (
                    policies.map((policy) => (
                        <View key={policy.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitle}>{policy.title}</Text>
                                    <Text style={styles.wordCount}>{policy.content?.length || 0} characters</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => {
                                            setSelectedPolicy(policy);
                                            setModalVisible(true);
                                        }}
                                    >
                                        <MaterialIcons name="visibility" size={20} color="#636e72" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => router.push({ pathname: '/admin/add-edit-policy', params: { id: policy.id } })}
                                    >
                                        <MaterialIcons name="edit" size={20} color="#6C5CE7" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => handleDelete(policy.id)}
                                    >
                                        <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.excerpt} numberOfLines={2}>{policy.content}</Text>
                        </View>
                    ))
                )}
                {!loading && policies.length === 0 && (
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>
                        No policies found. Add one to get started.
                    </Text>
                )}
            </View>


            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Policy Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#636e72" />
                            </TouchableOpacity>
                        </View>

                        {selectedPolicy && (
                            <ScrollView style={styles.modalBody}>
                                <Text style={styles.policyTitle}>{selectedPolicy.title}</Text>
                                <Text style={styles.policyContent}>{selectedPolicy.content}</Text>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView >
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3436',
    },
    wordCount: {
        fontSize: 12,
        color: '#b2bec3',
        marginTop: 4,
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
    excerpt: {
        color: '#636e72',
        fontSize: 14,
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 600,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    modalBody: {
        flex: 1,
    },
    policyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 12,
    },
    policyContent: {
        fontSize: 14,
        color: '#2D3436',
        lineHeight: 24,
    },
});
