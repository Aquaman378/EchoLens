import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity, useWindowDimensions, Alert, Share, Platform
} from 'react-native';
import * as MediaLibrary from "expo-media-library";

export default function BlueprintScreen({ route, navigation }) {
  const { photos = [], analysis = null } = route.params || {};
  const mainContainerRef = useRef(null);

  // FIX: Accessibility/Focus Error on Web
  useEffect(() => {
    if (Platform.OS === 'web' && mainContainerRef.current) {
      // Force focus to the new screen so the browser doesn't 
      // complain about focus being stuck on the hidden 'Lab' screen.
      mainContainerRef.current.focus();
    }
  }, []);

  const shareCollection = async () => {
    try {
      await Share.share({
        message: `Check out my EchoLens Blueprint! I have ${photos.length} edited assets ready.`,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const saveImage = async (uri) => {
    if (Platform.OS === 'web') {
      return Alert.alert("Web Notice", "Right-click the image to save on Web.");
    }

    try {
      // 1. Request Permissions
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        if (canAskAgain) {
          Alert.alert("Permission Required", "EchoLens needs access to your gallery to save photos.");
        } else {
          Alert.alert("Permission Denied", "Please enable storage permissions in your device settings.");
        }
        return;
      }

      // 2. The "Two-Step" Fix: Create Asset first, then Save
      // This is more stable for cached URIs
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.saveToLibraryAsync(asset);

      Alert.alert("SUCCESS", "Asset saved to your device gallery.");
    } catch (error) {
      console.error("SAVE_ERROR:", error);
      Alert.alert("SAVE_FAILED", "We couldn't write this file to your disk. Check if storage is full.");
    }
  };

  const renderPhoto = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Alert.alert("ASSET_PREVIEW", `ID: ${item.id}`)}
        style={styles.imageFrame}
      >
        <Image
          source={{ uri: item.uri }}
          style={[styles.galleryImage, item.filterStyle]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.cardInfo}>
        <Text style={styles.filename}>ASSET_{item.id.slice(-4)}</Text>
        <TouchableOpacity onPress={() => saveImage(item.uri)}>
          <Text style={styles.saveLink}>SAVE_DISK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      ref={mainContainerRef}
      style={styles.container}
      // Accessibility properties for Web
      {...(Platform.OS === 'web' ? { tabIndex: -1, accessibilityRole: 'main' } : {})}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← RETURN_LAB</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>BLUEPRINT_V1</Text>

        <TouchableOpacity onPress={shareCollection}>
          <Text style={styles.shareBtn}>SHARE_ALL</Text>
        </TouchableOpacity>
      </View>

      {/* AI METADATA PANEL */}
      {analysis && (
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>AI_INSIGHTS_REPORT</Text>
          <Text style={styles.analysisText}>{analysis}</Text>
        </View>
      )}

      {/* GALLERY GRID */}
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>NO_ASSETS_IN_BLUEPRINT</Text>
            <Text style={styles.emptySub}>
              Collect edits in the Lab to populate this gallery.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    // Outline: none is important for the Web focus fix
    ...Platform.select({ web: { outlineStyle: 'none' } })
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#111'
  },
  backBtn: { color: '#888', fontSize: 10, fontWeight: '700' },
  brand: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  shareBtn: { color: '#007AFF', fontSize: 10, fontWeight: 'bold' },

  analysisBox: {
    backgroundColor: '#0A0A0A',
    padding: 15,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#00FF99',
  },
  analysisTitle: { color: '#00FF99', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  analysisText: { color: '#888', fontSize: 11, lineHeight: 16 },

  row: { justifyContent: 'space-between', marginBottom: 15 },
  listContent: { padding: 16 },

  card: { width: '48%' },
  imageFrame: {
    backgroundColor: '#111',
    borderRadius: 2,
    overflow: 'hidden',
    height: 160,
  },
  galleryImage: { width: '100%', height: '100%' },
  cardInfo: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  filename: { color: '#666', fontSize: 9, fontWeight: 'bold' },
  saveLink: { color: '#007AFF', fontSize: 9, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#222', fontSize: 14, fontWeight: 'bold' },
  emptySub: { color: '#1A1A1A', fontSize: 12, marginTop: 4 }
});