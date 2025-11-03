import { Contract, ContractStatus, ContractType } from '../types';
import { mockUsers } from './mockData';

const getDatePair = (): { startDate: string, expiryDate: string, status: ContractStatus } => {
    const start = new Date();
    start.setDate(start.getDate() - Math.floor(Math.random() * 365));
    
    const expiry = new Date(start);
    expiry.setFullYear(start.getFullYear() + 1);

    const now = new Date();
    const status = now > expiry ? ContractStatus.Expired : ContractStatus.Signed;

    return {
        startDate: start.toISOString(),
        expiryDate: expiry.toISOString(),
        status: Math.random() > 0.2 ? status : ContractStatus.Draft, // Randomly assign some as draft
    };
};


export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    partyName: 'Emaar Properties',
    type: ContractType.AgencyAgreement,
    ...getDatePair(),
    documentUrl: 'https://docs.google.com/document/d/example1',
    createdBy: mockUsers[2].id, // Liam Chen
  },
  {
    id: 'contract-2',
    partyName: 'John Smith (Seller)',
    type: ContractType.SellerToAgent,
    ...getDatePair(),
    documentUrl: 'https://docs.google.com/document/d/example2',
    createdBy: mockUsers[3].id, // Sophia Petrova
  },
  {
    id: 'contract-3',
    partyName: 'Jane Doe (Buyer)',
    type: ContractType.BuyerToAgent,
    ...getDatePair(),
    documentUrl: 'https://docs.google.com/document/d/example3',
    createdBy: mockUsers[4].id, // David Rodriguez
  },
  {
    id: 'contract-4',
    partyName: 'Prime Properties LLC',
    type: ContractType.AgentToAgent,
    ...getDatePair(),
    documentUrl: 'https://docs.google.com/document/d/example4',
    createdBy: mockUsers[2].id,
  },
  {
    id: 'contract-5',
    partyName: 'DAMAC Properties',
    type: ContractType.AgencyAgreement,
    ...getDatePair(),
    documentUrl: 'https://docs.google.com/document/d/example5',
    createdBy: mockUsers[3].id,
  },
  {
    id: 'contract-6',
    partyName: 'Michael Brown (Buyer)',
    type: ContractType.BuyerToAgent,
    status: ContractStatus.Draft,
    startDate: new Date().toISOString(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    documentUrl: 'https://docs.google.com/document/d/example6',
    createdBy: mockUsers[4].id,
  },
];