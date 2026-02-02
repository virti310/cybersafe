import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { api } from '../../services/api';

interface EmergencyContact {
    id: number;
    team: string; // Used as name
    phone: string;
    priority: string; // Used as type
    description?: string;
    availability?: string;
}

export default function EmergencyContacts() {
    const router = useRouter();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchContacts = async () => {
        try {
            const data = await api.get('/emergency-contacts');
            if (Array.isArray(data)) {
                setContacts(data);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchContacts();
    };

    const handleCall = (number: string) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return '#FF5252';
            case 'medium': return '#FFB74D';
            case 'low': return '#4DB6AC';
            default: return '#90A4AE';
        }
    };

    const renderItem = ({ item }: { item: EmergencyContact }) => (
        <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: getPriorityColor(item.priority) }]}>
                <FontAwesome5 name="phone-alt" size={20} color="#FFF" />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.team}</Text>
                <View style={styles.badgeContainer}>
                    <Text style={[styles.type, { color: getPriorityColor(item.priority) }]}>
                        {item.priority}
                    </Text>
                    {item.availability && (
                        <Text style={styles.availability}> • {item.availability}</Text>
                    )}
                </View>
                {item.description && (
                    <Text style={styles.description} numberOfLines={1}>
                        {item.description}
                    </Text>
                )}
            </View>
            <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}>
                <MaterialIcons name="call" size={20} color="#FFF" />
                <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
                <View style={styles.heroTextContainer}>
                    <Text style={styles.heroTitle}>Emergency Support</Text>
                    <Text style={styles.heroSubtitle}>Immediate assistance is just a tap away</Text>
                </View>
                <FontAwesome5 name="user-shield" size={40} color="#FF6B6B" style={styles.heroIcon} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                </View>
            ) : (
                <FlatList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <FontAwesome5 name="address-book" size={50} color="#CFD8DC" />
                            <Text style={styles.emptyText}>No emergency contacts found</Text>
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
        elevation: 2,
    },
    backButton: {
        marginRight: 15,
        padding: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    listContent: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
        marginRight: 10,
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#263238',
        marginBottom: 4,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    type: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    availability: {
        fontSize: 13,
        color: '#78909C',
    },
    description: {
        fontSize: 13,
        color: '#90A4AE',
    },
    callButton: {
        backgroundColor: '#26A69A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        shadowColor: '#26A69A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    callText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 6,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#90A4AE',
    },
    heroSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    heroTextContainer: {
        flex: 1,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2D3436',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#636E72',
        lineHeight: 20,
    },
    heroIcon: {
        marginLeft: 16,
        opacity: 0.9,
    },
});
