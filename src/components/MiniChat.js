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
import { askGemini } from '../services/gemini';
import { MiniChatStyles as styles } from './styles';

export default function MiniChat({ image }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const handleTask = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };
    setChatHistory(prev => [...prev, userMsg]);

    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Send prompt + image URI (Gemini handles base64 internally)
      const result = await askGemini(currentInput, imageBase64);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: result,
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      Alert.alert('Chat Error', err.message || 'Something went wrong.');
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
              <Text style={styles.chatHeaderText}>AI Lab Assistant</Text>
              {image && (
                <Text style={{ color: '#ADFF2F', fontSize: 10 }}>
                  ● Analyzing active image
                </Text>
              )}
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
                Ask me to describe the photo, extract metadata, or suggest edits.
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
                    item.role === 'user'
                      ? { color: '#fff' }
                      : { color: '#000' }
                  }
                >
                  {item.text}
                </Text>
              </View>
            ))}

            {loading && (
              <Text style={styles.loadingText}>Gemini is thinking…</Text>
            )}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Ask about this photo..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleTask}
              returnKeyType="send"
            />
          </View>
        </KeyboardAvoidingView>
      )}

      <TouchableOpacity
        style={[styles.fab, image ? { backgroundColor: '#00FF99' } : {}]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Text style={[styles.fabIcon, image ? { color: '#000' } : {}]}>
          {isOpen ? '✕' : '🤖'}
        </Text>
      </TouchableOpacity>
    </>
  );
}
