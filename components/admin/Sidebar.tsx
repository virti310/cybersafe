import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
    { id: 1, label: 'Dashboard', route: '/admin', icon: 'dashboard', library: MaterialIcons },
    { id: 2, label: 'Users', route: '/admin/users', icon: 'people', library: MaterialIcons },
    { id: 3, label: 'Reports', route: '/admin/reports', icon: 'report-problem', library: MaterialIcons },
    { id: 4, label: 'Awareness', route: '/admin/awareness', icon: 'book', library: FontAwesome5 },
    { id: 10, label: 'FAQs', route: '/admin/faqs', icon: 'help', library: MaterialIcons },
    { id: 5, label: 'Recovery Guides', route: '/admin/recovery-guides', icon: 'first-aid', library: FontAwesome5 },
    { id: 7, label: 'Categories', route: '/admin/categories', icon: 'list', library: FontAwesome5 },
    { id: 6, label: 'Emergency Contacts', route: '/admin/emergency-contacts', icon: 'phone', library: MaterialIcons },
    { id: 8, label: 'Legal Policies', route: '/admin/policies', icon: 'gavel', library: MaterialIcons },
    { id: 9, label: 'Notifications', route: '/admin/notifications', icon: 'notifications', library: MaterialIcons },
] as const;

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <MaterialIcons name="security" size={32} color="#6C5CE7" />
                <Text style={styles.logoText}>CyberSafe Admin</Text>
            </View>

            <ScrollView contentContainerStyle={styles.menuContainer}>
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.route;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.menuItem, isActive && styles.activeMenuItem]}
                            onPress={() => {
                                router.push(item.route);
                                if (onClose) onClose();
                            }}
                        >
                            <item.library
                                name={item.icon}
                                size={22}
                                color={isActive ? '#6C5CE7' : '#636e72'}
                            />
                            <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/(auth)/login')}>
                    <MaterialIcons name="logout" size={20} color="#FF6B6B" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
                <Text style={styles.version}>v1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#E1E8ED',
        width: 250,
    },
    logoContainer: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    logoText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    menuContainer: {
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    activeMenuItem: {
        backgroundColor: '#F0F3FF',
    },
    menuText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#636e72',
        fontWeight: '500',
    },
    activeMenuText: {
        color: '#6C5CE7',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoutText: {
        marginLeft: 10,
        color: '#FF6B6B',
        fontWeight: '600',
    },
    version: {
        color: '#B2BEC3',
        fontSize: 12,
    }
});
