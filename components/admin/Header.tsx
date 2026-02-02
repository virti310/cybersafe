import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Header({ onMenuPress }: { onMenuPress?: () => void }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {onMenuPress && (
                    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                        <MaterialIcons name="menu" size={28} color="#333" />
                    </TouchableOpacity>
                )}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#B2BEC3" />
                    <TextInput
                        placeholder="Search..."
                        style={styles.searchInput}
                        placeholderTextColor="#B2BEC3"
                    />
                </View>
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color="#636e72" />
                    <View style={styles.badge} />
                </TouchableOpacity>
                <View style={styles.profile}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>A</Text>
                    </View>
                    <Text style={styles.profileName}>Admin</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuButton: {
        marginRight: 16,
        // only visible on mobile essentially via parent logic
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: 300,
        maxWidth: '100%',
    },
    searchInput: {
        marginLeft: 8,
        fontSize: 14,
        flex: 1,
        color: '#333',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 24,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6B6B',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#6C5CE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    profileName: {
        fontWeight: '600',
        color: '#333',
    }
});
