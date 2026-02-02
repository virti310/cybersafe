import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { api } from '../../services/api';

export default function AddCategory() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEdit = !!id;

    const [name, setName] = useState('');
    // Schema only has 'name' and 'id'. UI extra fields ignored.
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('folder');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/categories/${id}`);
            setName(data.name);
            // Description/Icon not in DB, so we leave them blank or default
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch category');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/categories/${id}`, { name });
                Alert.alert('Success', 'Category updated successfully');
            } else {
                await api.post('/categories', { name });
                Alert.alert('Success', 'Category added successfully');
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#2D3436" />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>{isEdit ? 'Edit Category' : 'Add Category'}</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Category Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Financial Fraud"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description (UI only)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description of this category..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Icon Name (FontAwesome5 - UI only)</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="e.g., wallet"
                            value={icon}
                            onChangeText={setIcon}
                            autoCapitalize="none"
                        />
                        <View style={styles.iconPreview}>
                            <FontAwesome5 name={icon as any} size={24} color="#6C5CE7" />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Category'}</Text>
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
    iconPreview: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F0F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1E8ED',
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
});
