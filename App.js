import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen.js';
import MiniChat from './src/components/MiniChat';
import LabScreen from './src/screens/LabScreen.js';

const Stack = createStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      {/* Move SafeAreaView INSIDE the container */}
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" />
        
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lab" component={LabScreen} />
        </Stack.Navigator>

        <MiniChat />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});