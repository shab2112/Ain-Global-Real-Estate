import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ChatMessage, Client, SocialPlatform, PropertyType } from '../types';

// FIX: Initialize the Gemini AI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const PRO_MODEL_NAME = 'gemini-2.5-pro';
const FLASH_MODEL_NAME = 'gemini-2.5-flash';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

export const generateMarketReport = async (
  primaryCity: string,
  comparisonCities: string[],
  selectedMetrics: string[]
) => {
  const prompt = `Generate a detailed market intelligence report comparing the luxury real estate market in ${primaryCity} with ${comparisonCities.join(', ')}. Focus on the following metrics: ${selectedMetrics.join(', ')}. Provide a concise summary for each city, a comparative table, and an overall investment outlook. Use markdown for formatting.`;

  // FIX: Use ai.models.generateContent with googleSearch tool.
  const response = await ai.models.generateContent({
    model: PRO_MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  // NOTE: Token and cost calculation is a simulation.
  const tokenCount = (response.text.length / 4); // Rough estimation
  const cost = (tokenCount / 1000) * 0.0025; // Example cost for a model

  return {
    report: response.text,
    sources,
    tokenCount,
    cost,
  };
};

export const extractClientFromCard = async (imageDataUrl: string): Promise<Partial<Client>> => {
  const base64Data = imageDataUrl.split(',')[1];

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: 'image/jpeg',
    },
  };

  const textPart = {
    text: "Extract the person's full name, email address, and phone number from this business card. Respond in JSON format.",
  };

  // FIX: Use ai.models.generateContent with responseSchema for JSON output.
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL_NAME,
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
        },
        required: ['name', 'email', 'phone'],
      },
    },
  });

  return JSON.parse(response.text);
};


export const generateClientChatResponse = async (history: ChatMessage[]): Promise<ChatMessage> => {
  const lastMessage = history[history.length - 1].content.toLowerCase();
  
  if (lastMessage.includes('nearby') || lastMessage.includes('around me') || lastMessage.includes('close to me')) {
      if (!history.some(m => m.content.includes('System Info: User location'))) {
        return {
          role: 'model',
          content: "To find properties near you, I'll need your current location. Can I access it?",
          action: 'request_location'
        };
      }
  }

  // FIX: Use ai.models.generateContent for chat responses.
  const response = await ai.models.generateContent({
    model: FLASH_MODEL_NAME,
    contents: `You are a helpful real estate assistant for Lockwood & Carter, serving high-net-worth clients interested in Dubai properties. Be polite, professional, and knowledgeable. Always include the company contact details (Phone: +971 56 4144401, Email: info@lockwoodandcarter.com, Website: https://www.lockwoodandcarter.com/) when appropriate, especially at the end of conversations. The user's message history is below. Provide a concise and helpful response to the latest message.\n\n${JSON.stringify(history)}`,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return { role: 'model', content: response.text, sources };
};

export const generateStaffChatResponse = async (history: ChatMessage[]): Promise<ChatMessage> => {
    // FIX: Use ai.models.generateContent for staff-facing chat.
    const response = await ai.models.generateContent({
        model: FLASH_MODEL_NAME,
        contents: `You are "Pro AI", an internal assistant for the real estate agency Lockwood & Carter. Staff will ask you about internal data like campaign performance, content schedules, and market data. Use the provided context to answer. Be direct and professional. The user's message history is below. Respond to the latest message.\n\n${JSON.stringify(history)}`,
        config: {
          tools: [{googleSearch: {}}],
        },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { role: 'model', content: response.text, sources };
};

export const generatePostCopy = async (
  masterPrompt: string,
  keywords: string,
  factsheet: string,
  platform: SocialPlatform,
  assetName?: string
): Promise<string> => {

  const fullPrompt = `
    ${masterPrompt}

    ---
    CONTEXT:
    Factsheet: ${factsheet}
    User Keywords: ${keywords}
    Target Platform: ${platform}
    ${assetName ? `Asset Name: ${assetName}` : ''}
    ---

    Generate the post copy now. Ensure it ends with the official company contact details:
    📞 Call us at +971 56 4144401
    📧 Email us at info@lockwoodandcarter.com
    🌐 Visit our website: https://www.lockwoodandcarter.com/
  `;

  // FIX: Use ai.models.generateContent for text generation.
  const response = await ai.models.generateContent({
    model: FLASH_MODEL_NAME,
    contents: fullPrompt,
  });

  return response.text;
};

export const enhanceImage = async (imageUrl: string, prompt: string): Promise<string> => {
  const base64Data = imageUrl.split(',')[1];
  const mimeType = imageUrl.match(/data:([^;]+);/)?.[1] || 'image/jpeg';

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };
  
  const textPart = { text: `Enhance this real estate photo based on the following instruction: "${prompt}". Return only the enhanced image.` };

  // FIX: Use ai.models.generateContent with responseModalities for image generation.
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL_NAME,
    contents: { parts: [imagePart, textPart] },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });
  
  const imageResponsePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
  if (imageResponsePart?.inlineData) {
      return `data:${imageResponsePart.inlineData.mimeType};base64,${imageResponsePart.inlineData.data}`;
  }
  throw new Error("AI did not return an enhanced image.");
};

export const generatePropertyValuation = async (
    propertyType: PropertyType,
    bedrooms: number,
    size: number,
    community: string
): Promise<{ valueRange: string; commentary: string }> => {
    const prompt = `Provide a realistic property valuation for a ${bedrooms}-bedroom ${propertyType} of ${size} sqft in the ${community} community of Dubai. 
    Use your knowledge of the current Dubai real estate market. 
    Respond in JSON format with two keys: "valueRange" (a string like "AED 2,500,000 - AED 2,750,000") and "commentary" (a brief 1-2 sentence explanation of the valuation).`;

    const response = await ai.models.generateContent({
        model: PRO_MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    valueRange: { type: Type.STRING },
                    commentary: { type: Type.STRING },
                },
                required: ['valueRange', 'commentary'],
            },
            tools: [{ googleSearch: {} }]
        },
    });

    return JSON.parse(response.text);
};


// This is a mock as we can't call external APIs.
export const generateVideoWithHeyGen = async (prompt: string, apiKey: string, imageUrl?: string): Promise<string> => {
    console.log("SIMULATING HeyGen Video Generation with prompt:", prompt, "and apiKey:", apiKey, "imageUrl:", imageUrl);
    return new Promise(resolve => {
        setTimeout(() => {
            // Return a placeholder video URL
            resolve("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4");
        }, 5000); // Simulate a 5-second generation time
    });
};