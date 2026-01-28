import React, {useState} from 'react';
import {SafeAreaView, View, Text, TextInput, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {askGemini} from './gemini';

export default function App() {
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleTask = async () => {
        if (!input.trim()) return alert('Please enter text first');
        const userMsg = {id: Date.now().toString(), role: 'user', text: input};
        setChatHistory(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setLoading(true); 

        try {
            const result = await askGemini(currentInput);
            const aiMsg = {id: (Date.now() + 1).toString(), role: 'ai', text: result};
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (err) {
            alert('Final Catch Error: ' + err.message);
        } finally {
            setLoading(false);
        }  
    };
    
    return (
    <SafeAreaView style={styles.mainContainer}>
      {/* 1. THE "WEBSITE" CONTENT (Background) */}
      <ScrollView style={styles.websiteContent}>
        <Text style={styles.webTitle}>Welcome to My Awesome Site</Text>
        <Text style={styles.webBody}>
          This is where your main website content goes. It stays behind the AI.
          Imagine articles, images, or product listings here.
        </Text>
        {/* Add more filler text/content here to see the scroll */}
      </ScrollView>

      {/* 2. THE AI CHAT WINDOW (Conditionally Rendered) */}
      {isOpen && (
        <View style={styles.chatOverlay}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderText}>Gemini AI Assistant</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.chatBox}>
            {chatHistory.map((item) => (
              <View key={item.id} style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={item.role === 'user' ? { color: '#fff' } : { color: '#000' }}>{item.text}</Text>
              </View>
            ))}
            {loading && <Text style={styles.loading}>Thinking...</Text>}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput 
              style={styles.input} 
              placeholder="Ask me..." 
              value={input} 
              onChangeText={setInput}
              onSubmitEditing={handleTask}
            />
          </View>
        </View>
      )}

      {/* 3. THE FLOATING BUTTON (Always Visible) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.fabIcon}>{isOpen ? "✖" : "💬"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f4f4' },
  websiteContent: { padding: 20 },
  webTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  webBody: { fontSize: 16, color: '#666', lineHeight: 24 },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  fabIcon: { color: 'white', fontSize: 24 },

  // Chat Overlay Window
  chatOverlay: {
    position: 'absolute',
    bottom: 100, // Sits above the FAB
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    elevation: 10,
  },
  chatHeader: { 
    backgroundColor: '#007AFF', 
    padding: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  chatHeaderText: { color: 'white', fontWeight: 'bold' },
  chatBox: { flex: 1, padding: 10 },
  bubble: { padding: 10, borderRadius: 10, marginBottom: 5, maxWidth: '90%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#eee' },
  inputArea: { padding: 10, borderTopWidth: 1, borderColor: '#eee' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, height: 35 },
  loading: { fontSize: 12, fontStyle: 'italic', color: '#888', textAlign: 'center' }
});