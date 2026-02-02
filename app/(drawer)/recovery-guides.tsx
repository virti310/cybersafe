import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import API_URL from '../../constants/API';

interface RecoveryGuide {
    id: number;
    title: string;
    content: string;
    guide?: string;
    category_id: number;
    category_name?: string;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

export default function RecoveryGuides() {
    const router = useRouter();
    const [guides, setGuides] = useState<RecoveryGuide[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchGuides(selectedCategory);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            if (response.ok) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchGuides = async (categoryId: number | null) => {
        setLoading(true);
        try {
            let url = `${API_URL}/recovery-guides`;
            if (categoryId) {
                url += `?category_id=${categoryId}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setGuides(data);
            } else {
                console.error('Failed to fetch recovery guides');
            }
        } catch (error) {
            console.error('Error fetching recovery guides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (id: number | null) => {
        setSelectedCategory(id);
        fetchGuides(id);
    };

    const renderItem = ({ item }: { item: RecoveryGuide }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/recovery-guide-details/${item.id}` as any)}
        >
            <View style={styles.iconBox}>
                <FontAwesome5 name="first-aid" size={24} color="#A8E6CF" />
            </View>
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                {item.category_name && <Text style={styles.steps}>{item.category_name}</Text>}
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#B2BEC3" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recovery Guides</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.introContainer}>
                    <Text style={styles.introTitle}>Recovery Assistance</Text>
                    <Text style={styles.introText}>
                        Step-by-step guides to help you recover from various cyber incidents.
                    </Text>
                </View>

                <View style={styles.categoryContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        <TouchableOpacity
                            style={[styles.categoryChip, selectedCategory === null && styles.activeChip]}
                            onPress={() => handleCategorySelect(null)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === null && styles.activecategoryText]}>All</Text>
                        </TouchableOpacity>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryChip, selectedCategory === cat.id && styles.activeChip]}
                                onPress={() => handleCategorySelect(cat.id)}
                            >
                                <Text style={[styles.categoryText, selectedCategory === cat.id && styles.activecategoryText]}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#6C5CE7" />
                    </View>
                ) : (
                    <FlatList
                        data={guides}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.centerContainer}>
                                <Text style={styles.emptyText}>No guides found for this category.</Text>
                            </View>
                        }
                    />
                )}
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
    categoryContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    categoryScroll: {
        paddingHorizontal: 15,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeChip: {
        backgroundColor: '#6C5CE7',
        borderColor: '#6C5CE7',
    },
    categoryText: {
        fontSize: 14,
        color: '#636E72',
        fontWeight: '500',
    },
    activecategoryText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2D3436', // Dark background for contrast with light icon
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    steps: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
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
        marginTop: 20
    },
    introContainer: {
        padding: 20,
        paddingBottom: 0,
        backgroundColor: '#F7F9FC',
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
