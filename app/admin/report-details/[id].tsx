import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const response = await fetch(`${API_URL}/reports/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();
            if (response.ok) {
                setReport(data);
                Alert.alert('Success', `Status updated to ${newStatus}`);
            } else {
                Alert.alert('Error', 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Network error');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return '#2ecc71';
            case 'rejected': return '#e74c3c';
            case 'in progress': return '#3498db';
            default: return '#f1c40f'; // Pending
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return '#e8f8f5';
            case 'rejected': return '#fdedec';
            case 'in progress': return '#ebf5fb';
            default: return '#fef9e7'; // Pending
        }
    };

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
                <View style={styles.statusCard}>
                    <Text style={styles.statusLabel}>Current Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(report.status) }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                            {report.status || 'Pending'}
                        </Text>
                    </View>
                </View>

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
                {(report.suspect_mobile || report.suspect_email || report.suspect_url) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Suspect Information</Text>
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
                <View style={styles.actionSection}>
                    <Text style={styles.sectionTitle}>Admin Actions</Text>
                    <Text style={styles.actionLabel}>Update Status:</Text>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { borderColor: '#3498db', backgroundColor: report.status === 'In Progress' ? '#3498db' : 'transparent' }]}
                            onPress={() => updateStatus('In Progress')}
                            disabled={updating}
                        >
                            <Text style={[styles.actionBtnText, { color: report.status === 'In Progress' ? '#FFF' : '#3498db' }]}>In Progress</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { borderColor: '#2ecc71', backgroundColor: report.status === 'Resolved' ? '#2ecc71' : 'transparent' }]}
                            onPress={() => updateStatus('Resolved')}
                            disabled={updating}
                        >
                            <Text style={[styles.actionBtnText, { color: report.status === 'Resolved' ? '#FFF' : '#2ecc71' }]}>Resolve</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { borderColor: '#e74c3c', backgroundColor: report.status === 'Rejected' ? '#e74c3c' : 'transparent' }]}
                            onPress={() => updateStatus('Rejected')}
                            disabled={updating}
                        >
                            <Text style={[styles.actionBtnText, { color: report.status === 'Rejected' ? '#FFF' : '#e74c3c' }]}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                    {updating && <ActivityIndicator size="small" color={Colors.light.primary} style={{ marginTop: 10 }} />}
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
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    statusCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statusLabel: {
        fontSize: 14,
        color: Colors.light.icon,
        marginBottom: 8,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
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
    actionSection: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    actionLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
    }
});
