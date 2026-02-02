import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

export default function ResetPassword() {
    const router = useRouter();
    const { email, otp } = useLocalSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending Reset Request:', { email, otp, newPassword });
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const text = await response.text();
            console.log('Reset Response Status:', response.status);
            console.log('Reset Response Body:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('JSON Parse Error:', e);
                Alert.alert('Error', `Server returned invalid response: ${response.status}`);
                return;
            }

            if (response.ok) {
                Alert.alert('Success', 'Password reset successfully');
                router.replace('/(auth)/login');
            } else {
                Alert.alert('Error', data.error || 'Reset failed');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.iconContainer}>
                            <Feather name="check-circle" size={40} color={Colors.light.primary} />
                        </View>

                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Create a new password for your account
                        </Text>

                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>New Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="lock" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter new password"
                                        placeholderTextColor={Colors.light.icon}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={Colors.light.icon} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="lock" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm new password"
                                        placeholderTextColor={Colors.light.icon}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.disabledButton]}
                                onPress={handleReset}
                                disabled={loading}
                            >
                                <Text style={styles.submitButtonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        marginBottom: 20,
        alignItems: 'flex-start',
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
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 0,
        marginTop: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.icon,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
    },
    submitButton: {
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
