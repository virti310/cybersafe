import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

export default function AddEmergencyContact() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [team, setTeam] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    const [availability, setAvailability] = useState('24/7');

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchContactDetails();
        }
    }, [id]);

    const fetchContactDetails = async () => {
        try {
            setInitialLoading(true);
            const data = await api.get(`/emergency-contacts/${id}`);
            setTeam(data.team);
            setPhone(data.phone);
            setEmail(data.email);
            setLocation(data.location);
            setPriority(data.priority);
            setDescription(data.description);
            setAvailability(data.availability);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch contact details');
            router.back();
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        console.log('handleSave called');
        console.log('Form Data:', { team, phone, email, location, priority, description, availability });

        if (!team || !phone || !email || !location) {
            console.log('Validation failed: Missing required fields');
            Alert.alert('Error', 'Please fill in required fields (Name, Phone, Email, Location)');
            return;
        }

        setLoading(true);
        try {
            const payload = { team, phone, email, location, priority, description, availability };
            console.log('Sending payload:', payload);

            let response;
            if (isEditing) {
                console.log(`Updating contact ${id}...`);
                response = await api.put(`/emergency-contacts/${id}`, payload);
            } else {
                console.log('Creating new contact...');
                response = await api.post('/emergency-contacts', payload);
            }
            console.log('Save response:', response);

            Alert.alert('Success', `Contact ${isEditing ? 'updated' : 'added'} successfully`);
            router.back();
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Error', 'Failed to save contact');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#6C5CE7" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#2D3436" />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>{isEditing ? 'Edit Contact' : 'Add Emergency Contact'}</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Team / Organization Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Cyber Crime Helpline"
                        value={team}
                        onChangeText={setTeam}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 1930"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., help@cybercrime.gov"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., New Delhi"
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Availability</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 24/7"
                            value={availability}
                            onChangeText={setAvailability}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Priority</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        {['Low', 'Medium', 'High'].map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.chip, priority === p && styles.activeChip]}
                                onPress={() => setPriority(p)}
                            >
                                <Text style={[styles.chipText, priority === p && styles.activeChipText]}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description of services..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Contact'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3436',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F7F9FC',
        borderWidth: 1,
        borderColor: '#E1E8ED',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#2D3436',
    },
    textArea: {
        height: 100,
    },
    saveButton: {
        backgroundColor: '#6C5CE7',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chip: {
        paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee',
    },
    activeChip: {
        backgroundColor: '#6C5CE7',
    },
    chipText: { color: '#333' },
    activeChipText: { color: '#fff', fontWeight: 'bold' }
});
