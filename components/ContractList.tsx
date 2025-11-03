import React from 'react';
import { Contract, User, ContractStatus } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface ContractListProps {
  contracts: Contract[];
  users: User[];
}

const getStatusStyles = (status: string) => {
    switch (status) {
      case ContractStatus.Draft: return 'bg-gray-500/20 text-gray-300';
      case ContractStatus.Signed: return 'bg-green-500/20 text-green-300';
      case ContractStatus.Expired: return 'bg-red-500/20 text-red-300';
      default: return 'bg-brand-primary';
    }
};

const ContractList: React.FC<ContractListProps> = ({ contracts, users }) => {
  const userMap = new Map(users.map(user => [user.id, user.name]));

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="border-b border-brand-accent">
          <tr>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Developer/Client Name</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden md:table-cell">Type</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden lg:table-cell">Created By</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden sm:table-cell">Date Signed</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden sm:table-cell">Date Expiry</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Status</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Document</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-accent">
          {contracts.map(contract => (
            <tr key={contract.id} className="hover:bg-brand-accent/30 transition-colors">
              <td className="p-4 text-brand-text font-medium">{contract.partyName}</td>
              <td className="p-4 text-brand-light hidden md:table-cell">{contract.type}</td>
              <td className="p-4 text-brand-light hidden lg:table-cell">{userMap.get(contract.createdBy) || 'Unknown'}</td>
              <td className="p-4 text-brand-light hidden sm:table-cell">{formatDate(contract.startDate)}</td>
              <td className="p-4 text-brand-light hidden sm:table-cell">{formatDate(contract.expiryDate)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(contract.status)}`}>
                    {contract.status}
                </span>
              </td>
              <td className="p-4">
                <a
                  href={contract.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:text-yellow-400 transition-colors"
                  aria-label="View Document"
                >
                  <LinkIcon className="w-5 h-5" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;