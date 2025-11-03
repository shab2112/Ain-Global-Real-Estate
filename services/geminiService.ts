import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import { SocialPlatform, ChatMessage } from '../types';
import { getKnownDevelopersAndProjects, getCampaignMetrics, getScheduledContent } from "./apiService";

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Pricing for gemini-2.5-flash in USD per 1 million tokens
const GEMINI_FLASH_INPUT_COST_PER_MILLION_TOKENS = 0.35;
const GEMINI_FLASH_OUTPUT_COST_PER_MILLION_TOKENS = 0.70;


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

export const generateText = async (prompt: string, platform: SocialPlatform, factsheetContent?: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const platformInstruction = getPlatformInstruction(platform);

  const contextInstruction = factsheetContent 
    ? `You MUST use the following project factsheet as your primary source of truth for this post: \n---BEGIN FACTSHEET---\n${factsheetContent}\n---END FACTSHEET---`
    : 'You should use your general knowledge of luxury real estate.';

  const fullPrompt = `You are an expert real estate marketer for Lucra Pro AI, a luxury real estate firm. 
Generate a compelling social media post for the ${platform} platform.
${contextInstruction}
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

const dataUrlToBlobParts = (dataUrl: string): { base64: string; mimeType: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64 = parts[1];
    return { base64, mimeType };
}

export const enhanceImage = async (originalImage: string, enhancementPrompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const { base64, mimeType } = dataUrlToBlobParts(originalImage);

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

export interface MarketReportResult {
    report: string;
    sources: any[];
    tokenCount?: number;
    cost?: number;
}

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
You are a world-class real estate market intelligence engine for Lucra Pro AI. Your task is to query trusted data sources, normalize metrics, and deliver a standardized, data-driven report.
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
        const usageMetadata = response.usageMetadata;
        const totalTokenCount = usageMetadata?.totalTokenCount;
        const promptTokenCount = usageMetadata?.promptTokenCount || 0;
        const candidatesTokenCount = usageMetadata?.candidatesTokenCount || 0;

        const inputCost = (promptTokenCount / 1000000) * GEMINI_FLASH_INPUT_COST_PER_MILLION_TOKENS;
        const outputCost = (candidatesTokenCount / 1000000) * GEMINI_FLASH_OUTPUT_COST_PER_MILLION_TOKENS;
        const totalCost = inputCost + outputCost;

        return {
            report: response.text,
            sources: groundingChunks,
            tokenCount: totalTokenCount,
            cost: totalCost,
        };
    } catch (error) {
        console.error("Error generating market report:", error);
        throw new Error("Failed to generate market report from AI. Please check the console for details.");
    }
};

export interface ExtractedClientData {
    name: string;
    email: string;
    phone: string;
}
  
export const extractClientFromCard = async (imageDataUrl: string): Promise<ExtractedClientData> => {
    const model = 'gemini-2.5-flash';
    const { base64, mimeType } = dataUrlToBlobParts(imageDataUrl);

    const prompt = `
        Analyze the following business card image. Perform OCR to extract the person's full name, their primary email address, and their primary phone number.
        Return the data ONLY as a valid JSON object. Do not include any other text or markdown formatting.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        data: base64,
                        mimeType: mimeType,
                    },
                },
            ],
            },
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

        // The response text should already be a JSON string due to the config
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ExtractedClientData;

    } catch (error) {
        console.error("Error extracting client data from card:", error);
        throw new Error("Failed to extract data from the business card. The image may be unclear or the format unsupported.");
    }
};

export const generateClientChatResponse = async (history: ChatMessage[]): Promise<ChatMessage> => {
    const model = 'gemini-2.5-flash';
    const internalData = await getKnownDevelopersAndProjects();

    const systemInstruction = `You are a sophisticated, friendly, and expert AI real estate advisor for Lucra Pro AI, a luxury real estate brokerage in Dubai. Your goal is to guide clients through a structured and helpful property search conversation.

Follow this multi-step process strictly:

1.  **Initial Analysis & Clarification:**
    *   When the user makes a request, first identify the key parameters they have provided: budget, handover date, specific location, property type (e.g., villa, apartment), and purchase type (off-plan or secondary).
    *   If ANY of these are missing, your IMMEDIATE next step is to ask clarifying questions to gather all the required information. For example: "That's a great start. To narrow down the options, could you let me know if you're looking for an apartment or a villa?" or "Are you interested in off-plan projects or secondary market properties?"
    *   DO NOT proceed until you have these details.

2.  **Location Logic:**
    *   If the user's query includes a proximity request like "near me" or "nearby" AND they have not specified another location, you must respond with the exact text: "To find properties near you, I need access to your current location. Would you be willing to share it?" DO NOT say anything else. This specific phrase will trigger the location service in the app.
    *   If the user has provided their location data (it will appear in a message starting with '(System Info: User location is...)'), use that information and ask for confirmation: "Thanks for sharing your location. Should I focus the search around your current area, or did you have another location in mind like Nad Al Sheba?"

3.  **Off-Plan Recommendation:**
    *   Once you have all the necessary information, if the user has not specified a preference for "secondary" properties, you should assume they are open to "off-plan".
    *   You MUST provide a brief, compelling pitch about the benefits of investing in off-plan projects, focusing on appreciation potential and securing properties in new, key areas.

4.  **Final Response - The Property Table:**
    *   After the off-plan pitch (if applicable), present the final property recommendations.
    *   The recommendations MUST ALWAYS be in a markdown table format.
    *   The table columns should include: 'Project Name', 'Developer', 'Property Type', 'Area (sq. ft.)', 'Price (AED)', 'Handover Date', and 'Key Features'.
    *   Provide at least 3-4 suitable, albeit hypothetical, project options based on the user's clarified criteria.

Your primary data sources for property information are your internal database of developers and projects.
Internal Reference Data: ${internalData}

Ground all other market-related answers in real-time data using the provided Google Search tool. Always be professional, courteous, and aim to provide insightful and accurate information.`;

    // Convert our ChatMessage[] to the format expected by the API
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
                role: 'user', // The overall prompt is from the user
                parts: contents.flatMap(c => c.parts)
            },
            config: {
                systemInstruction: systemInstruction,
                tools: [{googleSearch: {}}],
            },
        });
      
        // Check if the model is asking for location based on our specific instruction
        if (response.text.includes("To find properties near you, I need access to your current location.")) {
            return {
                role: 'model',
                content: response.text, // The model's question
                action: 'request_location', // The signal for the UI
            };
        }

        return {
            role: 'model',
            content: response.text,
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
        };
    } catch (error) {
        console.error("Error generating client chat response:", error);
        throw new Error("I'm sorry, I encountered an error trying to process your request. Please try again.");
    }
};


export const generateStaffChatResponse = async (history: ChatMessage[]): Promise<ChatMessage> => {
    const model = 'gemini-2.5-flash';
    // Fetch all necessary RAG data in parallel
    const [campaignData, contentData, propertyData] = await Promise.all([
        getCampaignMetrics(),
        getScheduledContent(),
        getKnownDevelopersAndProjects(),
    ]);

    const systemInstruction = `You are "Pro AI", an internal AI assistant for Lucra Pro AI, a luxury real estate brokerage. Your role is to provide quick, data-driven answers to staff members (Owners, Admins, and Property Advisors).

You have access to the following internal real-time data:
1.  **Campaign Metrics:** ${JSON.stringify(campaignData)}
2.  **Scheduled Content:** ${JSON.stringify(contentData)}
3.  **Property & Developer Data:** ${propertyData}

**Your Capabilities:**
-   You can answer questions about marketing campaign performance (e.g., "how many leads did we get last month?").
-   You can report on the content schedule (e.g., "what content is planned for this week?").
-   You can summarize key information about developers and projects.
-   You can perform analysis and generate summaries based on the provided data.
-   Use Google Search for any external information or current events not present in your internal data.

**Response Guidelines:**
-   Be concise and professional.
-   When providing data, present it clearly, using markdown tables if multiple items are involved.
-   Always state the source of your information (e.g., "According to the latest campaign metrics...").
-   If you cannot answer a question with the provided data, state that clearly. Do not invent information.`;

    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
                role: 'user',
                parts: contents.flatMap(c => c.parts)
            },
            config: {
                systemInstruction: systemInstruction,
                tools: [{googleSearch: {}}],
            },
        });

        return {
            role: 'model',
            content: response.text,
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
        };
    } catch (error) {
        console.error("Error generating staff chat response:", error);
        throw new Error("I'm sorry, I encountered an error trying to process your request. Please try again.");
    }
};
