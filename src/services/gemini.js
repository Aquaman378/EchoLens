import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { API_CONFIG, ERROR_MESSAGES, SYSTEM_PROMPTS } from "../config/constants";

/**
 * Validate API Key availability
 */
function validateApiKey() {
  if (!API_CONFIG.API_KEY) {
    console.error("API_KEY_ERROR: Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }
}

/**
 * TEXT-ONLY Chat for MiniChat
 * Uses the stable v1 endpoint for speed and reliability.
 */
export async function askMiniChat(prompt) {
  try {
    validateApiKey();

    const response = await axios.post(
      `${API_CONFIG.GEMINI_ENDPOINT}?key=${API_CONFIG.API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: SYSTEM_PROMPTS.MINI_CHAT + prompt,
              },
            ],
          },
        ],
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "I couldn't generate a response.";

  } catch (error) {
    console.error("MINICHAT_API_ERROR:", error.response?.data || error.message);
    return ERROR_MESSAGES.API_UNAVAILABLE;
  }
}

/**
 * Convert image URI to Base64
 */
async function uriToBase64(uri) {
  try {
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
  } catch (error) {
    console.error("BASE64_CONVERSION_ERROR:", error);
    throw error;
  }
}

/**
 * Analyze image with Gemini API
 */
export async function askGemini(prompt, imageUri = null) {
  let imagePart = null;

  try {
    validateApiKey();

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
        throw new Error(ERROR_MESSAGES.BASE64_CONVERSION_ERROR);
      }
    }

    const response = await axios.post(
      `${API_CONFIG.GEMINI_ENDPOINT}?key=${API_CONFIG.API_KEY}`,
      {
        contents: [
          {
            parts: [
              // 1. Image Data First
              ...(imagePart ? [imagePart] : []),
              // 2. Text Prompt Second
              {
                text: SYSTEM_PROMPTS.IMAGE_ANALYSIS + prompt,
              },
            ],
          },
        ],
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "I couldn't generate a response.";

  } catch (error) {
    console.error("GEMINI_API_ERROR:", error.response?.data || error.message);
    throw error;
  }
}
