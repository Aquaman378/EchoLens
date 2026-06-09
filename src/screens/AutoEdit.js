import React, { useState } from 'react';
import { View, Button, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { enhanceImage } from '../services/Bannana';

export default function AutoEdit() {
    const [status, setStatus] = useState('Idle');
    const [isProcessing, setIsProcessing] = useState(false);
    const [editedImages, setEditedImages] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set()); 
    const navigation = useNavigation();

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const toggleSelection = (index) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            newSelection.add(index);
        }
        setSelectedIds(newSelection);
    };

    const runBatchEnhance = async () => {
        try {
            if (!window.showDirectoryPicker) {
                setStatus('Browser not supported. Use Chrome or Edge.');
                return;
            }
            // This dialog will show folders, not files. Pick the folder and hit 'Select'.
            const dirHandle = await window.showDirectoryPicker();
            setIsProcessing(true);
            setEditedImages([]); 
            setSelectedIds(new Set());

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && /\.(jpe?g|png)$/i.test(entry.name)) {
                    setStatus(`Processing: ${entry.name}`);
                    const file = await entry.getFile();
                    const base64 = await toBase64(file);
                    
                    // Call your AI service
                    const enhancedUrl = await enhanceImage(base64, "cinematic");

                    if (enhancedUrl) {
                        setEditedImages(prev => [...prev, { name: entry.name, url: enhancedUrl }]);
                    }
                }
            }
            setStatus('Enhancement Complete! Select photos to save.');
            setIsProcessing(false);
        } catch (err) {
            console.error(err);
            setStatus('Error. Make sure to click "Allow" on the permission prompt.');
            setIsProcessing(false);
        }
    };

    const saveToBlueprint = () => {
        const photosToSave = editedImages.filter((_, index) => selectedIds.has(index));
        // This sends the selected array to your Blueprint screen
        navigation.navigate('Blueprint', { savedPhotos: photosToSave });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.statusText}>{status}</Text>
            
            {isProcessing && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />}

            <View style={styles.buttonContainer}>
                <Button title="1. Select Folder" onPress={runBatchEnhance} disabled={isProcessing} />
                <View style={{ height: 10 }} />
                <Button 
                    title={`2. Save ${selectedIds.size} Selected to Blueprint`} 
                    onPress={saveToBlueprint} 
                    disabled={isProcessing || selectedIds.size === 0} 
                    color="#2ecc71"
                />
            </View>

            <View style={styles.gallery}>
                {editedImages.map((img, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.imageCard, selectedIds.has(index) && styles.selectedCard]} 
                        onPress={() => toggleSelection(index)}
                    >
                        <Image source={{ uri: img.url }} style={styles.image} />
                        <View style={[styles.checkCircle, selectedIds.has(index) && styles.checkActive]} />
                        <Text style={styles.imageName} numberOfLines={1}>{img.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center' },
    statusText: { fontSize: 16, marginBottom: 15, fontWeight: 'bold' },
    buttonContainer: { width: '100%', maxWidth: 400, marginBottom: 20 },
    gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    imageCard: { 
        margin: 8, 
        padding: 5, 
        borderRadius: 10, 
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center'
    },
    selectedCard: { borderColor: '#2ecc71' },
    image: { width: 140, height: 140, borderRadius: 5, backgroundColor: '#f0f0f0' },
    imageName: { marginTop: 5, fontSize: 10, width: 140, textAlign: 'center' },
    checkCircle: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    checkActive: { backgroundColor: '#2ecc71' }
});