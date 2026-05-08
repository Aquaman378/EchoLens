import React, { useState } from 'react';
import { View, Button, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { editImage } from '../services/Bannana';

export default function AutoEdit() {
    const [status, setStatus] = useState('Idle');
    const [editedImages, setEditedImages] = useState([]); // 1. Added missing state
    const navigation = useNavigation();

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const runBatchEdit = async () => {
        try {
            if (!window.showDirectoryPicker) {
                setStatus('Browser not supported. Use Chrome.');
                return;
            }

            const dirHandle = await window.showDirectoryPicker();
            setStatus('Processing...');
            setEditedImages([]); // Clear previous results

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && /\.(jpe?g|png)$/i.test(entry.name)) {
                    const file = await entry.getFile();
                    const base64 = await toBase64(file);

                    // 2. Pass the base64 AND the edit prompt
                    const editedUrl = await editImage(base64, "Enhance lighting and make colors vibrant");

                    if (editedUrl) {
                        setEditedImages(prev => [...prev, { name: entry.name, url: editedUrl }]);
                    }
                }
            }
            setStatus('Finished!');
        } catch (err) {
            console.error(err);
            setStatus('Error selecting folder');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.statusText}>Status: {status}</Text>
            
            <View style={styles.buttonContainer}>
                <Button title="Select Folder & Auto-Edit" onPress={runBatchEdit} />
                <View style={{ height: 10 }} />
                <Button title="Go Back" onPress={() => navigation.goBack()} color="gray" />
            </View>

            {/* 3. Added Gallery View to see the results */}
            <View style={styles.gallery}>
                {editedImages.map((img, index) => (
                    <View key={index} style={styles.imageCard}>
                        <Image source={{ uri: img.url }} style={styles.image} />
                        <Text style={styles.imageName}>{img.name}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center' },
    statusText: { fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
    buttonContainer: { width: '100%', marginBottom: 30 },
    gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    imageCard: { margin: 10, alignItems: 'center' },
    image: { width: 150, height: 150, borderRadius: 10, backgroundColor: '#eee' },
    imageName: { marginTop: 5, fontSize: 12, color: '#666' }
});