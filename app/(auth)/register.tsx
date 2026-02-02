import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import API_URL from '../../constants/API';
import { Colors } from '../../constants/theme';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !phone || !gender || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, gender, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully');
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', data.error || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const GenderOption = ({ value, icon }: { value: string, icon: string }) => (
        <TouchableOpacity
            style={[
                styles.genderOption,
                gender === value && styles.genderSelected
            ]}
            onPress={() => setGender(value)}
        >
            <FontAwesome5
                name={icon}
                size={16}
                color={gender === value ? '#FFF' : Colors.light.icon}
            />
            <Text style={[
                styles.genderText,
                gender === value && styles.genderTextSelected
            ]}>{value}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="user" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    placeholderTextColor={Colors.light.icon}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email */}
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

                        {/* Phone */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="phone" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={Colors.light.icon}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Gender */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Gender</Text>
                            <View style={styles.genderOptions}>
                                <GenderOption value="Male" icon="male" />
                                <GenderOption value="Female" icon="female" />
                                <GenderOption value="Other" icon="genderless" />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="lock" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password"
                                    placeholderTextColor={Colors.light.icon}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={Colors.light.icon} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="lock" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
                                    placeholderTextColor={Colors.light.icon}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                    <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color={Colors.light.icon} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.disabledButton]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <Text style={styles.registerButtonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                            {!loading && <Feather name="arrow-right" size={20} color="#FFF" />}
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
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
    titleContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.icon,
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
    eyeIcon: {
        padding: 4,
    },
    genderOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    genderOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: Colors.light.card,
        gap: 8,
    },
    genderSelected: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    genderText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.icon,
    },
    genderTextSelected: {
        color: '#FFF',
    },
    registerButton: {
        backgroundColor: Colors.light.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        marginTop: 12,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
        gap: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        color: Colors.light.icon,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.light.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});
