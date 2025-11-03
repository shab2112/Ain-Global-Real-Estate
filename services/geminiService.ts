import { GoogleGenAI, Type, FunctionDeclaration, Part, Modality } from "@google/genai";
import { ChatMessage, MarketReportResult, GroundingChunk, Client } from '../types';
import { getCampaignMetrics, getKnownDevelopersAndProjects, getScheduledContent } from './apiService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketReport = async (
  primaryCity: string,
  comparisonCities: string[],
  selectedMetrics: string[]
): Promise<MarketReportResult> => {
  const prompt = `
    You are a senior real estate market analyst. Generate a detailed market intelligence report comparing ${primaryCity} with the following cities: ${comparisonCities.join(', ')}.
    Focus your analysis strictly on these metrics: ${selectedMetrics.join(', ')}.
    
    Structure the report in Markdown format. Start with a Level 1 Header (#) for the main title "Comparative Market Analysis: ${primaryCity}".
    For each city, use a Level 2 Header (##) with the city name.
    Under each city, use Level 3 Headers (###) for each of the selected metrics.
    Provide a concise, data-driven analysis for each metric. Use bullet points (-) for key takeaways.
    Conclude with a "## Key Takeaways" section summarizing the findings.
    
    Do not include any information or metrics not listed above. The report should be professional, objective, and easy to read.
    Always include a "For Inquiries" section at the very end with the following Lockwood & Carter contact details:
    - 📞 Call us at +971 56 4144401
    - 📧 Email us at info@lockwoodandcarter.com
    - 🌐 Visit our website: https://www.lockwoodandcarter.com/
  `;

  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const report = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { report, sources };
  } catch (error) {
    console.error("Error generating market report:", error);
    throw new Error("Failed to generate market report. Please check the API configuration.");
  }
};


export const extractClientFromCard = async (imageDataUrl: string): Promise<Omit<Client, 'id' | 'propertyAdvisorId'>> => {
    const base64Data = imageDataUrl.split(',')[1];

    const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
    };

    const textPart = {
        text: 'Extract the full name, email address, and phone number from the business card image. The name should not contain titles like Mr. or CEO.'
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
                    required: ["name", "email", "phone"],
                },
            },
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse;

    } catch (error) {
        console.error("Error extracting client from card:", error);
        throw new Error("Could not extract details from the business card. Please try a clearer image.");
    }
};

export const generatePostCopy = async (masterPrompt: string, keywords: string, factsheet: string, platform: string, selectedAsset?: string): Promise<string> => {
  const fullPrompt = `
    **MASTER PROMPT:**
    ---
    ${masterPrompt}
    ---
    
    **CONTEXT & DATA:**
    Here is the factsheet for the property/project:
    ---
    ${factsheet}
    ---
    ${selectedAsset ? `The selected visual asset is named: "${selectedAsset}". Refer to it if relevant.` : ''}

    **USER REQUEST:**
    - Platform: ${platform}
    - Keywords/Focus: "${keywords}"

    Based on all the information above, generate the social media post copy.
    Strictly append the following contact information at the end of every post, each on a new line:
    📞 Call us at +971 56 4144401
    📧 Email us at info@lockwoodandcarter.com
    🌐 Visit our website: https://www.lockwoodandcarter.com/
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            systemInstruction: 'You are a professional real estate social media manager for Lockwood & Carter, a luxury agency.'
        }
    });
    return response.text;
  } catch (error) {
      console.error("Error generating post copy:", error);
      throw new Error("Failed to generate post copy. Please try again.");
  }
};

export const enhanceImage = async (imageDataUrl: string, prompt: string): Promise<string> => {
    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(';')[0].split(':')[1];

    const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image was generated by the model.");

    } catch (error) {
        console.error("Error enhancing image:", error);
        throw new Error("Failed to enhance the image. The model may not support this request.");
    }
};

export const generateVideoWithHeyGen = async (prompt: string, apiKey: string, inputAssetUrl?: string): Promise<string> => {
    console.log("SIMULATING: Calling HeyGen API to generate video.");
    console.log("Prompt:", prompt);
    console.log("Input Asset:", inputAssetUrl || "None");
    
    if (!apiKey) {
        throw new Error("HeyGen API Key is required for video generation.");
    }
    
    // In a real application, this would be an actual fetch call to the HeyGen API.
    // The response handling would be based on HeyGen's documentation for long-running jobs.
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("SIMULATION: HeyGen video generation complete.");
            // Return a placeholder video URL
            resolve("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4");
        }, 8000); // Simulate an 8-second generation time
    });
};

export const generateClientChatResponse = async (history: ChatMessage[]): Promise<ChatMessage> => {
    const model = 'gemini-2.5-flash';

    const requestUserLocationDeclaration: FunctionDeclaration = {
        name: 'request_user_location',
        description: 'Asks the application to request the user\'s current geolocation when they ask for things "nearby", "close to me", or use other similar phrases, but have not provided a specific location.',
        parameters: { type: Type.OBJECT, properties: {} }
    };
    
    const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const systemInstruction = `You are a helpful and friendly real estate assistant for Lockwood & Carter, specializing in the Dubai market. Be professional, concise, and always aim to help the client. If the user asks for something nearby without specifying a location, you must use the 'request_user_location' tool. If asked, your contact details are: Call +971 56 4144401, Email info@lockwoodandcarter.com, or visit https://www.lockwoodandcarter.com/.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ functionDeclarations: [requestUserLocationDeclaration], googleMaps: {} }]
            }
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            if (response.functionCalls[0].name === 'request_user_location') {
                return {
                    role: 'model',
                    content: "Of course. To find what's nearby, I need to know your current location. Could you please allow location access when your browser prompts you?",
                    action: 'request_location'
                };
            }
        }

        return {
            role: 'model',
            content: response.text,
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [],
        };
    } catch (error) {
        console.error("Error in client chat response:", error);
        throw new Error("Sorry, I encountered an issue. Please try again.");
    }
};

export const generateStaffChatResponse = async (history: ChatMessage[]): Promise<ChatMessage> => {
    const model = 'gemini-2.5-flash';
    
    const tools: FunctionDeclaration[] = [
        {
            name: 'get_known_developers_and_projects',
            description: 'Retrieves a list of key real estate developers and their flagship projects.',
            parameters: { type: Type.OBJECT, properties: {} }
        },
        {
            name: 'get_campaign_metrics',
            description: 'Gets the latest marketing campaign performance metrics, such as spend, leads, and CPL.',
            parameters: { type: Type.OBJECT, properties: {} }
        },
        {
            name: 'get_scheduled_content',
            description: 'Fetches the upcoming social media and content schedule for the week.',
            parameters: { type: Type.OBJECT, properties: {} }
        }
    ];

    const systemInstruction = `You are Pro AI, an internal assistant for Lockwood & Carter real estate agency. You have access to internal company data through tools. Be professional and provide concise answers based on the data retrieved. When asked about developers, projects, campaign performance, or content schedules, you MUST use the provided tools to get the information.`;

    const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    try {
        let response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ functionDeclarations: tools }]
            }
        });
        
        if (response.functionCalls && response.functionCalls.length > 0) {
            const functionCall = response.functionCalls[0];
            let functionResponseData;

            if (functionCall.name === 'get_known_developers_and_projects') {
                functionResponseData = await getKnownDevelopersAndProjects();
            } else if (functionCall.name === 'get_campaign_metrics') {
                functionResponseData = await getCampaignMetrics();
            } else if (functionCall.name === 'get_scheduled_content') {
                functionResponseData = await getScheduledContent();
            } else {
                throw new Error(`Unknown function call: ${functionCall.name}`);
            }

            const functionResponsePart: Part = {
                functionResponse: {
                    name: functionCall.name,
                    response: { result: JSON.stringify(functionResponseData) },
                },
            };
            
            const secondResponse = await ai.models.generateContent({
                model: model,
                contents: [...contents, { role: 'model', parts: [{ functionCall: functionCall }]}, { role: 'user', parts: [functionResponsePart] }],
                 config: {
                    systemInstruction: systemInstruction,
                    tools: [{ functionDeclarations: tools }]
                }
            });
            response = secondResponse;
        }

        return {
            role: 'model',
            content: response.text
        };
    } catch (error) {
        console.error("Error in staff chat response:", error);
        throw new Error("Sorry, I encountered an issue while processing your request.");
    }
};