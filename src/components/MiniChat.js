import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { askMiniChat } from '../services/gemini'; // This now calls the text-only function
import { MiniChatStyles as styles } from './styles';

export default function MiniChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const handleTask = async () => {
    if (!input.trim()) return;

    // 1. Prepare user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    // 2. Update UI immediately
    setChatHistory(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // 3. Call only the text-based service
      // We no longer pass an image URI or Base64 here
      const result = await askMiniChat(currentInput);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: result,
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      Alert.alert('Chat Error', 'The AI assistant is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatOverlay}
        >
          <View style={styles.chatHeader}>
            <View>
              <Text style={styles.chatHeaderText}>EchoLens AI Assistant</Text>
            </View>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            style={styles.chatBox}
          >
            {chatHistory.length === 0 && (
              <Text style={styles.welcomeText}>
                Hello! I'm your EchoLens assistant. How can I help you with your project today?
              </Text>
            )}

            {chatHistory.map(item => (
              <View
                key={item.id}
                style={[
                  styles.bubble,
                  item.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={
                    item.role === 'user' ? { color: '#fff' } : { color: '#000' }
                  }
                >
                  {item.text}
                </Text>
              </View>
            ))}

            {loading && (
              <View style={styles.aiBubble}>
                 <Text style={{ color: '#000', fontStyle: 'italic' }}>Thinking...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#666"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleTask}
              returnKeyType="send"
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>
          {isOpen ? '✕' : '🤖'}
        </Text>
      </TouchableOpacity>
    </>
  );
}