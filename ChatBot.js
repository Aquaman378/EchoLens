import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, math } from 'react-native';
import { askGemini } from './gemini';

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Store list of messages
  const [loading, setLoading] = useState(false);

  // Fix 1: Ensure the name matches the Button call (handleTask)
  const handleTask = async () => {
    console.log("Button pressed!");
    if (!input.trim()) {
      alert("Please enter text first");
      return;
    }

    // Fix 2: Add the user's message to the chat history immediately
    const userMsg = { id: Date.now().toString(), role: 'user', text: input };
    setChatHistory(prev => [...prev, userMsg]);

    const currentInput = input;
    setInput(""); // Clear the input box
    setLoading(true);

    try {
      const result = await askGemini(currentInput);

      // Fix 3: Add the AI's response to the chat history array
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: result };
      setChatHistory(prev => [...prev, aiMsg]);

    } catch (err) {
      // This will now catch and show the error if gemini.js fails
      alert("Final Catch Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Echo Lens AI</Text>

          <ScrollView style={styles.chatBox}>
            {chatHistory.map((item) => (
              <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                {item.text.includes('$') ? (
                  <MathView
                    math={item.text}
                    style={styles.mathStyle}
                    // This allows the math to wrap or scale
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={item.role === 'user' ? { color: '#fff' } : { color: '#000' }}>
                    {item.text}
                  </Text>
                )}
              </View>
            ))}
            {loading && <Text style={styles.loading}>Thinking...</Text>}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput
              placeholder="Ask something..."
              value={input}
              onChangeText={setInput}
              style={styles.input}
              onSubmitEditing={handleTask} // Calls your function on Enter
              returnKeyType="send"         // Changes "Enter" to "Send" on the keyboard
            />
            <Button
              title={loading ? "..." : "Send"}
              onPress={handleTask}
              disabled={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: 'center' },
  chatBox: { flex: 1, marginBottom: 10 },
  bubble: { padding: 12, borderRadius: 10, marginBottom: 8, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0' },
  inputArea: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, padding: 10, borderRadius: 8, marginRight: 10, borderColor: '#ccc' },
  loading: { alignSelf: 'center', color: '#888', fontStyle: 'italic' }



  
});