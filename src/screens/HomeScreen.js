import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Platform, // Standard React Native Alert
} from 'react-native';

// REMOVED: import AppNavigator from '../navigation/AppNavigator'; 
// Reason: This causes a circular dependency and isn't needed here.

export default function HomeScreen({ navigation }) {

    const handleGetStarted = () => {
        if (Platform.OS === 'web') {
            // Simple browser alert for Web
            const confirmEntry = window.confirm("Ready to explore? You are about to enter the Echo Lens Lab.");
            if (confirmEntry) {
                navigation.navigate('Lab');
            }
        } else {
            // Fancy native alert for iOS/Android
            Alert.alert(
                "Ready to explore?",
                "You are about to enter the Echo Lens Lab.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => navigation.navigate('Lab') }
                ]
            );
        }
    };

    return (
        <ScrollView stickyHeaderIndices={[0]} style={styles.websiteContent}>
            {/* 1. Sticky Navbar */}
            <View style={styles.navbar}>
                <Text style={styles.navLogo}>ECHO LENS</Text>
                <View style={styles.navLinks}>
                    <Text style={styles.navText}>Products</Text>
                    <Text style={styles.navText}>About</Text>
                </View>
            </View>

            {/* 2. Hero Section */}
            <View style={styles.heroSection}>
                <Text style={styles.webTitle}>The Future of Vision</Text>
                <Text style={styles.webBody}>
                    Experience AI-driven insights integrated directly into your workflow.
                </Text>

                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.ctaText}>Get Started</Text>
                </TouchableOpacity>
            </View>

            {/* 3. Features Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Key Features</Text>

                <View style={styles.featureCard}>
                    <Image
                        source={{ uri: 'https://picsum.photos/seed/tech/400/200' }}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Intelligent Analysis</Text>
                        <Text style={styles.cardDescription}>
                            Ask questions about what you see and get instant, math-accurate responses.
                        </Text>
                    </View>
                </View>

                <View style={styles.featureCard}>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>24/7 Support</Text>
                        <Text style={styles.cardDescription}>
                            Our AI assistant is always online, pinned to your screen for immediate help.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ height: 120 }} />
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    websiteContent: { flex: 1, backgroundColor: '#fff' },

    // Navbar Styles
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    navLogo: { fontSize: 18, fontWeight: '900', color: '#007AFF', letterSpacing: 1 },
    navLinks: { flexDirection: 'row' },
    navText: { marginLeft: 15, color: '#666', fontWeight: '500' },

    // Hero Section Styles
    heroSection: {
        padding: 40,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    webTitle: { fontSize: 32, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 10 },
    webBody: { fontSize: 16, color: '#444', lineHeight: 24, textAlign: 'center' },
    ctaButton: {
        marginTop: 25,
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    ctaText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Features Styles
    sectionContainer: { padding: 20 },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a' },
    featureCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
        elevation: 4, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardImage: { width: '100%', height: 160 },
    cardContent: { padding: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    cardDescription: { color: '#666', marginTop: 8, lineHeight: 22 },
});