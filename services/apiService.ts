import { User, Client, UserRole } from '../types';
import { mockUsers, mockClients } from '../data/mockData';

// =================================================================
// NOTE: This is a placeholder API service.
// In a real application, these functions would make network requests
// (e.g., using `fetch` or `axios`) to a backend server.
// The backend server would then connect to the PostgreSQL database.
// =================================================================

// Simulate network delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

let inMemoryClients: Client[] = [...mockClients];

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


// Future functions for a real backend:
//
// export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<Client> => {
//   // In a real app: PUT /api/clients/{clientId}
// };
//
// export const deleteClient = async (clientId: string): Promise<void> => {
//   // In a real app: DELETE /api/clients/{clientId}
// };