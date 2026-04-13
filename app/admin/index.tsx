import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { API_URL } from '../../services/api';

const SummaryCard = ({ title, value, icon, color, library: IconLib }: any) => (
    <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
            <IconLib name={icon} size={24} color={color} />
        </View>
        <View>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
    </View>
);

export default function AdminDashboard() {
    const [stats, setStats] = React.useState({
        totalUsers: 0,
        totalReports: 0,
        fraudReports: 0,
        totalArticles: 0,
        recentReports: [] as any[],
        trendData: [] as any[],
        systemStatus: { database: 'Unknown', server: 'Unknown', backup: 'Unknown' }
    });

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            console.log('Fetching stats from:', `${API_URL}/dashboard/stats`);
            const response = await fetch(`${API_URL}/dashboard/stats`);
            console.log('Stats response status:', response.status);

            const data = await response.json();
            console.log('Stats data:', data);

            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Dashboard Overview</Text>

            {/* Summary Cards */}
            <View style={styles.cardsGrid}>
                <SummaryCard
                    title="Total Users"
                    value={stats.totalUsers.toString()}
                    icon="people"
                    color="#6C5CE7"
                    library={MaterialIcons}
                />
                <SummaryCard
                    title="Total Reports"
                    value={stats.totalReports.toString()}
                    icon="report-problem"
                    color="#FF6B6B"
                    library={MaterialIcons}
                />
                <SummaryCard
                    title="Awareness Articles"
                    value={stats.totalArticles.toString()}
                    icon="book"
                    color="#4ECDC4"
                    library={FontAwesome5}
                />
                <SummaryCard
                    title="Fraud Reports"
                    value={stats.fraudReports.toString()}
                    icon="heartbeat"
                    color="#2ecc71"
                    library={FontAwesome5}
                />
            </View>

            {/* Recent Activity / Charts Placeholder */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Incident Reports</Text>
                <View style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 0.5 }]}>ID</Text>
                        <Text style={[styles.th, { flex: 2 }]}>Title</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Status</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Date</Text>
                    </View>
                    {stats.recentReports && stats.recentReports.length > 0 ? (
                        stats.recentReports.map((report: any) => (
                            <View key={report.id} style={styles.tableRow}>
                                <Text style={[styles.td, { flex: 0.5 }]}>#{report.id}</Text>
                                <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{report.incident_type}</Text>
                                <Text style={[styles.td, { flex: 1, color: report.status === 'Resolved' ? '#2ecc71' : '#f1c40f' }]}>
                                    {report.status || 'Pending'}
                                </Text>
                                <Text style={[styles.td, { flex: 1 }]}>{new Date(report.created_at).toLocaleDateString()}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#999' }}>No recent reports found.</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.row}>
                {/* Mock Chart Area */}
                <View style={[styles.chartCard, { marginRight: 20 }]}>
                    <Text style={styles.sectionTitle}>Incident Trends</Text>
                    <View style={styles.chartPlaceholder}>
                        {stats.trendData && stats.trendData.length > 0 ? (
                            stats.trendData.map((data: any, index: number) => {
                                // Simple normalization for bar height
                                const maxCount = Math.max(...stats.trendData.map((d: any) => parseInt(d.count)));
                                const height = maxCount > 0 ? (parseInt(data.count) / maxCount) * 100 : 0;
                                return (
                                    <View key={index} style={{ alignItems: 'center' }}>
                                        <View style={[styles.bar, { height: `${height}%`, minHeight: 4 }]} />
                                        <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                                            {new Date(data.date).getDate()}
                                        </Text>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={{ color: '#999' }}>No data available</Text>
                        )}
                    </View>
                </View>

                {/* System Status */}
                <View style={styles.chartCard}>
                    <Text style={styles.sectionTitle}>System Status</Text>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: stats.systemStatus?.database === 'Connected' ? '#2ecc71' : '#e74c3c' }]} />
                        <Text style={styles.statusText}>Database: {stats.systemStatus?.database}</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: stats.systemStatus?.server === 'Online' ? '#2ecc71' : '#e74c3c' }]} />
                        <Text style={styles.statusText}>API Server: {stats.systemStatus?.server}</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: stats.systemStatus?.backup === 'Active' ? '#2ecc71' : 'orange' }]} />
                        <Text style={styles.statusText}>Backup Service: {stats.systemStatus?.backup}</Text>
                    </View>
                </View>
            </View>

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 24,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        flex: 1,
        minWidth: 200,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    cardTitle: {
        fontSize: 14,
        color: '#636e72',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3436',
        marginBottom: 16,
    },
    tableCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
    },
    th: {
        fontWeight: '600',
        color: '#636e72',
        fontSize: 14,
    },
    td: {
        color: '#2D3436',
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 24,
    },
    chartCard: {
        flex: 1,
        minWidth: 300,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    chartPlaceholder: {
        height: 150,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingTop: 20,
    },
    bar: {
        width: 30,
        backgroundColor: '#6C5CE7',
        borderRadius: 4,
        opacity: 0.8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2ecc71',
        marginRight: 10,
    },
    statusText: {
        color: '#636e72',
    }
});
