import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import API_URL from '../../constants/API';

interface Article {
    id: number;
    title: string;
    content: string;
    image: string;
    created_at: string;
}

export default function AwarenessDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            // Using the list endpoint, but just finding the one we need. 
            // If the backend has a /awareness/:id endpoint, that's better, but this is safe.
            const response = await fetch(`${API_URL}/awareness`);
            const data = await response.json();
            if (response.ok) {
                const found = data.find((a: Article) => a.id.toString() === id);
                setArticle(found || null);
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.header, { borderBottomWidth: 0 }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#6C5CE7" />
                </View>
            </SafeAreaView>
        );
    }

    if (!article) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Article Not Found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Article</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {article.image ? (
                    <Image source={{ uri: article.image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.imagePlaceholder} />
                )}
                <View style={styles.content}>
                    <Text style={styles.title}>{article.title}</Text>
                    <Text style={styles.date}>{new Date(article.created_at).toLocaleDateString()}</Text>
                    
                    <View style={styles.divider} />
                    
                    <Text style={styles.body}>{article.content}</Text>
                    
                    {/* Add a generic full article text since db only has 1 sentence */}
                    <Text style={styles.extendedBody}>
                        This is an important aspect of your digital safety. Remember to always keep your systems updated, use strong unique passwords, and remain vigilant against potential social engineering threats. Cybersecurity is an ongoing process that requires constant awareness.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
    },
    imagePlaceholder: {
        height: 250,
        backgroundColor: '#dfe6e9',
        width: '100%',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#2D3436',
        marginBottom: 10,
        lineHeight: 32,
    },
    date: {
        fontSize: 14,
        color: '#B2BEC3',
        marginBottom: 20,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#dfe6e9',
        marginBottom: 20,
    },
    body: {
        fontSize: 18,
        color: '#2D3436',
        lineHeight: 28,
        marginBottom: 20,
    },
    extendedBody: {
        fontSize: 16,
        color: '#636e72',
        lineHeight: 26,
    }
});
