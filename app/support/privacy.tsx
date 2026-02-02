import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import API_URL from '../../constants/API';
import AccordionItem from '../../components/AccordionItem';

export default function Privacy() {
    const router = useRouter();
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const response = await fetch(`${API_URL}/policies`);
            if (response.ok) {
                const data = await response.json();
                // Filter for privacy related policies, or show all
                const privacyPolicies = data.filter((p: any) =>
                    p.title.toLowerCase().includes('privacy') || p.title.toLowerCase().includes('policy')
                );
                setPolicies(privacyPolicies);
            }
        } catch (error) {
            console.error('Failed to fetch policies:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Legal</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Privacy Policy</Text>
                    <Text style={styles.pageDescription}>
                        We are committed to protecting your personal information and your right to privacy.
                    </Text>
                    <View style={styles.countContainer}>
                        <Text style={styles.countText}>{policies.length} {policies.length === 1 ? 'Policy' : 'Policies'}</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.listContainer}>
                        {policies.length > 0 ? (
                            policies.map((policy, index) => (
                                <AccordionItem key={index} title={`${index + 1}. ${policy.title}`} initiallyExpanded={index === 0}>
                                    <Text style={styles.text}>{policy.content}</Text>
                                </AccordionItem>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Feather name="shield" size={48} color={Colors.light.icon} />
                                <Text style={styles.emptyText}>No privacy policies available.</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    content: {
        padding: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    pageHeader: {
        marginBottom: 32,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    pageDescription: {
        fontSize: 16,
        color: Colors.light.icon,
        lineHeight: 24,
        marginBottom: 16,
    },
    countContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    countText: {
        color: Colors.light.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    listContainer: {
        gap: 4,
    },
    text: {
        fontSize: 15,
        color: Colors.light.text,
        lineHeight: 26,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        gap: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.light.icon,
        fontSize: 16,
    }
});
