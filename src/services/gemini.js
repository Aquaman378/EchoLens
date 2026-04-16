import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

async function uriToBase64(uri) {
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  return await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function askGemini(prompt, imageUri = null) {
  let imagePart = null;

  if (imageUri) {
    try {
      const base64 = await uriToBase64(imageUri);
      imagePart = {
        inline_data: {
          mime_type: "image/jpeg",
          data: base64,
        },
      };
    } catch (e) {
      console.error("BASE64_CONVERSION_ERROR:", e);
    }
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              // 1. Image Data First
              ...(imagePart ? [imagePart] : []),
              // 2. Text Prompt Second
              {
                text: "System: Describe this photo's lighting and suggest professional edits. Answer this: " + prompt,
              },
            ],
          },
        ],
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    // If 2.5-flash still 404s (very rare), try 'gemini-1.5-flash' with the same 'v1' prefix.
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}