import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Client, UserRole } from '../types';
import { extractClientFromCard } from '../services/geminiService';
import { saveToGoogleDrive } from '../services/googleDriveService';
import { getClients, createClient } from '../services/apiService';
import ClientList from './ClientList';
import { UsersIcon } from './icons/UsersIcon';
import { ScanIcon } from './icons/ScanIcon';
import { mockUsers } from '../data/mockData'; // User data can still be mock for now

interface ClientsProps {
  currentUser: User;
}

const Clients: React.FC<ClientsProps> = ({ currentUser }) => {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoadingClients(true);
        const clientsFromApi = await getClients();
        setAllClients(clientsFromApi);
      } catch (err) {
        setError("Failed to load client data.");
      } finally {
        setIsLoadingClients(false);
      }
    };
    loadClients();
  }, []);

  const visibleClients = useMemo(() => {
    let filteredClients: Client[];

    if (currentUser.role === UserRole.Owner || currentUser.role === UserRole.Admin) {
      filteredClients = allClients;
    } else if (currentUser.role === UserRole.PropertyAdvisor) {
      filteredClients = allClients.filter(client => client.propertyAdvisorId === currentUser.id);
    } else {
      filteredClients = [];
    }

    if (!searchTerm) return filteredClients;
    return filteredClients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentUser, searchTerm, allClients]);
  
  const handleCardUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setError(null);

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageDataUrl = reader.result as string;
            
            const extractedData = await extractClientFromCard(imageDataUrl);
            const driveId = await saveToGoogleDrive(imageDataUrl);

            const newClientData = {
                ...extractedData,
                propertyAdvisorId: currentUser.id,
                cardDriveId: driveId,
            };
            
            const newlyCreatedClient = await createClient(newClientData);
            setAllClients(prevClients => [newlyCreatedClient, ...prevClients]);
        };
        reader.readAsDataURL(file);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during card processing.');
        console.error(err);
    } finally {
        setIsExtracting(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddClientClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UsersIcon className="w-8 h-8 text-brand-gold" />
          <h2 className="text-2xl font-bold text-brand-text">Client Registry</h2>
        </div>
        <button
            onClick={handleAddClientClick}
            disabled={isExtracting}
            className="bg-brand-gold text-brand-primary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:bg-brand-accent disabled:cursor-not-allowed"
        >
            {isExtracting ? (
                <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-brand-primary rounded-full animate-spin"></div>
                    Processing...
                </>
            ) : (
                <>
                    <ScanIcon className="w-5 h-5" />
                    Add from Card
                </>
            )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleCardUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}
      
      <div className="bg-brand-secondary p-4 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-brand-primary border border-brand-accent rounded-md p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition text-brand-text"
        />
      </div>

      <div className="flex-1 bg-brand-secondary p-4 rounded-xl shadow-lg overflow-y-auto">
        {isLoadingClients ? (
             <div className="flex items-center justify-center h-full text-brand-light">
                <div className="w-8 h-8 border-4 border-t-transparent border-brand-gold rounded-full animate-spin"></div>
                <p className="ml-4">Loading Clients...</p>
            </div>
        ) : currentUser.role === UserRole.Client ? (
            <div className="flex items-center justify-center h-full text-brand-light">
                <p>Client-specific dashboard view coming soon.</p>
            </div>
        ) : visibleClients.length > 0 ? (
          <ClientList clients={visibleClients} users={mockUsers} />
        ) : (
          <div className="flex items-center justify-center h-full text-brand-light">
            <p>{searchTerm ? 'No clients match your search.' : 'You have no clients assigned.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;