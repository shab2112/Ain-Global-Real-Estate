import React, { useState, useEffect, useMemo } from 'react';
import { Contract, User, UserRole, ContractStatus } from '../types';
import { getContracts } from '../services/apiService';
import ContractList from './ContractList';
import AddContractModal from './AddContractModal';
import { ContractIcon } from './icons/ContractIcon';
import { PlusIcon } from './icons/PlusIcon';
import { mockUsers } from '../data/mockData';

interface ContractsProps {
  currentUser: User;
}

const Contracts: React.FC<ContractsProps> = ({ currentUser }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'All'>('All');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const contractsData = await getContracts();
      setContracts(contractsData);
      setError(null);
    } catch (err) {
      setError("Failed to load contracts data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleSaveContract = () => {
    // Refetch data to ensure list is up-to-date
    fetchData();
  };

  const visibleContracts = useMemo(() => {
    return contracts
      .filter(c => { // First, filter by user role
        if (currentUser.role === UserRole.Owner || currentUser.role === UserRole.Admin) {
            return true;
        }
        return c.createdBy === currentUser.id;
      })
      .filter(c => { // Then, filter by status
        if (statusFilter === 'All') {
            return true;
        }
        return c.status === statusFilter;
      });
  }, [contracts, currentUser, statusFilter]);
  
  const filterOptions: (ContractStatus | 'All')[] = ['All', ContractStatus.Draft, ContractStatus.Signed, ContractStatus.Expired];

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ContractIcon className="w-8 h-8 text-brand-gold" />
            <h2 className="text-2xl font-bold text-brand-text">Contracts Management</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-gold text-brand-primary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            New Contract
          </button>
        </div>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}

        {/* Filter Bar */}
        <div className="flex items-center gap-2 bg-brand-secondary p-2 rounded-lg">
            {filterOptions.map(option => (
                <button
                    key={option}
                    onClick={() => setStatusFilter(option)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        statusFilter === option ? 'bg-brand-gold text-brand-primary' : 'text-brand-light hover:bg-brand-accent hover:text-brand-text'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>

        <div className="flex-1 bg-brand-secondary p-4 rounded-xl shadow-lg overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-brand-light">
              <div className="w-8 h-8 border-4 border-t-transparent border-brand-gold rounded-full animate-spin"></div>
              <p className="ml-4">Loading Contracts...</p>
            </div>
          ) : visibleContracts.length > 0 ? (
            <ContractList contracts={visibleContracts} users={mockUsers} />
          ) : (
            <div className="flex items-center justify-center h-full text-brand-light">
              <p>No contracts match the current filter.</p>
            </div>
          )}
        </div>
      </div>
      
      <AddContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContract}
        currentUser={currentUser}
      />
    </>
  );
};

export default Contracts;