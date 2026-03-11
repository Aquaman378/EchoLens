import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  useWindowDimensions,
  SafeAreaView,
  safeAreaContext,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

export default function LabScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  const [settings, setSettings] = useState({
    exposure: 0,     
    brilliance: 0,  
    highlights: 0, 
    shadows: 0,    
    contrast: 0,    
    brightness: 0,  
    blackPoint: 0,
    saturation: 0,  
    vibrance: 0,    
    warmth: 0,      
    tint: 0,        
    sharpness: 0,  
    definition: 0,  
  });

  // --- IMPROVED FILTER LOGIC ---
  const generateFilterString = () => {
    if (Platform.OS !== 'web' || !image) return {};

    // Map -100/100 ranges to CSS decimal values (0.0 to 2.0)
    const b = 1 + (settings.brightness / 100) + (settings.exposure / 100) + (settings.brilliance / 200);
    const c = 1 + (settings.contrast / 100) + (settings.definition / 200);
    const s = 1 + (settings.saturation / 100) + (settings.vibrance / 200);
    
    // Warmth uses sepia, Tint uses hue-rotate
    const sepia = Math.max(0, settings.warmth / 100);
    const hue = settings.tint;

    // Simulate Highlights/Shadows/Black Point via contrast and brightness curves
    const brightnessOffset = (settings.highlights / 250) + (settings.shadows / 250) + (settings.blackPoint / 300);

    return {
      filter: `brightness(${b + brightnessOffset}) contrast(${c}) saturate(${s}) sepia(${sepia}) hue-rotate(${hue}deg)`,
      WebkitFilter: `brightness(${b + brightnessOffset}) contrast(${c}) saturate(${s}) sepia(${sepia}) hue-rotate(${hue}deg)`,
    };
  };

  const updateSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const saveToDevice = (imgElementId) => {
    const img = document.getElementById(imgElementId);
    fetch(img.src)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = function() {
          localStorage.setItem('savedImage', reader.result); // Save as Base64
          alert("Image saved to localStorage!");
        };
        reader.readAsDataURL(blob);
      })
    .catch(err => console.error("Error saving image:", err));
}

  const pickImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newStatus !== 'granted') return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const renderSlider = (label, key, min, max) => (
    <View style={styles.sliderRow} key={key}>
      <View style={styles.labelRow}>
        <Text style={styles.controlText}>{label.toUpperCase()}</Text>
        <Text style={styles.valueText}>{settings[key].toFixed(0)}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={settings[key]}
        onValueChange={(v) => updateSetting(key, v)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#333"
        thumbTintColor="#007AFF"
      />
    </View>
  );

  return (
    <safeAreaContext style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
      <safeAreaView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.responsiveWrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          <View style={[styles.card, isDesktop ? { flex: 1.5, alignSelf: 'flex-start' } : { width: '100%' }]}>
            <Text style={styles.cardLabel}>PRIMARY_VISUALIZER</Text>
            <TouchableOpacity onPress={pickImage} style={styles.visualizerContainer}>
              {image ? (
                <Image source={{ uri: image }} style={[styles.mainImage, generateFilterString()]} />
              ) : (
                <View style={styles.placeholderVisualizer}>
                  <Text style={styles.placeholderText}>[ SELECT_SOURCE_IMAGE ]</Text>
                </View>
              )}
            </TouchableOpacity>
          </View> 

          <View style={[isDesktop ? { flex: 1 } : { width: '100%' }]}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>IMAGE_ADJUSTMENTS</Text>
              
              {renderSlider("Exposure", "exposure", -100, 100)}
              {renderSlider("Brilliance", "brilliance", -100, 100)}
              {renderSlider("Highlights", "highlights", -100, 100)}
              {renderSlider("Shadows", "shadows", -100, 100)}
              {renderSlider("Contrast", "contrast", -100, 100)}
              {renderSlider("Brightness", "brightness", -100, 100)}
              {renderSlider("Black Point", "blackPoint", -100, 100)}
              {renderSlider("Saturation", "saturation", -100, 100)}
              {renderSlider("Vibrance", "vibrance", -100, 100)}
              {renderSlider("Warmth", "warmth", -100, 100)}
              {renderSlider("Tint", "tint", -100, 100)}
              {renderSlider("Sharpness", "sharpness", 0, 100)}
              {renderSlider("Definition", "definition", 0, 100)}
            </View>\
          </View>
        </View>
      </safeAreaView>
      <View style={[styles.dock, { width: isDesktop ? 450 : '90%', alignSelf: 'center' }]}>
        {['THERMAL', 'DATA', 'ECHO'].map((mode) => (
          <TouchableOpacity key={mode} style={styles.dockButton}>
            <Text style={styles.dockButtonText}>{mode}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </safeAreaContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    backgroundColor: '#0A0A0A',
    zIndex: 10,
  },

  backText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  headerTitleContainer: {
    alignItems: 'flex-end',
  },

  headerTitle: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  statusText: {
    color: '#555',
    fontSize: 9,
    fontWeight: 'bold',
  },

  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF41',
    marginRight: 6,
  },

  scrollView: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 200,
    alignItems: 'center',
    flexGrow: 1,
  },

  responsiveWrapper: {
    width: '100%',
    maxWidth: 1200,
    gap: 20,
  },

  card: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 15,
  },

  cardLabel: {
    color: '#444',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 1,
  },

  visualizerContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  placeholderVisualizer: {
    flex: 1,
    minHeight: 250,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#333',
  },

  placeholderText: {
    color: '#007AFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  sliderRow: {
    marginVertical: 10,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  controlText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },

  valueText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  slider: {
    width: '100%',
    height: 30,
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  dock: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(20,20,20,0.95)',
    height: 65,
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 20,
    zIndex: 100,
  },

  dockButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  dockButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});