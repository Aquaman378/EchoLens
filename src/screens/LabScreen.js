import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Platform
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

export default function LabScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);

  const pickImage = async () => {
    // 1. Request Permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      const msg = "Camera access is required to use the visualizer.";
      Platform.OS === 'web' ? alert(msg) : Alert.alert("Permission Denied", msg);
      return;
    }

    // 2. Launch Camera (or File Picker on Web automatically)
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera Error: ", error);
      // Fallback for Web if launchCamera isn't supported by the browser
      if (Platform.OS === 'web') {
        let libraryResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!libraryResult.canceled) {
          setImage(libraryResult.assets[0].uri);
        }
      }
    }
  };

  const saveAdjustments = () => {
    // For now, we "save" the state to a local variable or alert
    const currentSettings = {
      brightness: brightness,
      contrast: contrast,
      imageUri: image
    };

    console.log("Saving Lab Configuration:", currentSettings);

   if (Platform.OS === 'web') {
     alert(
       "Current session adjustments have been locked.",
       `Adjustments (B: ${(brightness * 100).toFixed(0)}%, C: ${(contrast * 100).toFixed(0)}%) have been locked to the current session.`,
       [{ text: "ACKNOWLEDGE", onPress: () => console.log("Save Acknowledged") }]
     );
   } else {
     Alert.alert(
       "LAB_STATE_SAVED",
       `Adjustments (B: ${(brightness * 100).toFixed(0)}%, C: ${(contrast * 100).toFixed(0)}%) have been locked to the current session.`,
       [{ text: "ACKNOWLEDGE", onPress: () => console.log("Save Acknowledged") }]
        
     );
   }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← EXIT_LAB</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>LABORATORY_01</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>SYSTEM_ACTIVE</Text>
          </View>
        </View>
      </View>

      {/* FIXED: Ensured all Views inside ScrollView are properly closed */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>

        {/* 2. Primary Lens Display */}
        <View style={[styles.card, styles.largeCard]}>
          <Text style={styles.cardLabel}>PRIMARY_VISUALIZER</Text>
          <TouchableOpacity onPress={pickImage} style={styles.visualizerContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={[styles.mainImage, { opacity: brightness }]}
              />
            ) : (
              <View style={styles.placeholderVisualizer}>
                <Text style={styles.placeholderText}>[ TAP_TO_ACTIVATE_CAMERA ]</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 3. Image Adjustments */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>IMAGE_ADJUSTMENTS</Text>
          <View style={styles.controlRow}>
            <Text style={styles.controlText}>BRIGHTNESS</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => setBrightness(b => Math.max(0.1, b - 0.1))} style={styles.adjButton}>
                <Text style={styles.adjText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.valueText}>{(brightness * 100).toFixed(0)}%</Text>
              <TouchableOpacity onPress={() => setBrightness(b => Math.min(2, b + 0.1))} style={styles.adjButton}>
                <Text style={styles.adjText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
      {/*Save/Lock Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveAdjustments}
      >
        <Text style={styles.saveButtonText}>CONFIRM_AND_LOCK_SETTINGS</Text>
      </TouchableOpacity>
        {/* 4. AI Confidence Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>AI_CONFIDENCE_SCORE</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '94.2%' }]} />
          </View>
          <Text style={styles.percentageText}>94.2%</Text>
        </View>
      </ScrollView>

      {/* 5. Lens Selector Dock */}
      <View style={styles.dock}>
        {['THERMAL', 'DATA', 'ECHO'].map((mode) => (
          <TouchableOpacity key={mode} style={styles.dockButton}>
            <Text style={styles.dockButtonText}>{mode}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// Styles remain exactly the same as before
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backButton: { paddingVertical: 10 },
  backText: { color: '#007AFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  headerTitleContainer: { alignItems: 'flex-end' },
  headerTitle: { color: '#007AFF', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { color: '#555', fontSize: 9, fontWeight: 'bold' },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF41', marginRight: 6 },
  gridContainer: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: '#141414', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  largeCard: { height: 320 },
  cardLabel: { color: '#444', fontSize: 10, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  visualizerContainer: { flex: 1, borderRadius: 8, overflow: 'hidden' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  placeholderVisualizer: { flex: 1, backgroundColor: '#0F0F0F', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#007AFF', fontSize: 9, letterSpacing: 1, fontWeight: 'bold' },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  controlText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row', alignItems: 'center' },
  adjButton: { backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginHorizontal: 8 },
  adjText: { color: '#007AFF', fontWeight: 'bold' },
  valueText: { color: '#fff', fontSize: 12, minWidth: 40, textAlign: 'center' },
  progressBarBg: { height: 4, backgroundColor: '#222', borderRadius: 2, marginTop: 10 },
  progressBarFill: { height: 4, backgroundColor: '#007AFF', borderRadius: 2 },
  percentageText: { color: '#007AFF', textAlign: 'right', marginTop: 5, fontSize: 12, fontWeight: 'bold' },
  dock: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'rgba(26, 26, 26, 0.9)', height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  dockButton: { padding: 10 },
  dockButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  saveButton: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0056b3'
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2
  },
});