import { StyleSheet, Platform } from 'react-native';

export const LabStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A', height: Platform.OS === 'web' ? '100vh' : '100%' },
    header: { height: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
    headerTitle: { color: '#007AFF', fontWeight: '900', letterSpacing: 2 },
    backText: { color: '#444', fontSize: 10, fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
    saveBtnText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 150 },
    wrapper: { width: '100%', maxWidth: 1100, alignSelf: 'center', gap: 20 },
    card: { backgroundColor: '#141414', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    cardLabel: { color: '#444', fontSize: 10, fontWeight: 'bold' },
    resetText: { color: '#FF3B30', fontSize: 9, fontWeight: 'bold' },
    visualizer: { width: '100%', aspectRatio: 4 / 3, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    img: { width: '100%', height: '100%', resizeMode: 'contain' },
    placeholder: { color: '#007AFF', fontSize: 10, fontWeight: 'bold' },
    sliderRow: { marginVertical: 8 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
    controlText: { color: '#888', fontSize: 9, fontWeight: 'bold' },
    valueText: { color: '#007AFF', fontSize: 10, fontWeight: 'bold' },
    slider: { width: '100%', height: 30 },

    // Modal Styles
    shareOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    shareModal: { width: 300, backgroundColor: '#0A0A0A', padding: 25, borderRadius: 12, borderWidth: 1, borderColor: '#007AFF', alignItems: 'center' },
    modalHeader: { color: '#007AFF', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
    qrWrapper: { padding: 10, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 20 },
    linkDisplay: { color: '#555', fontSize: 11, marginBottom: 20, textAlign: 'center' },
    modalActions: { flexDirection: 'row', gap: 10 },
    actionBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 4 },
    actionBtnText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
});

export const HomeScreenStyles = StyleSheet.create({
    wrapper: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
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
    footerText: { color: '#333', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
    sectionContainer: { padding: 15, paddingHorizontal: 40 },
    sectionTitle: { color: '#333', fontSize: 11, fontWeight: '900', letterSpacing: 4, marginBottom: 30 },
    featureCard: { backgroundColor: '#0D0D15', padding: 30, borderRadius: 8, borderWidth: 1, borderColor: '#222', flexDirection: 'row', gap: 20 },  
    cardImage: { width: 120, height: 80, borderRadius: 4, backgroundColor: '#222' },
    cardContent: { flex: 1 },
    cardTitle: { color: '#007AFF', fontSize: 15, fontWeight: '900', marginBottom: 12, letterSpacing: 1 },
    cardDescription: { color: '#777', fontSize: 13, lineHeight: 22 },

});