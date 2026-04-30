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

import navigation from '../navigation/AppNavigator';

// Use curly braces to pick the specific object you need
import { HomeScreenStyles as styles } from '../components/styles';

export default function HomeScreen({ navigation }) {

    const handleGetStarted = () => {
        if (Platform.OS === 'web') {
            navigation.navigate('Lab');
        } else {
            Alert.alert(
                "INITIALIZE TERMINAL",
                "Open Laboratory for image processing?",
                [
                    { text: "CANCEL", style: "cancel" },
                    { text: "OPEN", onPress: () => navigation.navigate('Lab') }
                ]
            );
        }
    };

    const goHome = () => {
        navigation.navigate('Home');
    }

    return (
        <ScrollView stickyHeaderIndices={[0]} style={styles.websiteContent}>
            {/* 1. Sticky Navbar */}
            <View style={styles.navbar}>
                <Text style={styles.navLogo}>ECHO LENS</Text>
                <View style={styles.navLinks}>
                    <Text style={styles.navText}>Products</Text>
                    <Text style={styles.navText}>About</Text>
                </View>
                <TouchableOpacity style={styles.navButton} onPress={goHome}>
                    <Text style={styles.navButtonText}>Home</Text>
                </TouchableOpacity>
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