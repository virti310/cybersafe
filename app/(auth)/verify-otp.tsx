import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

export default function VerifyOTP() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'OTP Verified');
                router.push({ pathname: '/reset-password' as any, params: { email, otp } });
            } else {
                Alert.alert('Error', data.error || 'Invalid OTP');
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
                            <MaterialIcons name="lock-clock" size={40} color={Colors.light.primary} />
                        </View>

                        <Text style={styles.title}>Verify OTP</Text>
                        <Text style={styles.subtitle}>
                            Enter the code sent to {email}
                        </Text>

                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>One-Time Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="key" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter 6-digit code"
                                        placeholderTextColor={Colors.light.icon}
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.disabledButton]}
                                onPress={handleVerify}
                                disabled={loading}
                            >
                                <Text style={styles.submitButtonText}>{loading ? 'Verifying...' : 'Verify Code'}</Text>
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
        fontSize: 20,
        color: Colors.light.text,
        letterSpacing: 4,
        fontWeight: '600',
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
