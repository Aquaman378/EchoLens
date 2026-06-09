import React, { useState, useRef, useCallback } from 'react';
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
import { askMiniChat } from '../services/gemini';
import { MiniChatStyles as styles } from './styles';
import { ERROR_MESSAGES } from '../config/constants';

const MiniChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const handleTask = useCallback(async () => {
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
      // 3. Call the text-based service
      const result = await askMiniChat(currentInput);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: result,
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      Alert.alert('Chat Error', ERROR_MESSAGES.CHAT_ERROR);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

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
              editable={!loading}
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleChat}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>
          {isOpen ? '✕' : '🤖'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default React.memo(MiniChat);
