import React from 'react';
import {
  View, Text, Image, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity, useWindowDimensions, image, Alert, Platform, Share
} from 'react-native';

import * as MediaLibrary from "expo-media-library";

export default function BlueprintScreen({ route, navigation }) {

  // Grab the photos + analysis passed from LabScreen
  const { photos = [], analysis = null } = route.params || {};
  const { width } = useWindowDimensions();

  // 2-column grid sizing
  const itemSize = (width - 60) / 2;

  const renderPhoto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        <Image
          source={{ uri: item.uri }}
          style={[styles.galleryImage, item.filterStyle]}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.filename}>ASSET_{item.id.slice(-4)}</Text>
        <Text style={styles.meta}>RENDER_COMPLETE</Text>
      </View>
    </View>
  );

  const displayPhoto = (uri) => {
    Alert.alert(
      "VIEW_IMAGE",
      "This would open the image in a full-screen viewer.",
      [{ text: "OK" }]
    );
  }

  const saveImage = async (uri) => {
    try {
      // Request device storage access permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        // Save image to media library
        await MediaLibrary.saveToLibraryAsync(uri);

        console.log("Image successfully saved");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← RETURN_TO_LAB</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>BLUEPRINT_V1</Text>

        <TouchableOpacity>
          <Text style={styles.shareBtn}>SHARE_COLLECTION</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => saveImage(item.uri)}>
          <Text style={styles.shareBtn}>SAVE_TO_DEVICE</Text>
        </TouchableOpacity>
      </View>

      {/* OPTIONAL: AI METADATA PANEL */}
      {analysis && (
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>AI ANALYSIS</Text>
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
      renderItem={({ item }) => (
          <TouchableOpacity onPress={() => displayPhoto(item.uri)} style={styles.imageFrame}>
            <Image source={{ uri: item.uri }} style={styles.galleryImage} />
          </TouchableOpacity>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backBtn: { color: '#888', fontSize: 12 },
  brand: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  shareBtn: { color: '#007AFF', fontSize: 12 },

  analysisBox: {
    backgroundColor: '#111',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8
  },
  analysisTitle: { color: '#0f0', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  analysisText: { color: '#ccc', fontSize: 12, lineHeight: 18 },

  row: { justifyContent: 'space-between', marginBottom: 20 },
  listContent: { padding: 20 },

  card: { width: '48%' },
  imageFrame: {
    backgroundColor: '#111',
    borderRadius: 10,
    overflow: 'hidden',
    height: 180
  },
  galleryImage: { width: '100%', height: '100%' },
  cardInfo: { marginTop: 6 },
  filename: { color: '#fff', fontSize: 12 },
  meta: { color: '#888', fontSize: 10 },

  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#555', fontSize: 14 },
  emptySub: { color: '#777', fontSize: 12, marginTop: 4 }
});
