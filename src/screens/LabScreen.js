import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  
} from 'react-native';

import Slider from '@react-native-community/slider';
import UiSupple from '../components/UiSupple';
import * as ImagePicker from 'expo-image-picker';
import { LabScreenStyles } from '../components/styles';


export default function LabScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
  });

  const sliders = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
    { key: 'blur', label: 'Blur', min: 0, max: 20 },
  ];

  const updateSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const resetSettings = () => {
    setSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!image) return Alert.alert("No Image");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Analysis Complete", "Object detected.");
    }, 1500);
  };

  const getFilterStyle = () => {
    if (Platform.OS === 'web') {
      const b = 1 + settings.brightness / 100;
      const c = 1 + settings.contrast / 100;
      const s = 1 + settings.saturation / 100;

      const filters = `
      brightness(${b})
      contrast(${c})
      saturate(${s})
      blur(${settings.blur}px)
    `;

      return {
        filter: filters,
        WebkitFilter: filters,
      };
    }

    // Mobile fallback (limited support)
    return {};
  };

  const renderSlider = ({ item }) => (
    <View style={LabScreenStyles.sliderCard}>
      <Text style={LabScreenStyles.sliderLabel}>{item.label}</Text>

      <Slider
        style={{ width: 180 }}
        minimumValue={item.min}
        maximumValue={item.max}
        value={settings[item.key]}
        onValueChange={(v) => updateSetting(item.key, v)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#333"
        thumbTintColor="#007AFF"
      />

      <Text style={LabScreenStyles.sliderValue}>
        {settings[item.key].toFixed(0)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={LabScreenStyles.container}>

      {/* HEADER */}
      <View style={LabScreenStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={LabScreenStyles.back}>←</Text>
        </TouchableOpacity>

        <Text style={LabScreenStyles.title}>EDITOR</Text>

        <TouchableOpacity onPress={resetSettings}>
          <Text style={LabScreenStyles.reset}>RESET</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE AREA */}
      <View style={LabScreenStyles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={LabScreenStyles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={[LabScreenStyles.image, getFilterStyle()]} />
          ) : (
            <Text style={LabScreenStyles.placeholder}>Tap to select image</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* SLIDER STRIP (Instagram style) */}
      <UiSupple
        settings={settings}
        updateSetting={updateSetting}
        resetSettings={resetSettings}
      />

      {/* DOCK */}
      <View style={LabScreenStyles.dock}>
        <TouchableOpacity style={LabScreenStyles.button} onPress={pickImage}>
          <Text style={LabScreenStyles.buttonText}>IMAGE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={LabScreenStyles.button} onPress={handleAnalyze}>
          {loading ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <Text style={LabScreenStyles.buttonText}>ANALYZE</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={LabScreenStyles.button} onPress={resetSettings}>
          <Text style={LabScreenStyles.buttonText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}