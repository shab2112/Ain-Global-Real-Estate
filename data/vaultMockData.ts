import { VaultDocument } from '../types';

export const mockVaultDocuments: VaultDocument[] = [
  {
    id: 'doc-1',
    clientId: 'client-user-1', // Arjun Gupta
    name: 'Passport Copy - A. Gupta.pdf',
    type: 'Passport',
    uploadDate: new Date('2023-11-15T10:00:00Z').toISOString(),
    url: '#',
  },
  {
    id: 'doc-2',
    clientId: 'client-user-1',
    name: 'SPA - Dubai Hills Estate Villa 12.pdf',
    type: 'SPA',
    uploadDate: new Date('2024-01-20T14:30:00Z').toISOString(),
    url: '#',
  },
  {
    id: 'doc-3',
    clientId: 'client-user-1',
    name: 'KYC Documents (Utility Bill).pdf',
    type: 'KYC',
    uploadDate: new Date('2023-11-15T10:05:00Z').toISOString(),
    url: '#',
  },
  {
    id: 'doc-4',
    clientId: 'client-user-2', // Elena Voronina
    name: 'Title Deed - Marina Apt 4501.pdf',
    type: 'Title Deed',
    uploadDate: new Date('2022-08-01T09:00:00Z').toISOString(),
    url: '#',
  },
];
