import { User, Client, UserRole, ContentPost } from '../types';
import { mockUsers, mockClients } from '../data/mockData';
import { mockScheduledPosts } from '../data/driveMockData';

// =================================================================
// NOTE: This is a placeholder API service.
// In a real application, these functions would make network requests
// (e.g., using `fetch` or `axios`) to a backend server.
// The backend server would then connect to the PostgreSQL database.
// =================================================================

// Simulate network delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

let inMemoryClients: Client[] = [...mockClients];
let inMemoryPosts: ContentPost[] = [...mockScheduledPosts];

/**
 * Fetches all users. In a real app, this would be an API call.
 */
export const getUsers = async (): Promise<User[]> => {
  await apiDelay(300);
  console.log("API_SERVICE: Fetched all users.");
  return mockUsers;
};

/**
 * Fetches all clients. In a real app, this would be GET /api/clients.
 */
export const getClients = async (): Promise<Client[]> => {
  await apiDelay(500);
  console.log("API_SERVICE: Fetched all clients.");
  // Return a copy to prevent direct mutation of the "database"
  return [...inMemoryClients];
};

/**
 * Creates a new client. In a real app, this would be POST /api/clients.
 * @param clientData - The data for the new client.
 * @returns The newly created client, including an ID from the backend.
 */
export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    await apiDelay(800);
    const newClient: Client = {
        id: `client_${Date.now()}`,
        ...clientData
    };
    inMemoryClients = [newClient, ...inMemoryClients];
    console.log("API_SERVICE: Created new client.", newClient);
    return newClient;
};


/**
 * SIMULATES fetching contextual data from a database for the RAG system.
 * In a real app, this would query your PostgreSQL DB.
 */
export const getKnownDevelopersAndProjects = async (): Promise<string> => {
    await apiDelay(100); // Simulate DB query latency
    console.log("API_SERVICE: Fetched contextual data for RAG system.");
    return `
      Key Developers: Emaar Properties, DAMAC Properties, Nakheel, Sobha Realty, Omniyat.
      Key Projects: Dubai Hills Estate (Emaar), DAMAC Lagoons (DAMAC), Palm Jumeirah (Nakheel), Sobha Hartland (Sobha), The Opus (Omniyat).
    `;
};

/**
 * SIMULATES fetching campaign metrics for the RAG system.
 */
export const getCampaignMetrics = async (): Promise<any> => {
    await apiDelay(150);
    console.log("API_SERVICE: Fetched campaign metrics for RAG.");
    return {
        lastMonth: {
            totalCampaigns: 5,
            totalSpend: "15,000 USD",
            leadsGenerated: 120,
            costPerLead: "125 USD",
            topPerformingCampaign: "Masaar Launch - Facebook",
        },
        thisMonth: {
            activeCampaigns: 3,
            currentSpend: "8,000 USD",
            leadsGenerated: 65,
        }
    };
}

/**
 * SIMULATES fetching scheduled content for the RAG system.
 */
export const getScheduledContent = async (): Promise<any> => {
    await apiDelay(150);
    console.log("API_SERVICE: Fetched scheduled content for RAG.");
    return [
        { date: "Monday", topic: "Video tour of Dubai Hills penthouse", platform: "YouTube, Instagram" },
        { date: "Wednesday", topic: "Blog post on 'Top 5 Family Communities in Dubai'", platform: "LinkedIn, Website" },
        { date: "Friday", topic: "Market update infographic for Q3", platform: "Facebook, LinkedIn" },
    ];
};


// === CONTENT STUDIO API ===

/**
 * Fetches all scheduled content posts.
 */
export const getScheduledPosts = async (): Promise<ContentPost[]> => {
    await apiDelay(500);
    console.log("API_SERVICE: Fetched all scheduled posts.");
    return [...inMemoryPosts];
};

/**
 * Creates a new content post.
 */
export const createContentPost = async (postData: Omit<ContentPost, 'id'>): Promise<ContentPost> => {
    await apiDelay(400);
    const newPost: ContentPost = {
        id: `post_${Date.now()}`,
        ...postData
    };
    // FIX: Replaced array mutation (.push) with an immutable update to ensure React change detection works reliably.
    inMemoryPosts = [newPost, ...inMemoryPosts];
    console.log("API_SERVICE: Created new content post.", newPost);
    return newPost;
};

/**
 * Updates an existing content post.
 */
export const updateContentPost = async (postId: string, updates: Partial<ContentPost>): Promise<ContentPost> => {
    await apiDelay(300);
    let updatedPost: ContentPost | undefined;
    inMemoryPosts = inMemoryPosts.map(post => {
        if (post.id === postId) {
            updatedPost = { ...post, ...updates };
            return updatedPost;
        }
        return post;
    });
    if (!updatedPost) {
        throw new Error("Post not found");
    }
    console.log("API_SERVICE: Updated content post.", updatedPost);
    return updatedPost;
};