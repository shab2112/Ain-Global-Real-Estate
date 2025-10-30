
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { SocialPlatform } from '../types';

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getPlatformInstruction = (platform: SocialPlatform): string => {
  switch (platform) {
    case SocialPlatform.Facebook:
      return "The post should be engaging, use emojis, and include relevant hashtags. The tone should be aspirational and exciting.";
    case SocialPlatform.LinkedIn:
      return "The post must be professional and data-driven. Focus on investment potential and market trends. Avoid emojis and maintain a formal tone.";
    case SocialPlatform.YouTube:
      return "This is for a video description. It should be detailed and SEO-friendly. Include a summary, placeholder for key timestamps (e.g., 00:00 Introduction), and a call to action. Use relevant keywords.";
    default:
      return "The post should be well-written and engaging.";
  }
};

export const generateText = async (prompt: string, platform: SocialPlatform): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const platformInstruction = getPlatformInstruction(platform);
  const fullPrompt = `You are an expert real estate marketer for Ain Global, a luxury real estate firm. 
Generate a compelling social media post for the ${platform} platform.
**Platform Specific Instructions:** ${platformInstruction}
**Core Topic/Keywords:** ${prompt}
Generate only the text for the post body.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text from AI. Please check the console for details.");
  }
};

const dataUrlToBlob = (dataUrl: string): { base64: string; mimeType: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64 = parts[1];
    return { base64, mimeType };
}

export const enhanceImage = async (originalImage: string, enhancementPrompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const { base64, mimeType } = dataUrlToBlob(originalImage);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: enhancementPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in the AI response.");
        
    } catch (error) {
        console.error("Error enhancing image:", error);
        throw new Error("Failed to enhance image with AI. Please check the console for details.");
    }
};
