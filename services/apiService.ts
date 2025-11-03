import { Client, ContentPost, Contract, PostStatus } from '../types';
import { mockClients } from '../data/mockData';
import { mockScheduledPosts } from '../data/driveMockData';
import { mockContracts } from '../data/contractsMockData';
import { driveData } from '../data/driveMockData';


// In-memory "database"
let clientsDB: Client[] = JSON.parse(JSON.stringify(mockClients));
let postsDB: ContentPost[] = JSON.parse(JSON.stringify(mockScheduledPosts));
let contractsDB: Contract[] = JSON.parse(JSON.stringify(mockContracts));

const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// === CLIENTS API ===
export const getClients = async (): Promise<Client[]> => {
    await apiDelay(300);
    console.log("SIMULATING: Fetched clients");
    return [...clientsDB];
};

export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    await apiDelay(500);
    const newClient: Client = {
        id: `client-${Date.now()}`,
        ...clientData
    };
    clientsDB.unshift(newClient);
    console.log("SIMULATING: Created new client", newClient);
    return newClient;
};

// === CONTENT API ===
export const getScheduledPosts = async (): Promise<ContentPost[]> => {
    await apiDelay(300);
    console.log("SIMULATING: Fetched scheduled posts");
    return [...postsDB];
};

export const createContentPost = async (postData: Omit<ContentPost, 'id'>): Promise<ContentPost> => {
    await apiDelay(500);
    const newPost: ContentPost = {
        id: `post-${Date.now()}`,
        ...postData,
    };
    postsDB.push(newPost);
    console.log("SIMULATING: Created new content post", newPost);
    return newPost;
};

export const updateContentPost = async (postId: string, updates: Partial<ContentPost>): Promise<ContentPost> => {
    await apiDelay(400);
    const postIndex = postsDB.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");
    postsDB[postIndex] = { ...postsDB[postIndex], ...updates };
    console.log(`SIMULATING: Updated post ${postId}`, postsDB[postIndex]);
    return postsDB[postIndex];
};


// === CONTRACTS API ===
export const getContracts = async (): Promise<Contract[]> => {
    await apiDelay(400);
    console.log("SIMULATING: Fetched contracts");
    return [...contractsDB];
};

export const createContract = async (contractData: Omit<Contract, 'id'>): Promise<Contract> => {
    await apiDelay(600);
    const newContract: Contract = {
        id: `contract-${Date.now()}`,
        ...contractData,
    };
    contractsDB.unshift(newContract);
    console.log("SIMULATING: Created new contract", newContract);
    return newContract;
};

// === STAFF CHAT TOOLS API ===
export const getKnownDevelopersAndProjects = async () => {
    await apiDelay(200);
    return driveData.map(p => ({ developer: p.developer, project: p.name }));
};

export const getCampaignMetrics = async () => {
    await apiDelay(200);
    return {
        totalSpend: 45000,
        totalLeads: 850,
        costPerLead: (45000 / 850).toFixed(2),
        period: "Last 30 days",
    };
};

export const getScheduledContent = async () => {
    await apiDelay(200);
    const upcoming = postsDB.filter(p => p.status !== PostStatus.Published && new Date(p.scheduledDate) > new Date());
    return upcoming.map(p => ({
        date: new Date(p.scheduledDate).toLocaleDateString(),
        platform: p.platform,
        project: driveData.find(proj => proj.id === p.projectId)?.name || 'Unknown',
        status: p.status,
    }));
};