import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

interface EmergencyContact {
    id: number;
    team: string; // The "Name" or "Team"
    priority: string;
    description: string;
    availability: string;
    phone: string;
    email: string;
    location: string;
}

export default function EmergencyContactsManagement() {
    const router = useRouter();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await api.get('/emergency-contacts');
            setContacts(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchContacts();
        }, [])
    );

    const handleDelete = (id: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this contact?')) {
                deleteItem(id);
            }
        } else {
            Alert.alert(
                'Confirm Delete',
                'Are you sure you want to delete this contact?',
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
            await api.delete(`/emergency-contacts/${id}`);
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete contact');
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Emergency Contacts</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/admin/add-emergency-contact')}>
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Contact</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tableCard}>
                <View style={styles.filterRow}>
                    <TextInput
                        placeholder="Search contacts..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Team/Name</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>Phone</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>Location</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Actions</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6C5CE7" style={{ marginVertical: 20 }} />
                ) : (
                    filteredContacts.map((contact) => (
                        <View key={contact.id} style={styles.tableRow}>
                            <Text style={[styles.td, { flex: 0.5 }]}>#{contact.id}</Text>
                            <Text style={[styles.td, { flex: 2 }]}>{contact.team}</Text>
                            <Text style={[styles.td, { flex: 1.5 }]}>{contact.phone}</Text>
                            <Text style={[styles.td, { flex: 1.5 }]}>{contact.location}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity onPress={() => router.push({ pathname: '/admin/add-emergency-contact', params: { id: contact.id } })}>
                                    <MaterialIcons name="edit" size={20} color="#6C5CE7" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(contact.id)}>
                                    <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                {!loading && filteredContacts.length === 0 && (
                    <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>No contacts found.</Text>
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
