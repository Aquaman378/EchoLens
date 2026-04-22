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
    // 1. Updated to v1 (Stable) from v1beta
    // 2. Added -latest to the model name to ensure the 404 is resolved
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              ...(imagePart ? [imagePart] : []),
              {
                text: "System: Use plain text and unicode math symbols only. Never use LaTeX. Answer this: " + prompt,
              },
            ],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("EMPTY_AI_RESPONSE");
    
    return text.replace(/\*/g, ""); // Remove markdown bolding for cleaner UI

  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message;

    console.error(`AI_ERROR [${status}]:`, message);

    if (status === 404) alert("ERROR 404: Model not found. Check URL version.");
    if (status === 403) alert("ERROR 403: API Key issue. Check Google AI Studio.");
    
    throw error;
  }
}