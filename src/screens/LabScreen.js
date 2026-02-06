import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function LabScreen() {
  return (
    <View style={styles.container}>
      {/* 1. Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#007AFF', marginTop: 20 }}>← BACK TO SYSTEMS</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LABORATORY_01</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusText}>SYSTEM_ACTIVE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {/* 2. Primary Lens Display */}
        <View style={[styles.card, styles.largeCard]}>
          <Text style={styles.cardLabel}>PRIMARY_VISUALIZER</Text>
          <View style={styles.placeholderVisualizer}>
            {/* This is where we'd later put a 3D model or a Chart */}
            <Text style={styles.placeholderText}>SCANNING ECHOES...</Text>
          </View>
        </View>

        {/* 3. Small Metrics (Bento Style) */}
        <View style={styles.row}>
          <View style={[styles.card, styles.smallCard]}>
            <Text style={styles.cardLabel}>FREQUENCY</Text>
            <Text style={styles.metricValue}>432Hz</Text>
          </View>
          <View style={[styles.card, styles.smallCard]}>
            <Text style={styles.cardLabel}>LATENCY</Text>
            <Text style={styles.metricValue}>12ms</Text>
          </View>
        </View>

        {/* 4. AI Confidence Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>AI_CONFIDENCE_SCORE</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '94%' }]} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 40 },
  headerTitle: { color: '#007AFF', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  statusIndicator: { flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#333', fontSize: 10, fontWeight: 'bold' },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF41', marginRight: 6 },
  
  gridContainer: { paddingBottom: 100 },
  card: { backgroundColor: '#141414', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  largeCard: { height: 250, justifyContent: 'center' },
  cardLabel: { color: '#666', fontSize: 10, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  
  placeholderVisualizer: { flex: 1, backgroundColor: '#1c1c1c', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#444', fontSize: 12 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  smallCard: { width: '48%' },
  metricValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  progressBarBg: { height: 4, backgroundColor: '#222', borderRadius: 2, marginTop: 10 },
  progressBarFill: { height: 4, backgroundColor: '#007AFF', borderRadius: 2 },
  percentageText: { color: '#007AFF', textAlign: 'right', marginTop: 5, fontSize: 12, fontWeight: 'bold' },

  dock: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#1A1A1A', height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  dockButton: { padding: 10 },
  dockButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});