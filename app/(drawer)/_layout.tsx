import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

function CustomDrawerContent(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const { bottom } = useSafeAreaInsets();

    useEffect(() => {
        loadUser();
    }, [pathname]);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error(e);
            setUser(null);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        setUser(null);
        router.replace('/(auth)/login');
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: Colors.light.primary, paddingTop: 0 }}>
                <View style={styles.drawerHeader}>
                    <View style={styles.avatarContainer}>
                        <Feather name="user" size={32} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.userName}>{user?.username || 'Guest User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'Please login to access full features'}</Text>
                </View>
                <View style={styles.drawerItemsContainer}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={[styles.footer, { paddingBottom: 20 + bottom }]}>
                {user ? (
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Feather name="log-out" size={20} color="#EF4444" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/(auth)/login')}>
                        <Feather name="log-in" size={20} color={Colors.light.primary} />
                        <Text style={[styles.logoutText, { color: Colors.light.primary }]}>Login</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default function DrawerLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerActiveTintColor: Colors[colorScheme ?? 'light'].primary,
                    drawerInactiveTintColor: Colors[colorScheme ?? 'light'].text,
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                        width: 280,
                    },
                    drawerLabelStyle: {
                        marginLeft: 12,
                        fontSize: 15,
                        fontWeight: '500',
                    },
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Home',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="notifications"
                    options={{
                        drawerLabel: 'Notifications',
                        title: 'Notifications',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="bell" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="report-incident"
                    options={{
                        drawerLabel: 'Report Incident',
                        title: 'Report Incident',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="report-problem" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="my-reports"
                    options={{
                        drawerLabel: 'My Reports',
                        title: 'My Reports',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="file-text" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="emergency-contacts"
                    options={{
                        drawerLabel: 'Emergency Contacts',
                        title: 'Emergency Contacts',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="phone-call" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="awareness"
                    options={{
                        drawerLabel: 'Awareness Hub',
                        title: 'Awareness Hub',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="book-open" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="recovery-guides"
                    options={{
                        drawerLabel: 'Recovery Guides',
                        title: 'Recovery Guides',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="shield" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="chatbot"
                    options={{
                        drawerLabel: 'AI Assistant',
                        title: 'AI Assistant',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="message-square" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerLabel: 'My Profile',
                        title: 'My Profile',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="user" size={size} color={color} />
                        ),
                    }}
                />

            </Drawer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    drawerHeader: {
        padding: 24,
        paddingTop: 48,
        backgroundColor: Colors.light.primary,
        marginBottom: 8,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    drawerItemsContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});
