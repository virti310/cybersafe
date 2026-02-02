
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

export default function AddEditFAQ() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEdit = !!id;

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchFAQ();
        }
    }, [id]);

    const fetchFAQ = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/faqs/${id}`);
            setQuestion(data.question);
            setAnswer(data.answer);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch FAQ details');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!question || !answer) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/faqs/${id}`, { question, answer });
                Alert.alert('Success', 'FAQ updated successfully');
            } else {
                await api.post('/faqs', { question, answer });
                Alert.alert('Success', 'FAQ added successfully');
            }
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save FAQ');
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
                <Text style={styles.pageTitle}>{isEdit ? 'Edit FAQ' : 'Add New FAQ'}</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Question</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., How do I report?"
                        value={question}
                        onChangeText={setQuestion}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Answer</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter answer here..."
                        value={answer}
                        onChangeText={setAnswer}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save FAQ'}</Text>
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
        height: 150,
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
