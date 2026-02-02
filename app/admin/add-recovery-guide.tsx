import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

interface Category {
    id: number;
    name: string;
}

export default function AddRecoveryGuide() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [description, setDescription] = useState(''); // Note: description is not in recovery_guides schema, only 'guide' column. Suggest using 'guide' field for content.
    // Schema: id, guide (text), category_id, created_at.
    // The UI has "Title", "Category", "Description", "Recovery Steps".
    // It seems 'guide' column might be storing JSON or text. 
    // Given the previous code had 'title', 'description', 'steps'.
    // Let's assume 'guide' stores the full content/steps. The title might be part of it or redundant if we don't have a title column.
    // Wait, schema check: recovery_guides (id, guide, category_id, created_at).
    // It does NOT have a 'title' column. 
    // We should probably JSON stringify the { title, description, steps } into the 'guide' column if we want to preserve all this structure
    // OR just mapped 'guide' to the content/steps. 
    // Let's assume for now we pack it into 'guide' field as JSON object? Or just text.
    // If I look at the mock data in previous files... "title: Social Media Hack Recovery".
    // If I can't change schema, I might have to change how I use it.
    // Let's assume 'guide' is the MAIN CONTENT. 
    // I will concat Title + \n\n + Description + \n\n + Steps into 'guide' column for now to be safe, or just use one field.
    // actually, let's treat 'guide' as the Title/Name of the guide, and maybe there's no body?
    // Wait, "Recovering from ..." sounds like a title.
    // Let's re-read schema. `guide | text`.
    // I'll assume `guide` holds the ENTIRE TEXT content.
    // But the UI has distinct fields.
    // I will try to save it as JSON string if possible, or just concat.
    // Let's concat efficiently: Title: [Title]\nDescription: [Desc]\nSteps: [Steps]

    // Actually, looking at previous conversation summaries, there was a detailed plan.
    // Let's just use 'guide' as the TITLE for the list view, and maybe put the rest in... wait where?
    // If there is no column for content, this is a problem.
    // Schema: `guide` (text).
    // Maybe `guide` is the instructions?
    // Let's check `add-recovery-guide.tsx` original code.
    // It had title, category, description, steps.
    // If I only have one column `guide`... this is a schema limitation.
    // I will modify the backend to accept `guide` as the main content string.
    // I'll combine Title + Description + Steps into one text blob for `guide`.
    // And when editing, I might not be able to separate them easily unless I use a delimiter.
    // I will simplify the UI to just have "Content" (mapped to guide) and Category.
    // OR I will assume `guide` is the title and I need to add a column.
    // But I can't add columns easily.
    // I'll stick to: `guide` = Title. And we have no place for detailed steps?
    // That seems wrong. `guide` type is TEXT, so it can hold long text.
    // I will rename the input "Guide Content" and put everything there.

    // Revised Plan for UI:
    // 1. Category (Select)
    // 2. Guide Content (Text Area) - this will map to `guide` column.

    const [content, setContent] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchGuideDetails();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchGuideDetails = async () => {
        try {
            setInitialLoading(true);
            const data = await api.get(`/recovery-guides/${id}`);
            setTitle(data.title || '');
            setContent(data.content || data.guide || ''); // Fallback to guide if content is empty (though migration should fix this)
            setCategoryId(data.category_id);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch guide details');
            router.back();
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content || !categoryId) {
            Alert.alert('Error', 'Please fill in content and select a category');
            return;
        }

        setLoading(true);
        try {
            const payload = { title, content, category_id: categoryId };
            if (isEditing) {
                await api.put(`/recovery-guides/${id}`, payload);
                Alert.alert('Success', 'Guide updated successfully');
            } else {
                await api.post('/recovery-guides', payload);
                Alert.alert('Success', 'Guide added successfully');
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save guide');
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
                <Text style={styles.pageTitle}>{isEditing ? 'Edit Guide' : 'Add Recovery Guide'}</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter guide title..."
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryChip, categoryId === cat.id && styles.activeCategoryChip]}
                                onPress={() => setCategoryId(cat.id)}
                            >
                                <Text style={[styles.categoryChipText, categoryId === cat.id && styles.activeCategoryChipText]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Content</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Detailed recovery steps..."
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Guide'}</Text>
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
        height: 200,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F7F9FC',
        borderWidth: 1,
        borderColor: '#E1E8ED',
    },
    activeCategoryChip: {
        backgroundColor: '#6C5CE7',
        borderColor: '#6C5CE7',
    },
    categoryChipText: {
        color: '#636e72',
        fontWeight: '500',
    },
    activeCategoryChipText: {
        color: '#FFF',
        fontWeight: 'bold',
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
