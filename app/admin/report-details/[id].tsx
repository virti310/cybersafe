import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import debounce from 'lodash/debounce';
import { Colors } from '../../../constants/theme';
import API_URL from '../../../constants/API';

export default function AdminReportDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchReportDetails();
    }, [id]);

    const fetchReportDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/reports/${id}`);
            const data = await response.json();
            if (response.ok) {
                setReport(data);
            } else {
                Alert.alert('Error', 'Failed to load report details');
                router.back();
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
        }
    };

    // Removed status update logic as per requirement

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
            </SafeAreaView>
        );
    }

    if (!report) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin: Report #{report.id}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Card */}
                {/* Status Card Removed */}

                {/* Main Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Incident Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Type:</Text>
                        <Text style={styles.value}>{report.incident_type}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Date & Time:</Text>
                        <Text style={styles.value}>{new Date(report.incident_date).toLocaleString()}</Text>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.description}>{report.incident_details}</Text>
                </View>

                {/* Financial Details (if applicable) */}
                {report.is_financial_fraud && (
                    <View style={styles.section}>
                        <View style={styles.rowCenter}>
                            <MaterialIcons name="attach-money" size={20} color={Colors.light.error} />
                            <Text style={[styles.sectionTitle, { marginLeft: 8, color: Colors.light.error }]}>Financial Fraud</Text>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.label}>Bank/Wallet</Text>
                                <Text style={styles.value}>{report.bank_name || 'N/A'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.label}>Amount</Text>
                                <Text style={styles.value}>{report.fraud_amount || 'N/A'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.label}>Transaction ID</Text>
                                <Text style={styles.value}>{report.transaction_id || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Suspect Details */}
                {(report.suspect_mobile || report.suspect_email || report.suspect_url || report.suspect_photo_path) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Suspect Information</Text>
                        {report.suspect_photo_path && (
                            <View style={[styles.detailRow, { marginBottom: 20, justifyContent: 'center' }]}>
                                <Image
                                    source={{ uri: `${API_URL}/${report.suspect_photo_path.replace(/\\/g, '/')}` }}
                                    style={styles.suspectPhotoLarge}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        {report.suspect_url && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>URL:</Text>
                                <Text style={styles.value}>{report.suspect_url}</Text>
                            </View>
                        )}
                        {report.suspect_mobile && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Mobile:</Text>
                                <Text style={styles.value}>{report.suspect_mobile}</Text>
                            </View>
                        )}
                        {report.suspect_email && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Email:</Text>
                                <Text style={styles.value}>{report.suspect_email}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Admin Actions */}
                {/* Admin Actions Removed */}

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
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    // Status styles removed
    section: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: Colors.light.icon,
        fontWeight: '500',
        flex: 1,
    },
    value: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
    },
    description: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 22,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 12,
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 15,
    },
    suspectPhotoLarge: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#f1f2f6',
    }
});
