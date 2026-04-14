import React from 'react';
import { 
  View, Text, Image, FlatList, StyleSheet, 
  SafeAreaView, TouchableOpacity, useWindowDimensions 
} from 'react-native';

export default function BlueprintScreen({ route, navigation }) {
    <View style={{flex: 1, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}>
       <Text style={{color: 'white'}}>BLUEPRINT SCREEN LOADED</Text>
    </View>
  // Grab the photos array passed from LabScreen
  const { photos } = route.params || { photos: [] };
  const { width } = useWindowDimensions();
  
  // Calculate a 2-column grid with margins
  const itemSize = (width - 60) / 2;

  const renderPhoto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        <Image 
          source={{ uri: item.uri }} 
          style={[styles.galleryImage, item.filters]} 
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.filename}>ASSET_{item.id.slice(-4)}</Text>
        <Text style={styles.meta}>RENDER_COMPLETE</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* MINIMALIST HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← RETURN_TO_LAB</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>BLUEPRINT_V1</Text>
        <TouchableOpacity>
          <Text style={styles.shareBtn}>SHARE_COLLECTION</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.emptySub}>Collect edits in the Lab to populate this gallery.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}