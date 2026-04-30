import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import MiniChat from './src/components/MiniChat';


// WEB HEIGHT FIX: Forces the browser to recognize the app's height
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    #root, body, html {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `;
  document.head.append(style);
}

export default function App() {
  return (
    <NavigationContainer>
      {/* Changed to View with flex: 1 for maximum compatibility */}
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Navigation - This will now fill the screen */}
        <AppNavigator />

        {/* Floating over everything */}
        <MiniChat />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Changed from 2 to 1
    backgroundColor: 'blue',
  },
});