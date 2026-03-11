import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
} from 'react-native';

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

    return (
        <View style={styles.mainContainer}>
            <ScrollView stickyHeaderIndices={[0]} style={styles.websiteContent}>
                
                {/* NAVIGATION - Glassmorphism with Blue Tint */}
                <View style={styles.navbar}>
                    <Text style={styles.navLogo}>ECHO_<Text style={styles.brandBlue}>LENS</Text></Text>
                    <View style={styles.statusGroup}>
                        <View style={styles.statusPill}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.statusText}>LIVE_LINK</Text>
                        </View>
                    </View>
                </View>

                {/* HERO SECTION - Deep Gradient Background */}
                <View style={styles.heroSection}>
                    <View style={styles.accentGlow} />
                    <Text style={styles.webTitle}>IMAGE_DIGESTION_UNIT</Text>
                    <Text style={styles.heroSubText}>PRECISION_EDITING_FOR_THE_VISUAL_ARTIST</Text>
                    
                    <Text style={styles.webBody}>
                        Accelerate your post-production. Non-destructive pixel manipulation 
                        powered by low-latency hardware acceleration.
                    </Text>

                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={handleGetStarted}
                    >
                        <Text style={styles.ctaText}>START_PROCESSING_PROTOCOL</Text>
                    </TouchableOpacity>
                </View>

                {/* COLORFUL STATS BAR */}
                <View style={styles.statsBar}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, {color: '#00F0FF'}]}>4K+</Text>
                        <Text style={styles.statLabel}>RESOLUTION</Text>
                    </View>
                    <View style={[styles.statItem, styles.statBorder]}>
                        <Text style={[styles.statValue, {color: '#FFD700'}]}>RAW</Text>
                        <Text style={styles.statLabel}>ENGINE</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, {color: '#FF007A'}]}>120</Text>
                        <Text style={styles.statLabel}>FPS_SYNC</Text>
                    </View>
                </View>

                {/* PROTOCOLS SECTION */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>CORE_SYSTEM_MODULES</Text>

                    <View style={styles.protocolRow}>
                        {/* Blue Module */}
                        <View style={[styles.protocolCard, {borderColor: '#007AFF33'}]}>
                            <View style={[styles.colorBar, {backgroundColor: '#007AFF'}]} />
                            <Text style={styles.protocolTitle}>CHROMATIC_BALANCE</Text>
                            <Text style={styles.protocolDesc}>
                                High-fidelity color correction with real-time histogram feedback.
                            </Text>
                        </View>

                        {/* Teal Module */}
                        <View style={[styles.protocolCard, {borderColor: '#00F0FF33'}]}>
                            <View style={[styles.colorBar, {backgroundColor: '#00F0FF'}]} />
                            <Text style={[styles.protocolTitle, {color: '#00F0FF'}]}>LUMINANCE_CONTROL</Text>
                            <Text style={styles.protocolDesc}>
                                Precision exposure mapping and shadow recovery algorithms.
                            </Text>
                        </View>

                        {/* Gold Module */}
                        <View style={[styles.protocolCard, {borderColor: '#FFD70033'}]}>
                            <View style={[styles.colorBar, {backgroundColor: '#FFD700'}]} />
                            <Text style={[styles.protocolTitle, {color: '#FFD700'}]}>INSTANT_DISPATCH</Text>
                            <Text style={styles.protocolDesc}>
                                Export optimized assets directly to local storage in standard formats.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>SYNC_STATUS: <Text style={{color: '#00FF41'}}>OPTIMIZED</Text></Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#020204' },
    websiteContent: { flex: 1 },

    // Navbar
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(5, 5, 10, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A2E',
    },
    navLogo: { fontSize: 16, fontWeight: '900', color: '#FFF', letterSpacing: 3 },
    brandBlue: { color: '#007AFF' },
    statusPill: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#00FF4115', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00FF4133'
    },
    onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF41', marginRight: 8 },
    statusText: { color: '#00FF41', fontSize: 9, fontWeight: '900' },

    // Hero
    heroSection: {
        paddingVertical: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#05050A',
        overflow: 'hidden',
    },
    accentGlow: {
        position: 'absolute',
        top: -100,
        width: 400,
        height: 400,
        backgroundColor: '#007AFF15',
        borderRadius: 200,
        filter: Platform.OS === 'web' ? 'blur(80px)' : 'none',
    },
    webTitle: { fontSize: 48, fontWeight: '900', color: '#FFF', textAlign: 'center', letterSpacing: -1 },
    heroSubText: { color: '#007AFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 4, marginTop: 10 },
    webBody: { 
        fontSize: 15, 
        color: '#8E8E93', 
        textAlign: 'center', 
        marginTop: 25, 
        maxWidth: 600,
        lineHeight: 24 
    },
    ctaButton: {
        marginTop: 50,
        backgroundColor: '#007AFF',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 4,
        shadowColor: '#007AFF',
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    ctaText: { color: '#FFF', fontWeight: '900', fontSize: 13, letterSpacing: 2 },

    // Colorful Stats Bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#0A0A10',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#1A1A2E',
        paddingVertical: 30,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1A1A2E' },
    statValue: { fontSize: 24, fontWeight: '900' },
    statLabel: { color: '#444', fontSize: 10, fontWeight: 'bold', marginTop: 6, letterSpacing: 1 },

    // Protocols
    sectionContainer: { padding: 40 },
    sectionHeader: { color: '#333', fontSize: 11, fontWeight: '900', letterSpacing: 4, marginBottom: 30 },
    protocolRow: { gap: 20 },
    protocolCard: { 
        backgroundColor: '#0D0D15', 
        padding: 30, 
        borderRadius: 8, 
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden'
    },
    colorBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    protocolTitle: { color: '#007AFF', fontSize: 15, fontWeight: '900', marginBottom: 12, letterSpacing: 1 },
    protocolDesc: { color: '#777', fontSize: 13, lineHeight: 22 },

    footer: { padding: 60, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#111' },
    footerText: { color: '#333', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 }
});