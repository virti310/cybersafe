import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../services/api';

export default function AddAwareness() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null); // For local URI or existing URL
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchArticleDetails();
        }
    }, [id]);

    const fetchArticleDetails = async () => {
        try {
            setInitialLoading(true);
            const data = await api.get(`/awareness/${id}`);
            setTitle(data.title);
            setContent(data.content);
            setImage(data.image || null);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch article details');
            router.back();
        } finally {
            setInitialLoading(false);
        }
    };

    const pickImage = async () => {
        // Request permissions
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title || !content) {
            Alert.alert('Error', 'Please fill in title and content');
            return;
        }

        setLoading(true);
        try {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);

            if (image) {
                // Determine if it's a new file (local URI) or existing URL
                if (image.startsWith('file://') || image.startsWith('content://')) {
                    const filename = image.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename || '');
                    const type = match ? `image/${match[1]}` : `image`;

                    // @ts-ignore
                    formData.append('image', {
                        uri: image,
                        name: filename || 'upload.jpg',
                        type
                    });
                } else {
                    // It's an existing URL, just send it if backend supports retaining it
                    // The backend logic: if req.file exists -> use file. if req.body.image -> use URL.
                    formData.append('image', image);
                }
            }

            // Need to set Content-Type header to multipart/form-data? 
            // Axios/Fetch usually sets this automatically with boundary when body is FormData.
            // But with our api wrapper, we might need to check how it handles it.
            // Assuming api wrapper is standard axios instance.

            // API service now handles FormData automatic content-type removal

            if (isEditing) {
                await api.put(`/awareness/${id}`, formData);
                Alert.alert('Success', 'Article updated successfully');
            } else {
                await api.post('/awareness', formData);
                Alert.alert('Success', 'Article added successfully');
            }
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <View style={[styles.centerContainer]}>
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
                <Text style={styles.pageTitle}>{isEditing ? 'Edit Article' : 'Add Awareness Article'}</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Article Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Phishing Awareness"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Cover Image</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <MaterialIcons name="add-photo-alternate" size={40} color="#B2BEC3" />
                                <Text style={styles.placeholderText}>Tap to select image</Text>
                            </View>
                        )}
                        {image && <View style={styles.overlay}><Text style={styles.changeText}>Change</Text></View>}
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Content</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Write article content..."
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
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Article'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#F7F9FC',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginBottom: 40,
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
    imagePicker: {
        height: 200,
        backgroundColor: '#F7F9FC',
        borderWidth: 1,
        borderColor: '#E1E8ED',
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 8,
        color: '#B2BEC3',
        fontSize: 14,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        alignItems: 'center',
    },
    changeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    }
});
