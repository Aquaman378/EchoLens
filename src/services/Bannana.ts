// src/services/Bannana.ts

const API_KEY = process.env.EXPO_PUBLIC_STABILITY_API_KEY;

export async function enhanceImage(
  imageUri: string,
  enhancementType: string = "cinematic sports photography"
) {
  try {
    if (!API_KEY) {
      console.log("API KEY:", API_KEY);
      throw new Error("Missing Stability API Key");
    }

    // Convert URI -> Blob
    const imageResponse = await fetch(imageUri);
    const blob = await imageResponse.blob();

    // Build multipart form
    const formData = new FormData();

    formData.append("image", blob);

    formData.append(
      "prompt",
      `
      Enhance this sports image with:
      - sharp athletic detail
      - cinematic lighting
      - vibrant colors
      - realistic skin tones
      - professional photography look
      - improved clarity
      - dynamic contrast
      - ${enhancementType}
      `
    );

    formData.append("output_format", "png");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "image/*",
        },

        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Stability Error:", errorText);

      return null;
    }

    // Return edited image blob URL
    const editedBlob = await response.blob();

    return URL.createObjectURL(editedBlob);

  } catch (error) {
    console.error("Enhancement Error:", error);

    return null;
  }
}