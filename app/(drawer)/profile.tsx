import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../../constants/API';

export default function Profile() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Edit Form State
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editGender, setEditGender] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                // Fetch fresh data from API
                const response = await fetch(`${API_URL}/users/${userData.id}`);
                if (response.ok) {
                    const freshUser = await response.json();
                    setUser(freshUser);
                    // Initialize edit form
                    setEditName(freshUser.username || '');
                    setEditPhone(freshUser.phone || '');
                    setEditGender(freshUser.gender || '');
                } else {
                    // Fallback to local data if fetch fails
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            const response = await fetch(`${API_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: editName,
                    phone: editPhone,
                    gender: editGender
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setEditing(false);
                // Update local storage
                await AsyncStorage.setItem('userData', JSON.stringify(data.user));
                Alert.alert('Success', 'Profile updated successfully');
            } else {
                Alert.alert('Error', data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update failed:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const MenuRow = ({ label, icon, onPress, isSwitch, value, onToggle }: any) => (
        <TouchableOpacity
            style={styles.menuRow}
            onPress={onPress}
            disabled={isSwitch}
        >
            <View style={styles.menuIconContainer}>
                <Feather name={icon} size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.menuLabel}>{label}</Text>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                    thumbColor="#FFF"
                />
            ) : (
                <Feather name="chevron-right" size={20} color={Colors.light.icon} />
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                {editing ? (
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={{ color: Colors.light.primary, fontWeight: '600' }}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={48} color="#FFF" />
                    </View>

                    {editing ? (
                        <View style={{ width: '100%', alignItems: 'center', gap: 10 }}>
                            <TextInput
                                style={[styles.input, { fontSize: 18, fontWeight: '700', textAlign: 'center' }]}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Name"
                            />
                            <TextInput
                                style={[styles.input, { fontSize: 14, textAlign: 'center' }]}
                                value={editPhone}
                                onChangeText={setEditPhone}
                                placeholder="Phone"
                                keyboardType="phone-pad"
                            />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.name}>{user?.username || 'User'}</Text>
                            <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
                            <Text style={[styles.email, { marginTop: -10 }]}>{user?.phone || 'No phone'}</Text>
                            <Text style={[styles.email, { marginTop: -4 }]}>{user?.birthdate || 'No birthdate'}</Text>
                        </>
                    )}

                    {!editing && (
                        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.card}>
                        <MenuRow
                            label="Change Password"
                            icon="lock"
                            onPress={() => router.push('/change-password')}
                        />
                        <View style={styles.divider} />
                        <MenuRow
                            label="Push Notifications"
                            icon="bell"
                            isSwitch
                            value={notifications}
                            onToggle={setNotifications}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.card}>
                        <MenuRow
                            label="Help & FAQs"
                            icon="help-circle"
                            onPress={() => router.push('/support/help')}
                        />
                        <View style={styles.divider} />
                        <MenuRow
                            label="Privacy Policy"
                            icon="shield"
                            onPress={() => router.push('/support/privacy')}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Feather name="log-out" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>

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
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#E0E7FF',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: Colors.light.icon,
        marginBottom: 16,
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 20,
    },
    editButtonText: {
        color: Colors.light.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.icon,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginLeft: 60,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginBottom: 24,
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: Colors.light.icon,
        fontSize: 12,
    },
    input: {
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 8,
        padding: 8,
        minWidth: 200,
        marginBottom: 8,
        color: Colors.light.text,
    },
});
