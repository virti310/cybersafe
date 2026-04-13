import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Stack } from 'expo-router';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(Platform.OS === 'web' && Dimensions.get('window').width > 768);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentWrapper}>
                {/* Sidebar - Visible on Desktop or when toggled */}
                {(isSidebarOpen || (Platform.OS === 'web' && Dimensions.get('window').width > 768)) && (
                    <View style={styles.sidebarWrapper}>
                        <Sidebar onClose={() => Dimensions.get('window').width < 768 && setIsSidebarOpen(false)} />
                    </View>
                )}

                <View style={styles.mainContent}>
                    <Header onMenuPress={toggleSidebar} />
                    <View style={styles.pageContent}>
                        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebarWrapper: {
        height: '100%',
        zIndex: 100,
        elevation: 5,
        backgroundColor: '#FFF',
        // Mobile floating sidebar logic could be added here
    },
    mainContent: {
        flex: 1,
        height: '100%',
    },
    pageContent: {
        flex: 1,
        padding: 0, // Individual pages handle padding
    }
});
