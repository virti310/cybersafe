import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import debounce from 'lodash/debounce';
import { Colors } from '../../constants/theme';
import API_URL from '../../constants/API';

export default function RecoveryGuideDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [guide, setGuide] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGuideDetails();
    }, [id]);

    const fetchGuideDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/recovery-guides/${id}`);
            const data = await response.json();
            if (response.ok) {
                setGuide(data);
            } else {
                Alert.alert('Error', 'Failed to load guide details');
                router.back();
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
            </SafeAreaView>
        );
    }

    if (!guide) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Guide Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconBox}>
                            <FontAwesome5 name="first-aid" size={24} color="#A8E6CF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{guide.title}</Text>
                            {guide.category_name && (
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{guide.category_name}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionHeader}>Steps to Recover</Text>
                    <Text style={styles.description}>
                        {guide.content}
                    </Text>

                    <View style={styles.infoBox}>
                        <MaterialIcons name="info-outline" size={20} color={Colors.light.primary} />
                        <Text style={styles.infoText}>
                            If you need immediate assistance, please verify with official sources or contact our emergency lines.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        marginRight: 15,
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2D3436',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    categoryBadge: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    categoryText: {
        color: Colors.light.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 16,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: Colors.light.text,
        lineHeight: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 8,
        marginTop: 24,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        color: '#1E40AF',
        fontSize: 13,
        lineHeight: 18,
    }
});
