import React, { useState } from 'react';
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
import QRCode from 'react-native-qrcode-svg'; // Ensure this is installed

export default function LabScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  const initialSettings = {
    exposure: 0,
    contrast: 0,
    brightness: 0,
    saturation: 0,
    warmth: 0,
    tint: 0,
    blur: 0,
    grayscale: 0,
    invert: 0,
  };

  const [settings, setSettings] = useState(initialSettings);

  const updateSetting = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));
  const resetSettings = () => setSettings(initialSettings);

  const getFilterValues = () => {
    const b = 1 + (settings.brightness / 100) + (settings.exposure / 100);
    const c = 1 + (settings.contrast / 100);
    const s = 1 + (settings.saturation / 100);
    const sepia = Math.max(0, settings.warmth / 100);
    const gray = settings.grayscale / 100;
    const inv = settings.invert / 100;
    const blurPx = settings.blur;
    return `brightness(${b}) contrast(${c}) saturate(${s}) sepia(${sepia}) hue-rotate(${settings.tint}deg) grayscale(${gray}) invert(${inv}) blur(${blurPx}px)`;
  };

  const generateFilterString = () => {
    if (Platform.OS !== 'web' || !image) return {};
    const filters = getFilterValues();
    return { filter: filters, WebkitFilter: filters };
  };

  // --- ZENO CLOUD DISPATCH LOGIC ---
  const handleDispatch = () => {
    if (!image) return alert("SELECT IMAGE BEFORE DISPATCH");
    const sessionID = Math.random().toString(36).substring(7);
    setGeneratedLink(`https://echo-lens.cloud/share/${sessionID}`);
    setIsSharing(true);
  };

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
        ctx.filter = getFilterValues();
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `lab-export-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
    }
  };

  const renderSlider = (label, key, min, max, step = 1) => (
    <View style={styles.sliderRow} key={key}>
      <View style={styles.labelRow}>
        <Text style={styles.controlText}>{label.toUpperCase()}</Text>
        <Text style={styles.valueText}>{settings[key].toFixed(0)}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← EXIT</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LAB_01</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={handleDispatch} style={[styles.saveBtn, { backgroundColor: '#FF007A' }]}>
            <Text style={styles.saveBtnText}>SHARE_LINK</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveImage} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>SAVE_IMAGE</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.wrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          {/* IMAGE PREVIEW */}
          <View style={[styles.card, isDesktop && { flex: 1.2, alignSelf: 'flex-start' }]}>
            <TouchableOpacity onPress={async () => {
              let res = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
              if (!res.canceled) setImage(res.assets[0].uri);
            }} style={styles.visualizer}>
              {image ? (
                <Image source={{ uri: image }} style={[styles.img, generateFilterString()]} />
              ) : (
                <Text style={styles.placeholder}>[ IMPORT_SOURCE_DATA ]</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* SLIDERS */}
          <View style={[styles.card, isDesktop && { flex: 1 }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>ADJUSTMENTS</Text>
              <TouchableOpacity onPress={resetSettings}>
                <Text style={styles.resetText}>RESET</Text>
              </TouchableOpacity>
            </View>
            {renderSlider("Exposure", "exposure", -100, 100)}
            {renderSlider("Contrast", "contrast", -100, 100)}
            {renderSlider("Brightness", "brightness", -100, 100)}
            {renderSlider("Saturation", "saturation", -100, 100)}
            {renderSlider("Warmth", "warmth", -100, 100)}
            {renderSlider("Tint", "tint", -100, 100)}
            {renderSlider("Blur", "blur", 0, 20)}
            {renderSlider("Grayscale", "grayscale", 0, 100)}
            {renderSlider("Invert", "invert", 0, 100)}
          </View>
        </View>
      </ScrollView>

      {/* ZENO-STYLE DISPATCH MODAL */}
      {isSharing && (
        <View style={styles.shareOverlay}>
          <View style={styles.shareModal}>
            <Text style={styles.modalHeader}>CLOUD_DISPATCH_PROTOCOL</Text>
            <View style={styles.qrWrapper}>
              <QRCode value={generatedLink} size={160} color="#007AFF" backgroundColor="white" />
            </View>
            <Text style={styles.linkDisplay}>{generatedLink}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => {
                  if(Platform.OS === 'web') navigator.clipboard.writeText(generatedLink);
                  alert("LINK_COPIED");
                }}
              >
                <Text style={styles.actionBtnText}>COPY_URL</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#222' }]} 
                onPress={() => setIsSharing(false)}
              >
                <Text style={styles.actionBtnText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  actionBtnText: { color: '#FFF', fontSize: 10, fontWeight: '900' }
});