import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/theme';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

import TextSlider from '../../../components/TextSlider';

type FeatureRoute = "/chatbot" | "/report-incident" | "/my-reports" | "/emergency-contacts" | "/awareness" | "/recovery-guides";

const sliderData = [
  {
    id: 1,
    title: 'Protect Your Password',
    description: 'Use strong, unique passwords and enable two-factor authentication whenever possible.',
    backgroundColor: '#3B82F6', // Blue-500
  },
  {
    id: 2,
    title: 'Beware of Phishing',
    description: 'Do not click on suspicious links or download attachments from unknown senders.',
    backgroundColor: '#EF4444', // Red-500
  },
  {
    id: 3,
    title: 'Update Regularly',
    description: 'Keep your software and operating systems updated to patch security vulnerabilities.',
    backgroundColor: '#10B981', // Emerald-500
  },
  {
    id: 4,
    title: 'Report Incidents',
    description: 'If you suspect a cyber crime, report it immediately using this app.',
    backgroundColor: '#F59E0B', // Amber-500
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [username, setUsername] = useState('User');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        // data.user from login has { id, username, email }
        if (user.username) {
          setUsername(user.username);
        }
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const features: Array<{ id: number; title: string; subtitle: string; image: any; route: FeatureRoute; color: string }> = [
    {
      id: 1,
      title: 'Report Incident',
      subtitle: 'Submit a new report',
      image: require('../../../assets/images/complaint.jpg'),
      route: '/report-incident',
      color: '#EF4444', // Red-500
    },
    {
      id: 2,
      title: 'My Reports',
      subtitle: 'View status & history',
      image: require('../../../assets/images/myreport.jpg'),
      route: '/my-reports',
      color: '#3B82F6', // Blue-500
    },
    {
      id: 3,
      title: 'Emergency Contacts',
      subtitle: 'Helplines & Support',
      image: require('../../../assets/images/contactus.jpg'),
      route: '/emergency-contacts',
      color: '#F59E0B', // Amber-500
    },
    {
      id: 4,
      title: 'Awareness',
      subtitle: 'Tips & News',
      image: require('../../../assets/images/awarness.jpg'),
      route: '/awareness',
      color: '#8B5CF6', // Violet-500
    },
    {
      id: 5,
      title: 'Recovery Guide',
      subtitle: 'Steps to recover',
      image: require('../../../assets/images/guide.jpg'),
      route: '/recovery-guides',
      color: '#10B981', // Emerald-500
    },
    {
      id: 6,
      title: 'AI Chatbot',
      subtitle: 'Get instant help',
      image: require('../../../assets/images/Aichatbot.jpg'),
      route: '/chatbot',
      color: '#EC4899', // Pink-500
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={styles.menuButton}
            >
              <Feather name="menu" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.username} numberOfLines={1}>{username}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(drawer)/notifications')}>
              <Feather name="bell" size={24} color={Colors.light.text} />
              <View style={styles.badge} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileButton}>
              <View style={styles.avatarContainer}>
                <Feather name="user" size={20} color={Colors.light.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Introduction Section */}
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Introduction</Text>
          <Text style={styles.introText}>
            Welcome to CyberSafe! We are dedicated to providing you with the latest tools and information to keep your digital life secure.
          </Text>
        </View>

        {/* Main Headline */}
        <Text style={styles.mainHeadline}>Cyber Safety Awareness</Text>

        {/* Text Slider */}
        <TextSlider data={sliderData} />

        {/* Features Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          {features.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.iconContainer}>
                <Image source={item.image} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { textAlign: 'center' }]}>{item.title}</Text>
                <Text style={[styles.cardSubtitle, { textAlign: 'center' }]}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* About Us Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutText}>
            CyberSafe is a community-driven platform established in 2024. Our mission is to educate individuals about digital safety, provide real-time reporting tools, and offer comprehensive support for cybercrime victims.
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => router.push('/support/privacy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>© 2025 CyberSafe. All rights reserved.</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: Colors.light.icon,
    fontWeight: '500',
    marginBottom: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 0,
    backgroundColor: '#EF4444', // Red-500
    borderWidth: 1.5,
    borderColor: Colors.light.card,
  },
  profileButton: {
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF', // Blue-50
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE', // Blue-100
  },
  mainHeadline: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.light.card,
    borderRadius: 0,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center', // Center content horizontally
  },
  iconContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.light.icon,
    lineHeight: 18,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  footerDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  copyright: {
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  version: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  introContainer: {
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 22,
  },
  aboutContainer: {
    marginTop: 32,
    marginBottom: 8,
    padding: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 22,
  },
});