import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';

import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';

// Import the style object you created
import { LabStyles } from '../components/styles';

export default function LabScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  // 1. Unified State
  const [image, setImage] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  
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

  // 2. Helper Functions
  const updateSetting = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));
  const resetSettings = () => setSettings(initialSettings);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert("Camera access is required.");
      return;
    }

    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      // Fallback for browsers that don't support direct camera launch
      let libraryResult = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });
      if (!libraryResult.canceled) {
        setImage(libraryResult.assets[0].uri);
      }
    }
  };

  const getFilterValues = () => {
    const b = 1 + (settings.brightness / 100) + (settings.exposure / 100);
    const c = 1 + (settings.contrast / 100);
    const s = 1 + (settings.saturation / 100);
    const blurPx = settings.blur;
    return `brightness(${b}) contrast(${c}) saturate(${s}) sepia(${settings.warmth / 100}) hue-rotate(${settings.tint}deg) grayscale(${settings.grayscale / 100}) invert(${settings.invert / 100}) blur(${blurPx}px)`;
  };

  const generateFilterString = () => {
    if (Platform.OS !== 'web' || !image) return {};
    const filters = getFilterValues();
    return { filter: filters, WebkitFilter: filters };
  };

  const renderSlider = (label, key, min, max, step = 1) => (
    <View style={LabStyles.sliderRow} key={key}>
      <View style={LabStyles.labelRow}>
        <Text style={LabStyles.controlText}>{label.toUpperCase()}</Text>
        <Text style={LabStyles.valueText}>{settings[key].toFixed(0)}</Text>
      </View>
      <Slider
        style={LabStyles.slider}
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
    <SafeAreaView style={LabStyles.container}>
      <View style={LabStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={LabStyles.backText}>← EXIT_LAB</Text>
        </TouchableOpacity>
        <Text style={LabStyles.headerTitle}>LABORATORY_01</Text>
      </View>

      <ScrollView contentContainerStyle={LabStyles.scrollContent}>
        <View style={LabStyles.card}>
          <Text style={LabStyles.cardLabel}>PRIMARY_VISUALIZER</Text>
          <TouchableOpacity onPress={pickImage} style={LabStyles.visualizer}>
            {image ? (
              <Image source={{ uri: image }} style={[LabStyles.img, generateFilterString()]} />
            ) : (
              <Text style={LabStyles.placeholder}>[ TAP_TO_ACTIVATE_CAMERA ]</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={LabStyles.card}>
          <View style={LabStyles.cardHeader}>
            <Text style={LabStyles.cardLabel}>ADJUSTMENTS</Text>
            <TouchableOpacity onPress={resetSettings}>
              <Text style={LabStyles.resetText}>RESET</Text>
            </TouchableOpacity>
          </View>
          {renderSlider("Exposure", "exposure", -100, 100)}
          {renderSlider("Contrast", "contrast", -100, 100)}
          {renderSlider("Brightness", "brightness", -100, 100)}
          {renderSlider("Blur", "blur", 0, 20)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}