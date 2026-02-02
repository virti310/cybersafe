import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import API_URL from '../../constants/API';

interface Article {
    id: number;
    title: string;
    content: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export default function Awareness() {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch(`${API_URL}/awareness`);
            const data = await response.json();
            if (response.ok) {
                setArticles(data);
            } else {
                console.error('Failed to fetch awareness articles');
            }
        } catch (error) {
            console.error('Error fetching awareness articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Article }) => (
        <TouchableOpacity style={styles.card}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={styles.imagePlaceholder} />
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.content}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Awareness Hub</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#6C5CE7" />
                </View>
            ) : (
                <FlatList
                    data={articles}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View style={styles.introContainer}>
                            <Text style={styles.introTitle}>Stay Informed</Text>
                            <Text style={styles.introText}>
                                Latest news, tips, and best practices to stay safe online.
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No articles found.</Text>
                        </View>
                    }
                />
            )}
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
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    imagePlaceholder: {
        height: 150,
        backgroundColor: '#dfe6e9',
        width: '100%',
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: '#B2BEC3',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#636e72',
    },
    introContainer: {
        marginBottom: 20,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 8,
    },
    introText: {
        fontSize: 16,
        color: '#636e72',
        lineHeight: 24,
    }
});
