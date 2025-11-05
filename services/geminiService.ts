import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ChatMessage, Client, SocialPlatform, PropertyType, MarketReportResult } from '../types';

// FIX: Initialize the Gemini AI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const PRO_MODEL_NAME = 'gemini-2.5-pro';
const FLASH_MODEL_NAME = 'gemini-2.5-flash';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

const cityDataSources: Record<string, string[]> = {
    'Dubai': ['Dubai Land Department (DLD)', 'Bayut', 'Property Finder', 'ValuStrat'],
    'Abu Dhabi': ['Abu Dhabi Department of Municipalities and Transport', 'Bayut', 'Property Finder', 'ValuStrat'],
    'London': ['UK Land Registry', 'Rightmove', 'Savills', 'Knight Frank', 'Zoopla'],
    'New York': ['NYC Open Data', 'Zillow', 'StreetEasy', 'CBRE', 'Cushman & Wakefield'],
    'Singapore': ['URA (Urban Redevelopment Authority)', 'Knight Frank', 'Savills'],
    'Tokyo': ['Ministry of Land, Infrastructure, Transport and Tourism (MLIT) Japan', 'REINS', 'CBRE', 'Jones Lang LaSalle'],
    'Sydney': ['CoreLogic', 'Domain', 'REA Group', 'Knight Frank'],
    'Paris': ['Notaires de France', 'INSEE', 'BNP Paribas Real Estate'],
    'Los Angeles': ['Zillow', 'Redfin', 'Multiple Listing Service (MLS)', 'CBRE', 'Cushman & Wakefield'],
    'Shanghai': ['CREIS', 'China Index Academy', 'Savills China', 'JLL'],
    'Mumbai': ['Maharashtra Real Estate Regulatory Authority (MahaRERA)', 'IGR Maharashtra'],
    'Delhi': ['Delhi Real Estate Regulatory Authority (RERA)', 'Delhi Development Authority (DDA)'],
    'Bangalore': ['Karnataka Real Estate Regulatory Authority (RERA Karnataka)', 'Kaveri Online Services'],
    'Chennai': ['Tamil Nadu Real Estate Regulatory Authority (TNRERA)', 'TCREGISNET'],
    'Hyderabad': ['Telangana State Real Estate Regulatory Authority (TSRERA)', 'IGRS Telangana'],
};

const globalDataSources = [
    "Knight Frank Global Cities Index", "CBRE Global Outlook", "Savills World Cities Report", "World Bank Economic Reports", "IMF World Economic Outlook"
];

const getDataSourcePrompt = (cities: string[]): string => {
    const sources = new Set<string>(globalDataSources);
    cities.forEach(city => {
        if (cityDataSources[city]) {
            cityDataSources[city].forEach(source => sources.add(source));
        }
    });
    return Array.from(sources).join(', ');
};

export const generateMarketReport = async (primaryCity: string, comparisonCities: string[], selectedMetrics: string[]): Promise<MarketReportResult> => {
    const model = 'gemini-2.5-flash';
    const allCities = [primaryCity, ...comparisonCities];
    const dataSourcePrompt = getDataSourcePrompt(allCities);

    const sourceInstruction = `
- **Primary Data Sources:** For your analysis, you must prioritize information from the trusted global and local sources listed for each city: ${dataSourcePrompt}.
- **Fallback Strategy (For ALL Cities):** Your primary goal is to use the official/local sources. However, if a specific data point is unavailable from these primary sources for any city, you may use other reputable global reports (like those from Knight Frank, CBRE, or Savills).
- **Mandatory Citation for Fallbacks:** When you use a fallback source, you MUST explicitly state that the information was not available through official channels and cite the source used. For example: "The current vacancy rate is 5.2% (Source: CBRE Global Outlook, as official data was not available for this period)." This transparency is critical.
`;
    
    const fullPrompt = `
You are a world-class real estate market intelligence engine for Ain Global. Your task is to query trusted data sources, normalize metrics, and deliver a standardized, data-driven report.
You MUST use the provided sources to ground your answers. All monetary values must be normalized to USD (e.g., price per square foot in USD).
When analyzing the "Currency Stability & Exchange Rate" metric, you must provide a clear comparison of the local currency's performance against the USD. For the most recent 12-month period, you MUST include the starting exchange rate, the current exchange rate, and the percentage of depreciation or appreciation. For example: "The Indian Rupee (INR) depreciated 5.45% against the USD over the last 12 months, moving from ~84.10 to ~88.67." Then, explicitly state the potential impact of this change on returns for a USD-based foreign investor.

**Report Request:**
1.  **Primary City for Analysis:** ${primaryCity}
2.  **Comparison Cities:** ${comparisonCities.join(', ')}
3.  **Metrics to Analyze:** ${selectedMetrics.join(', ')}

**Output Format and Structure for Visual Infographics (CRITICAL):**
- The entire output must be in well-structured markdown optimized for parsing.
- Start with a main heading: # Real Estate Market Intelligence Report — ${primaryCity}
- Follow with an "## Executive Summary" section for ${primaryCity}.
- For each metric category in the request (${selectedMetrics.join(', ')}), create a section with a level-2 heading (e.g., ## Pricing).
- Within each metric section, create a sub-section for each city using a level-3 heading that INCLUDES a trend emoji (e.g., ### Dubai 📈, ### London 📉, ### New York ➡️).
- Under each city's heading, list key data points as a bulleted list of bolded key-value pairs (e.g., - **Average Price/sq.ft:** $580 USD).
- Follow the bullet points with a brief, single-paragraph summary for that city.
- Conclude the report with a final section titled "## Investor Summary & Outlook".

**Data Sourcing Instructions:**
${sourceInstruction}`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        // NOTE: Token and cost calculation is a simulation.
        const tokenCount = (fullPrompt.length + response.text.length) / 4; // Rough estimation
        const cost = (tokenCount / 1000) * 0.0025; // Example cost for a model

        return {
            report: response.text,
            sources: groundingChunks,
            tokenCount: tokenCount,
            cost: cost,
        };
    } catch (error) {
        console.error("Error generating market report:", error);
        throw new Error("Failed to generate market report from AI. Please check the console for details.");
    }
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
  
  const prompt = `
You are an expert real estate AI assistant for Lockwood & Carter, a luxury real estate agency in Dubai serving high-net-worth clients. Your primary goal is to understand the client's needs by asking clarifying questions before providing recommendations. Be polite, professional, and knowledgeable.

**Interaction Rules:**
1.  **Ask Clarifying Questions:** If a client's request is vague (e.g., "I'm looking for a villa"), you MUST ask for more details to narrow down the options. Ask about things like:
    - Off-plan vs. Ready property.
    - Preferred communities or areas (e.g., Dubai Marina, Downtown, Palm Jumeirah).
    - Number of bedrooms.
    - Approximate budget.
    - Specific features (e.g., sea view, private pool, good for families).
2.  **Provide Information Concisely:** Once you have enough information, provide relevant property suggestions or market insights.
3.  **Provide Tabular Comparisons:** When a client asks to compare different projects or options, you MUST present the information in a clear, well-formatted markdown table. The table should include columns for "Project Name", "Unit Type", "Price (AED)", "Size (sqft)", "Price per sqft (AED)", "Handover Date", and "Key Amenities".
    
    **Example Table Format:**
    | Project Name      | Unit Type     | Price (AED) | Handover Date |
    |-------------------|---------------|-------------|---------------|
    | Elysian Mansions  | 5BR Villa     | 15,000,000  | Q4 2025       |
    | Sobha Hartland II | 2BR Apartment | 2,100,000   | Q2 2026       |

    Do not add extra separator lines (e.g., |---|---|) or empty rows in the table.

4.  **Contact Information:** ONLY provide contact details at the very end of the conversation when the client seems satisfied or asks how to proceed. When you do, provide ONLY the following and nothing more:
    Phone: +971 56 4144401
    Email: info@lockwoodandcarter.com
    DO NOT provide the website URL.

The user's message history is below. Provide an intelligent, helpful response to the latest message, following all the rules above.

---
Conversation History:
${JSON.stringify(history)}
---
`;

  // FIX: Use ai.models.generateContent for chat responses.
  const response = await ai.models.generateContent({
    model: FLASH_MODEL_NAME,
    contents: prompt,
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