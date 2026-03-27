import { StyleSheet, Platform } from 'react-native';

export const LabScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  back: {
    color: '#007AFF',
    fontSize: 18,
  },

  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  reset: {
    color: '#FF3B30',
    fontSize: 12,
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageBox: {
    width: '90%',
    height: '80%',
    backgroundColor: '#111',
    AspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  placeholder: {
    color: '#555',
  },

  sliderStrip: {
    height: 120,
    paddingVertical: 10,
  },

  sliderCard: {
    width: 200,
    marginHorizontal: 10,
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },

  sliderLabel: {
    color: '#aaa',
    marginBottom: 5,
  },

  sliderValue: {
    color: '#007AFF',
    marginTop: 5,
  },

  dock: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },

  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
  },

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

    footer: { padding: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#111' },
    footerText: { color: '#333', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
    sectionContainer: { padding: 15, paddingHorizontal: 40 },
    sectionTitle: { color: '#333', fontSize: 11, fontWeight: '900', letterSpacing: 4, marginBottom: 30 },
    featureCard: { backgroundColor: '#0D0D15', padding: 30, borderRadius: 8, borderWidth: 1, borderColor: '#222', flexDirection: 'row', gap: 20 },  
    cardImage: { width: 120, height: 80, borderRadius: 4, backgroundColor: '#222' },
    cardContent: { flex: 1 },
    cardTitle: { color: '#007AFF', fontSize: 15, fontWeight: '900', marginBottom: 12, letterSpacing: 1 },
    cardDescription: { color: '#777', fontSize: 13, lineHeight: 22 },

});

export const MiniChatStyles = StyleSheet.create({
  // ... Keep your existing styles, but add these:
  welcomeText: { textAlign: 'center', color: '#bbb', marginTop: 20, fontSize: 13 },
  fabIcon: { color: 'white', fontSize: 28 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatOverlay: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 320,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  bubble: { padding: 12, borderRadius: 15, marginBottom: 10, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  chatHeader: { backgroundColor: '#007AFF', padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
  chatHeaderText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  chatBox: { flex: 1, padding: 15 },
  inputArea: { padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  input: { backgroundColor: '#f9f9f9', borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#ddd' },
  loadingText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginBottom: 10 },
});

export const UiSuppleStyles = {
  container: {
    height: 140,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 5,
  },

  title: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },

  reset: {
    color: '#FF3B30',
    fontSize: 12,
  },

  sliderList: {
    paddingHorizontal: 10,
  },

  sliderCard: {
    width: 180,
    marginHorizontal: 8,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 10,
  },

  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  label: {
    color: '#888',
    fontSize: 11,
  },

  value: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },

  slider: {
    width: '100%',
    height: 30,
  },
};