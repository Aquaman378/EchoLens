import { OpenAI } from "openai";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export async function editImage(base64Image: string, prompt: string) {
  try {
    const response = await fetch('https://api.aimlapi.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/nano-banana-pro-edit',
        image: base64Image, // Ensure this is just the base64 string
        prompt: prompt,
      }),
    });


    const data = await response.json();
    console.log("AI Edit Response:", data);
    return data.images?.[0]?.url || data.url || null;
  } catch (error) {
    console.error("AI Edit Error:", error);
    return null;
  }
}

