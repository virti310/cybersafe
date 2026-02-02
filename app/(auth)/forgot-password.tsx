import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending request to:', `${API_URL}/auth/forgot-password`);
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                Alert.alert('Success', data.message);
                console.log('Navigating to /verify-otp with email:', email);
                router.push({ pathname: '/verify-otp' as any, params: { email } });
            } else {
                Alert.alert('Error', data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            Alert.alert('Error', 'Unable to connect to server. Check logs.');
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
                            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.iconContainer}>
                            <Feather name="lock" size={40} color={Colors.light.primary} />
                        </View>

                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Don't worry! It happens. Please enter the address associated with your account.
                        </Text>

                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="mail" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={Colors.light.icon}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                <Text style={styles.submitButtonText}>{loading ? 'Sending...' : 'Submit'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Remember Password? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
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
        backgroundColor: '#EFF6FF', // slightly lighter than primary
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    footerText: {
        color: Colors.light.icon,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.light.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});
