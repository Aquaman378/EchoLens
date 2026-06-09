import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  SafeAreaView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { LabScreenStyles as styles } from '../components/styles';
import { askGemini } from '../services/gemini';
import { ERROR_MESSAGES } from '../config/constants';
import { Ionicons } from '@expo/vector-icons';

export default function LabScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [collection, setCollection] = useState([]);
  const [activeTab, setActiveTab] = useState('Light');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Expanded settings for pro-level control
  const [settings, setSettings] = useState({
    brightness: 100, contrast: 100, exposure: 100,
    saturation: 100, warmth: 0, blur: 0, sepia: 0,
    hue: 0, grayscale: 0, invert: 0
  });

  const tabs = [
    { id: 'Light', icon: 'sunny-outline' },
    { id: 'Color', icon: 'color-palette-outline' },
    { id: 'Effects', icon: 'sparkles-outline' },
    { id: 'Advanced', icon: 'options-outline' }
  ];

  const updateVal = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const resetSettings = () => setSettings({
    brightness: 100, contrast: 100, exposure: 100,
    saturation: 100, warmth: 0, blur: 0, sepia: 0,
    hue: 0, grayscale: 0, invert: 0
  });

  const getFilters = () => {
    if (Platform.OS !== 'web') return {};
    const { brightness, contrast, exposure, saturation, warmth, blur, sepia, hue, grayscale, invert } = settings;
    const filterStr = `
      brightness(${(brightness + exposure - 100) / 100}) 
      contrast(${contrast / 100}) 
      saturate(${saturation / 100}) 
      sepia(${sepia / 100}) 
      blur(${blur}px)
      hue-rotate(${warmth + hue}deg)
      grayscale(${grayscale / 100})
      invert(${invert / 100})
    `.replace(/\n/g, ' ');
    return { filter: filterStr, WebkitFilter: filterStr };
  };

  const handleCollect = () => {
    if (!image) return Alert.alert("EMPTY CANVAS", ERROR_MESSAGES.EMPTY_CANVAS);
    const newAsset = {
      id: Date.now().toString(),
      uri: image,
      filterStyle: getFilters(),
    };
    setCollection(prev => [...prev, newAsset]);
  };

  const renderSlider = (label, key, min, max, step = 1) => (
    <View style={styles.proSliderRow}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.proLabel}>{label.toUpperCase()}</Text>
        <Text style={[styles.proLabel, { color: '#007AFF' }]}>{Math.round(settings[key])}</Text>
      </View>
      <Slider
        style={{ height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={settings[key]}
        onValueChange={(v) => updateVal(key, v)}
        minimumTrackTintColor="#007AFF"
        thumbTintColor="#FFF"
      />
    </View>
  );

  const goHome = () => {
    navigation.navigate('Home');
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      Alert.alert("ERROR", ERROR_MESSAGES.NO_IMAGE);
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const analysis = await askGemini("Extract metadata and describe this photo.", image);
      navigation.navigate("Blueprint", { photos: collection, analysis });
    } catch (err) {
      Alert.alert("AI_FAILURE", err.message || ERROR_MESSAGES.AI_FAILURE);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.proContainer}>
      {/* HEADER */}
      <View style={styles.proHeader}>
        <Text style={styles.proTitle}>ECHOLENS <Text style={{ fontWeight: '300' }}>Raw Editor</Text></Text>
        <TouchableOpacity style={styles.navButton} onPress={goHome}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleCollect} style={{ marginRight: 20 }}>
            <Text style={{ color: '#888', fontSize: 10, fontWeight: 'bold' }}>Save Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Blueprint', { photos: collection })}>
            <Text style={styles.exportBtn}>BLUEPRINT ({collection.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.proMainLayout}>
        {/* SIDEBAR */}
        <View style={styles.proToolbar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.toolIcon, activeTab === tab.id && styles.toolActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons name={tab.icon} size={20} color={activeTab === tab.id ? '#007AFF' : '#555'} />
              <Text style={{ color: activeTab === tab.id ? '#007AFF' : '#444', fontSize: 7, marginTop: 4 }}>{tab.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CANVAS */}
        <View style={styles.proCanvas}>
          <TouchableOpacity onPress={handleImagePick} style={styles.proImageBox}>
            {image ? (
              <Image source={{ uri: image }} style={[styles.proImage, getFilters()]} resizeMode="contain" />
            ) : (
              <Text style={{ color: '#444', letterSpacing: 2 }}>+ IMPORT_RAW_ASSET</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* INSPECTOR PANEL */}
        <View style={styles.proInspector}>
          <Text style={styles.panelTitle}>{activeTab.toUpperCase()}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {activeTab === 'Light' && (
              <>
                {renderSlider("Exposure", "exposure", 0, 200)}
                {renderSlider("Contrast", "contrast", 50, 150)}
                {renderSlider("Brightness", "brightness", 0, 200)}
              </>
            )}

            {activeTab === 'Color' && (
              <>
                {renderSlider("Saturation", "saturation", 0, 200)}
                {renderSlider("Warmth", "warmth", -50, 50)}
                {renderSlider("Hue Shift", "hue", 0, 360)}
              </>
            )}

            {activeTab === 'Effects' && (
              <>
                {renderSlider("Blur", "blur", 0, 15)}
                {renderSlider("Sepia", "sepia", 0, 100)}
              </>
            )}

            {activeTab === 'Advanced' && (
              <>
                {renderSlider("Grayscale", "grayscale", 0, 100)}
                {renderSlider("Invert", "invert", 0, 100)}
                <TouchableOpacity onPress={resetSettings} style={{ marginTop: 20 }}>
                  <Text style={{ color: '#FF3B30', fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>RESET_ALL_CHANNELS</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          {/* AI ACTION */}
          <TouchableOpacity
            style={{ backgroundColor: '#111', padding: 15, borderRadius: 8, marginTop: 10 }}
            disabled={isAnalyzing}
            onPress={handleAnalyze}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 10, fontWeight: 'bold' }}>ANALYZE_WITH_GEMINI</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
