import axios from "axios";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function askGemini(prompt) {
    const apiKey = GEMINI_API_KEY;
    
    if (!apiKey) {
        alert("CRITICAL ERROR: API Key is undefined!");
        return "Error: No API Key";
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{
                            // This tells the AI HOW to format the math before it answers
                            text: "System: Use plain text and unicode math symbols only (±, √, ², ³, π, θ, ÷, *). Never use LaTeX, $, or * signs. Answer this: " + prompt
                        }]
                    }
                ]
            },
            { 
                headers: { "Content-Type": "application/json" },
                timeout: 35000 
            }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Gemini returned empty text");
        console.log("Gemini response:", text);

        //Clean up: removes the asterisk multiplication symbols if any remain
        const cleanedText = text.replace(/\*/g, '');
        return cleanedText;

    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error("API FAILURE:", errorMsg);
        alert("API FAILURE: " + errorMsg);
        throw error;
    }
}