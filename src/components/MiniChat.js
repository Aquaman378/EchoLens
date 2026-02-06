import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { askGemini } from '../services/gemini'; 

export default function MiniChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const handleTask = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: input };
    setChatHistory((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const result = await askGemini(currentInput);
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: result };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. THE CHAT WINDOW */}
      {isOpen && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.chatOverlay}
        >
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderText}>Assistant</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            style={styles.chatBox}
          >
            {chatHistory.map((item) => (
              <View
                key={item.id}
                style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}
              >
                <Text style={item.role === 'user' ? { color: '#fff' } : { color: '#000' }}>
                  {item.text}
                </Text>
              </View>
            ))}
            {loading && <Text style={styles.loadingText}>AI is thinking...</Text>}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleTask}
              returnKeyType="send"
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 2. THE BUTTON */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>{isOpen ? "✕" : "💬"}</Text>
      </TouchableOpacity>
    </>
  );
}

// Your styles are perfect as they are! 
const styles = StyleSheet.create({
  fabIcon: { color: 'white', fontSize: 28 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatOverlay: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 320,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  bubble: { padding: 12, borderRadius: 15, marginBottom: 10, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  chatHeader: { backgroundColor: '#007AFF', padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
  chatHeaderText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  chatBox: { flex: 1, padding: 15 },
  inputArea: { padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  input: { backgroundColor: '#f9f9f9', borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#ddd' },
  loadingText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginBottom: 10 },
});