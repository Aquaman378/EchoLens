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
    const base64 = await uriToBase64(imageUri);

    imagePart = {
      inline_data: {
        mime_type: "image/jpeg",
        data: base64,
      },
    };
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
          {
            role: "user",
            parts: [
              ...(imagePart ? [imagePart] : []),
              {
                text:
                  "System: Use plain text and unicode math symbols only (±, √, ², ³, π, θ, ÷). Never use LaTeX. Answer this: " +
                  prompt,
              },
            ],
          },
        ],
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
}
