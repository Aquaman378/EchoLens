import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { UiSuppleStyles as styles } from './styles';

export default function UiSupple({ settings, updateSetting, resetSettings }) {
  
  const sliders = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
    { key: 'blur', label: 'Blur', min: 0, max: 20 },
  ];

  const renderSlider = ({ item }) => (
    <View style={styles.sliderCard}>
      <View style={styles.sliderHeader}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>
          {settings[item.key].toFixed(0)}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={item.min}
        maximumValue={item.max}
        value={settings[item.key]}
        onValueChange={(v) => updateSetting(item.key, v)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#333"
        thumbTintColor="#007AFF"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Adjust</Text>

        <TouchableOpacity onPress={resetSettings}>
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* HORIZONTAL SLIDERS */}
      <FlatList
        data={sliders}
        renderItem={renderSlider}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.sliderList}
      />
    </View>
  );
}