import { Client, ContentPost, Contract, Listing, VaultDocument } from '../types';
import { mockClients } from '../data/mockData';
import { mockScheduledPosts } from '../data/driveMockData';
import { mockContracts } from '../data/contractsMockData';
import { mockListings } from '../data/listingsMockData';
import { mockVaultDocuments } from '../data/vaultMockData';

// Helper to simulate network latency
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- CLIENTS API ---
const getClientsFromStorage = (): Client[] => {
  const data = localStorage.getItem('clients');
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem('clients', JSON.stringify(mockClients));
  return mockClients;
};

export const getClients = async (): Promise<Client[]> => {
  await apiDelay(500);
  return getClientsFromStorage();
};

export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  await apiDelay(500);
  const clients = getClientsFromStorage();
  const newClient: Client = {
    id: `client_${Date.now()}`,
    ...clientData,
  };
  const updatedClients = [newClient, ...clients];
  localStorage.setItem('clients', JSON.stringify(updatedClients));
  return newClient;
};

// --- CONTENT POSTS API ---
const getPostsFromStorage = (): ContentPost[] => {
  const data = localStorage.getItem('posts');
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem('posts', JSON.stringify(mockScheduledPosts));
  return mockScheduledPosts;
};

export const getScheduledPosts = async (): Promise<ContentPost[]> => {
  await apiDelay(300);
  return getPostsFromStorage();
};

export const createContentPost = async (postData: Omit<ContentPost, 'id'>): Promise<ContentPost> => {
  await apiDelay(500);
  const posts = getPostsFromStorage();
  const newPost: ContentPost = {
    id: `post_${Date.now()}`,
    ...postData,
  };
  const updatedPosts = [...posts, newPost];
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
  return newPost;
};

export const updateContentPost = async (postId: string, updates: Partial<ContentPost>): Promise<ContentPost> => {
  await apiDelay(300);
  let posts = getPostsFromStorage();
  let updatedPost: ContentPost | undefined;
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      updatedPost = { ...post, ...updates };
      return updatedPost;
    }
    return post;
  });
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
  if (!updatedPost) throw new Error("Post not found");
  return updatedPost;
};


// --- CONTRACTS API ---
const getContractsFromStorage = (): Contract[] => {
    const data = localStorage.getItem('contracts');
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem('contracts', JSON.stringify(mockContracts));
    return mockContracts;
};
  
export const getContracts = async (): Promise<Contract[]> => {
    await apiDelay(700);
    return getContractsFromStorage();
};
  
export const createContract = async (contractData: Omit<Contract, 'id'>): Promise<Contract> => {
    await apiDelay(600);
    const contracts = getContractsFromStorage();
    const newContract: Contract = {
        id: `contract_${Date.now()}`,
        ...contractData,
    };
    const updatedContracts = [newContract, ...contracts];
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    return newContract;
};

// --- LISTINGS API ---
const getListingsFromStorage = (): Listing[] => {
    const data = localStorage.getItem('listings');
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem('listings', JSON.stringify(mockListings));
    return mockListings;
};

export const getListingsByClientId = async (clientId: string): Promise<Listing[]> => {
    await apiDelay(600);
    const listings = getListingsFromStorage();
    return listings.filter(l => l.clientId === clientId);
};

// --- VAULT API ---
const getVaultFromStorage = (): VaultDocument[] => {
    const data = localStorage.getItem('vault');
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem('vault', JSON.stringify(mockVaultDocuments));
    return mockVaultDocuments;
};

export const getVaultDocuments = async (clientId: string): Promise<VaultDocument[]> => {
    await apiDelay(400);
    const documents = getVaultFromStorage();
    return documents.filter(doc => doc.clientId === clientId);
};

export const uploadVaultDocument = async (docData: Omit<VaultDocument, 'id'>): Promise<VaultDocument> => {
    await apiDelay(800);
    const documents = getVaultFromStorage();
    const newDocument: VaultDocument = {
      id: `doc_${Date.now()}`,
      ...docData,
    };
    const updatedDocs = [newDocument, ...documents];
    localStorage.setItem('vault', JSON.stringify(updatedDocs));
    return newDocument;
};
