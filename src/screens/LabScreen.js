import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

export default function LabScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  // 1. LIMIT TO TOP 6 ESSENTIAL CONTROLS
  const [settings, setSettings] = useState({
    exposure: 0,
    contrast: 0,
    brightness: 0,
    saturation: 0,
    warmth: 0,
    tint: 0,
  });

  const updateSetting = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  // 2. FILTER STRING FOR LIVE PREVIEW
  const generateFilterString = () => {
    if (Platform.OS !== 'web' || !image) return {};

    const b = 1 + (settings.brightness / 100) + (settings.exposure / 100);
    const c = 1 + (settings.contrast / 100);
    const s = 1 + (settings.saturation / 100);
    const sepia = Math.max(0, settings.warmth / 100);

    return {
      filter: `brightness(${b}) contrast(${c}) saturate(${s}) sepia(${sepia}) hue-rotate(${settings.tint}deg)`,
      WebkitFilter: `brightness(${b}) contrast(${c}) saturate(${s}) sepia(${sepia}) hue-rotate(${settings.tint}deg)`,
    };
  };

  // 3. SAVE TO DEVICE (WEB DOWNLOAD)
  const saveImage = () => {
  if (!image) return alert("No image to save!");

  if (Platform.OS === 'web') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const b = 1 + (settings.brightness / 100) + (settings.exposure / 100);
      const c = 1 + (settings.contrast / 100);
      const s = 1 + (settings.saturation / 100);
      const sepia = Math.max(0, settings.warmth / 100);

      ctx.filter = `
        brightness(${b})
        contrast(${c})
        saturate(${s})
        sepia(${sepia})
        hue-rotate(${settings.tint}deg)
      `;

      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'edited-lab-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
  } else {
    alert("Save feature for mobile requires expo-media-library.");
  }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← EXIT</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LAB_01</Text>
        <TouchableOpacity onPress={saveImage} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.wrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>

          <View style={[styles.card, isDesktop && { flex: 1.2 }]}>
            <TouchableOpacity onPress={async () => {
              let res = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
              if (!res.canceled) setImage(res.assets[0].uri);
            }} style={styles.visualizer}>
              {image ? (
                <Image source={{ uri: image }} style={[styles.img, generateFilterString()]} />
              ) : (
                <Text style={styles.placeholder}>[ IMPORT_DATA ]</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.card, isDesktop && { flex: 1 }]}>
            <Text style={styles.cardLabel}>ADJUSTMENTS</Text>
            {renderSlider("Exposure", "exposure", -100, 100)}
            {renderSlider("Contrast", "contrast", -100, 100)}
            {renderSlider("Brightness", "brightness", -100, 100)}
            {renderSlider("Saturation", "saturation", -100, 100)}
            {renderSlider("Warmth", "warmth", -100, 100)}
            {renderSlider("Tint", "tint", -100, 100)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', height: Platform.OS === 'web' ? '100vh' : '100%' },
  header: { height: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#007AFF', fontWeight: '900', letterSpacing: 2 },
  backText: { color: '#444', fontSize: 10, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  saveBtnText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  wrapper: { width: '100%', maxWidth: 1000, alignSelf: 'center', gap: 20 },
  card: { backgroundColor: '#141414', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  cardLabel: { color: '#444', fontSize: 10, fontWeight: 'bold', marginBottom: 15 },
  visualizer: { width: '100%', aspectRatio: 4 / 3, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%', resizeMode: 'contain' },
  placeholder: { color: '#007AFF', fontSize: 10, fontWeight: 'bold' },
  sliderRow: { marginVertical: 10 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  controlText: { color: '#888', fontSize: 9, fontWeight: 'bold' },
  valueText: { color: '#007AFF', fontSize: 10, fontWeight: 'bold' },
  slider: { width: '100%', height: 30 },
});