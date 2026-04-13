import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import API_URL from '../../constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';

export default function ReportIncident() {
    const router = useRouter();

    // Mandatory State
    const [incidentDate, setIncidentDate] = useState('');
    const [incidentDetails, setIncidentDetails] = useState('');

    // Image State
    // Removed National ID state as per requirement
    const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
    const [suspectPhotoImage, setSuspectPhotoImage] = useState<string | null>(null);

    // Financial Fraud State
    const [isFinancialFraud, setIsFinancialFraud] = useState(false);
    const [bankName, setBankName] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [fraudAmount, setFraudAmount] = useState('');

    // Optional State
    const [suspectUrl, setSuspectUrl] = useState('');
    const [suspectMobile, setSuspectMobile] = useState('');
    const [suspectEmail, setSuspectEmail] = useState('');

    const pickImage = async (setImage: (uri: string | null) => void) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    // Check Login Status on Mount
    useEffect(() => {
        checkLoginStatus();
        fetchIncidentTypes();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userDataStr = await AsyncStorage.getItem('userData');

            if (!token || !userDataStr) {
                Alert.alert(
                    'Authentication Required',
                    'You must be logged in to submit a report.',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
                        { text: 'Login', onPress: () => router.push('/(auth)/login') }
                    ]
                );
                return;
            }

            const userData = JSON.parse(userDataStr);
            if (userData && userData.id) {
                setUserId(userData.id);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    const [incidentType, setIncidentType] = useState('');
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [incidentTypes, setIncidentTypes] = useState<string[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    const fetchIncidentTypes = async () => {
        setLoadingTypes(true);
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            if (response.ok) {
                // Assuming data is an array of objects with a 'name' property
                const types = data.map((cat: any) => cat.name);
                setIncidentTypes(types);
            } else {
                console.error('Failed to fetch incident types');
            }
        } catch (error) {
            console.error('Error fetching incident types:', error);
        } finally {
            setLoadingTypes(false);
        }
    };

    const handleTypeSelect = (type: string) => {
        setIncidentType(type);
        setTypeModalVisible(false);
        if (type === 'Financial Fraud' || type === 'Fake Job Offer') {
            setIsFinancialFraud(true);
        } else {
            // Optional: Auto turn off? Or let user decide?
            // Let's not auto-turn off to preserve data if they switch back and forth, 
            // but maybe a toast or check? leaving as is for now.
        }
    };

    const handleSubmit = async () => {
        if (!userId) {
            Alert.alert('Error', 'User session not found. Please log in again.');
            router.push('/(auth)/login');
            return;
        }

        if (!incidentDate || !incidentDetails || !incidentType) {
            Alert.alert('Missing Information', 'Please fill in all mandatory fields.');
            return;
        }
        if (incidentDetails.length < 50) {
            Alert.alert('Detail too short', 'Incident details must be at least 50 characters.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('user_id', String(userId));
            formData.append('incident_date', incidentDate);
            formData.append('incident_details', incidentDetails);
            formData.append('incident_type', incidentType);
            formData.append('is_financial_fraud', String(isFinancialFraud));

            if (isFinancialFraud) {
                formData.append('bank_name', bankName || '');
                formData.append('transaction_id', transactionId || '');
                formData.append('transaction_date', transactionDate || '');
                formData.append('fraud_amount', fraudAmount || '');
            }

            formData.append('suspect_url', suspectUrl || '');
            formData.append('suspect_mobile', suspectMobile || '');
            formData.append('suspect_email', suspectEmail || '');

            formData.append('suspect_email', suspectEmail || '');

            // Removed National ID append logic

            if (evidenceImage) {
                const filename = evidenceImage.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('evidence', { uri: evidenceImage, name: filename, type } as any);
            }

            if (suspectPhotoImage) {
                const filename = suspectPhotoImage.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('suspect_photo', { uri: suspectPhotoImage, name: filename, type } as any);
            }


            const response = await fetch(`${API_URL}/reports`, {
                method: 'POST',
                // Let fetch handle the Content-Type header with the boundary
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Report Submitted Successfully!');
                router.back();
            } else {
                Alert.alert('Error', data.error || 'Failed to submit report');
            }
        } catch (error) {
            console.error('Report submission error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderHeader = (title: string, icon: any) => (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
                {icon}
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Report Incident</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.pageSubtitle}>
                    Please provide accurate details
                    {'\n'}
                    <Text style={{ fontWeight: 'bold', color: Colors.light.error, fontSize: 13 }}>
                        Note: This record is for only for records.
                    </Text>
                </Text>

                {/* Mandatory Information */}
                <View style={styles.card}>
                    {renderHeader('Mandatory Information', <MaterialIcons name="error-outline" size={20} color="#FFF" />)}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>1. Incident Type <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setTypeModalVisible(true)}
                        >
                            <Text style={[styles.dropdownText, !incidentType && { color: '#9CA3AF' }]}>
                                {incidentType || 'Select Incident Type'}
                            </Text>
                            <Feather name="chevron-down" size={20} color={Colors.light.icon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>2. Incident Date and Time <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY HH:MM"
                            placeholderTextColor="#9CA3AF"
                            value={incidentDate}
                            onChangeText={setIncidentDate}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>3. Incident Details <Text style={styles.required}>*</Text></Text>
                        <Text style={styles.helperText}>(Minimum 50 characters, no special chars)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe strictly what happened..."
                            placeholderTextColor="#9CA3AF"
                            value={incidentDetails}
                            onChangeText={setIncidentDetails}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                        <Text style={{ textAlign: 'right', color: incidentDetails.length < 50 ? Colors.light.error : Colors.light.icon, fontSize: 12 }}>
                            {incidentDetails.length} / 50 min
                        </Text>
                    </View>

                    {/* National ID section removed as per requirement */}
                </View>

                {/* Financial Fraud Section */}
                <View style={styles.card}>
                    <View style={styles.switchHeader}>
                        {renderHeader('Financial Fraud Details', <MaterialIcons name="attach-money" size={20} color="#FFF" />)}
                        <Switch
                            value={isFinancialFraud}
                            onValueChange={setIsFinancialFraud}
                            trackColor={{ false: "#767577", true: Colors.light.primary }}
                        />
                    </View>

                    {isFinancialFraud && (
                        <View style={styles.animatedSection}>
                            <Text style={styles.sectionDescription}>Please keep the following info ready:</Text>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>Bank/Wallet Name</Text>
                                    <TextInput style={styles.input} value={bankName} onChangeText={setBankName} placeholder="e.g. SBI, Paytm" placeholderTextColor="#9CA3AF" />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Fraud Amount</Text>
                                    <TextInput style={styles.input} value={fraudAmount} onChangeText={setFraudAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#9CA3AF" />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>12-digit Transaction ID / UTR No.</Text>
                                <TextInput style={styles.input} value={transactionId} onChangeText={setTransactionId} placeholder="Transaction Ref No" placeholderTextColor="#9CA3AF" />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Date of Transaction</Text>
                                <TextInput style={styles.input} value={transactionDate} onChangeText={setTransactionDate} placeholder="DD/MM/YYYY" placeholderTextColor="#9CA3AF" />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Evidence (Upload)</Text>
                                <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setEvidenceImage)}>
                                    <Feather name={evidenceImage ? "check-circle" : "file-text"} size={24} color={evidenceImage ? Colors.light.success : Colors.light.primary} />
                                    <Text style={[styles.uploadText, evidenceImage && { color: Colors.light.success }]}>
                                        {evidenceImage ? "Evidence Image Selected" : "Upload Screenshots/Receipts"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Optional Information */}
                <View style={styles.card}>
                    {renderHeader('Optional / Desirable Info', <MaterialIcons name="person-search" size={20} color="#FFF" />)}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Suspected Website / Social Media URL</Text>
                        <TextInput style={styles.input} value={suspectUrl} onChangeText={setSuspectUrl} placeholder="https://..." placeholderTextColor="#9CA3AF" />
                    </View>

                    <Text style={[styles.label, { marginTop: 10, marginBottom: 10 }]}>Suspect Details (if available)</Text>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <TextInput style={styles.input} value={suspectMobile} onChangeText={setSuspectMobile} placeholder="Mobile No" keyboardType="phone-pad" placeholderTextColor="#9CA3AF" />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <TextInput style={styles.input} value={suspectEmail} onChangeText={setSuspectEmail} placeholder="Email ID" keyboardType="email-address" placeholderTextColor="#9CA3AF" />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Suspect Photograph</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setSuspectPhotoImage)}>
                            <Feather name={suspectPhotoImage ? "check-circle" : "image"} size={24} color={suspectPhotoImage ? Colors.light.success : Colors.light.primary} />
                            <Text style={[styles.uploadText, suspectPhotoImage && { color: Colors.light.success }]}>
                                {suspectPhotoImage ? "Photo Selected" : "Upload Suspect Photo"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, (isSubmitting || !userId) && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={isSubmitting || !userId}
                >
                    <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Submit Report'}</Text>
                    {!isSubmitting && <Ionicons name="send" size={20} color="#FFF" style={{ marginLeft: 8 }} />}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modal for Incident Types */}
            {typeModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Incident Type</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {loadingTypes ? (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <Text>Loading...</Text>
                                </View>
                            ) : (
                                incidentTypes.map((type, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.modalOption}
                                        onPress={() => handleTypeSelect(type)}
                                    >
                                        <Text style={[styles.modalOptionText, incidentType === type && { color: Colors.light.primary, fontWeight: 'bold' }]}>
                                            {type}
                                        </Text>
                                        {incidentType === type && <Feather name="check" size={20} color={Colors.light.primary} />}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setTypeModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        marginRight: 15,
        padding: 4,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    content: {
        padding: 20,
    },
    pageSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        marginBottom: 20,
        lineHeight: 20,
    },
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    switchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    animatedSection: {
        marginTop: 10,
    },
    sectionDescription: {
        fontSize: 14,
        color: Colors.light.icon,
        marginBottom: 16,
        fontStyle: 'italic',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    required: {
        color: Colors.light.error,
    },
    helperText: {
        fontSize: 12,
        color: Colors.light.icon,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: Colors.light.text,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
    },
    uploadText: {
        marginLeft: 10,
        color: Colors.light.primary,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
    },
    submitButton: {
        backgroundColor: Colors.light.error, // Red for prominence/urgency of reporting
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 14,
        shadowColor: Colors.light.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    dropdownButton: {
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.light.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 15,
        color: Colors.light.text,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: Colors.light.text,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#4B5563',
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#4B5563',
        fontWeight: '600',
    },
});
