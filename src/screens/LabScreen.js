import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  SafeAreaView, Platform, ScrollView, Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { LabScreenStyles as styles } from '../components/styles';
import { askGemini } from '../services/gemini';

import { Ionicons } from '@expo/vector-icons';

export default function LabScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [collection, setCollection] = useState([]);
  const [activeTab, setActiveTab] = useState('Light');
  const [settings, setSettings] = useState({
    brightness: 100, contrast: 100, exposure: 100,
    saturation: 100, warmth: 0, blur: 0, sepia: 0
  });

  const tabs = [
    { id: 'Light', icon: 'sunny-outline' },
    { id: 'Color', icon: 'color-palette-outline' },
    { id: 'Effects', icon: 'sparkles-outline' }
  ];

  const updateVal = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const getFilters = () => {
    if (Platform.OS !== 'web') return {};
    const { brightness, contrast, exposure, saturation, warmth, blur, sepia } = settings;
    const filterStr = `
      brightness(${(brightness + exposure - 100) / 100}) 
      contrast(${contrast / 100}) 
      saturate(${saturation / 100}) 
      sepia(${sepia / 100}) 
      blur(${blur}px)
      hue-rotate(${warmth}deg)
    `.replace(/\n/g, ' ');
    return { filter: filterStr, WebkitFilter: filterStr };
  };

  const handleCollect = () => {
    if (!image) return alert("IMPORT AN ASSET FIRST");
    const newAsset = {
      id: Date.now().toString(),
      uri: image,
      filterStyle: getFilters(), // Save the CSS string for rendering
    };
    setCollection(prev => [...prev, newAsset]);
  };

  const renderSlider = (label, key, min, max) => (
    <View style={styles.proSliderRow}>
      <Text style={styles.proLabel}>{label.toUpperCase()}</Text>
      <Slider
        style={{ height: 40 }}
        minimumValue={min}
        maximumValue={max}
        value={settings[key]}
        onValueChange={(v) => updateVal(key, v)}
        minimumTrackTintColor="#007AFF"
        thumbTintColor="#FFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.proContainer}>
      <View style={styles.proHeader}>
        <Text style={styles.proTitle}>ECHOLENS <Text style={{ fontWeight: '300' }}>RAW_EDITOR</Text></Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleCollect} style={{ marginRight: 20 }}>
            <Text style={{ color: '#888', fontSize: 10, fontWeight: 'bold' }}>COLLECT_EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Blueprint', { photos: collection })}>
            <Text style={styles.exportBtn}>BLUEPRINT ({collection.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.proMainLayout}>
        <View style={styles.proToolbar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.toolIcon, activeTab === tab.id && styles.toolActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={activeTab === tab.id ? '#007AFF' : '#555'}
              />

              <Text style={{ color: activeTab === tab.id ? '#007AFF' : '#444', fontSize: 8, marginTop: 4 }}>{tab.id[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.proCanvas}>
          <TouchableOpacity onPress={async () => {
            let r = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
            if (!r.canceled) setImage(r.assets[0].uri);
          }} style={styles.proImageBox}>
            {image ? <Image source={{ uri: image }} style={[styles.proImage, getFilters()]} /> : <Text style={{ color: '#444' }}>+ IMPORT_ASSET</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.proInspector}>
          <Text style={styles.panelTitle}>{activeTab.toUpperCase()}</Text>
          <ScrollView>
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
              </>
            )}

            {activeTab === 'Effects' && (
              <>
                {renderSlider("Blur", "blur", 0, 15)}
                {renderSlider("Sepia", "sepia", 0, 100)}
              </>
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={async () => {
              if (!image) return alert("IMPORT AN ASSET FIRST");

              try {
                const analysis = await askGemini(
                  "Extract metadata and describe this photo.",
                  image
                );

                navigation.navigate("Blueprint", {
                  photos: collection,
                  analysis
                });
              } catch (err) {
                console.log("ANALYZE ERROR:", err);
                alert("AI failed: " + err.message);
              }
            }}
          >
            <Text>ANALYZE PHOTO</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}