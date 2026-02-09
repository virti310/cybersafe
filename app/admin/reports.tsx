import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

interface Report {
    id: number;
    incident_type: string;
    incident_details: string;
    incident_date: string;
    created_at: string;
    status: string;
    suspect_photo_path?: string;
}

export default function ReportsManagement() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = reports.filter(report =>
                report.incident_type?.toLowerCase().includes(lowerQuery) ||
                report.incident_details?.toLowerCase().includes(lowerQuery) ||
                report.id.toString().includes(lowerQuery)
            );
            setFilteredReports(filtered);
        } else {
            setFilteredReports(reports);
        }
    }, [searchQuery, reports]);

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_URL}/reports`);
            const data = await response.json();
            if (response.ok) {
                setReports(data);
                setFilteredReports(data);
            } else {
                console.error('Failed to fetch reports');
                Alert.alert('Error', 'Failed to fetch reports');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Incident Reports Management</Text>
            </View>

            <View style={styles.tableCard}>
                <View style={styles.filterRow}>
                    <TextInput
                        placeholder="Search by type, ID or details..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={fetchReports} style={styles.refreshButton}>
                        <MaterialIcons name="refresh" size={24} color="#636e72" />
                    </TouchableOpacity>
                </View>

                <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Suspect</Text>
                    <Text style={[styles.th, { flex: 3 }]}>Incident Type</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Date</Text>
                    <Text style={[styles.th, { flex: 0.5, textAlign: 'center' }]}>View</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
                ) : (
                    filteredReports.map((report) => (
                        <TouchableOpacity
                            key={report.id}
                            style={styles.tableRow}
                            onPress={() => router.push(`/(drawer)/../admin/report-details/${report.id}` as any)}
                        >
                            <Text style={[styles.td, { flex: 0.5 }]}>#{report.id}</Text>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                {report.suspect_photo_path ? (
                                    <Image
                                        source={{ uri: `${API_URL}/${report.suspect_photo_path.replace(/\\/g, '/')}` }}
                                        style={styles.suspectImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <MaterialIcons name="person" size={20} color="#bdc3c7" />
                                    </View>
                                )}
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={[styles.td, { fontWeight: '600' }]}>{report.incident_type || 'General'}</Text>
                                <Text style={styles.subtext} numberOfLines={1}>{report.incident_details}</Text>
                            </View>
                            <Text style={[styles.td, { flex: 1 }]}>{new Date(report.incident_date || report.created_at).toLocaleDateString()}</Text>
                            <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="visibility" size={20} color={Colors.light.primary} />
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {!loading && filteredReports.length === 0 && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#aaa' }}>No reports found.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    tableCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#F7F9FC',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flex: 1,
        marginRight: 10,
        fontSize: 14,
        color: '#333',
    },
    refreshButton: {
        padding: 8,
        backgroundColor: '#F7F9FC',
        borderRadius: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
        marginBottom: 12,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
        alignItems: 'center',
    },
    th: {
        fontWeight: '600',
        color: '#636e72',
        fontSize: 13,
        textTransform: 'uppercase',
    },
    td: {
        color: '#2D3436',
        fontSize: 14,
    },
    subtext: {
        fontSize: 12,
        color: '#95a5a6',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    suspectImage: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#eee',
    },
    placeholderImage: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
