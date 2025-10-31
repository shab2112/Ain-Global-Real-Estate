import React from 'react';
import { Client, User } from '../types';

interface ClientListProps {
  clients: Client[];
  users: User[];
}

const ClientList: React.FC<ClientListProps> = ({ clients, users }) => {
  const advisorMap = new Map(users.map(user => [user.id, user.name]));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="border-b border-brand-accent">
          <tr>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Name</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden md:table-cell">Email</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden lg:table-cell">Phone</th>
            <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Property Advisor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-accent">
          {clients.map(client => (
            <tr key={client.id} className="hover:bg-brand-accent/30 transition-colors">
              <td className="p-4 text-brand-text font-medium">{client.name}</td>
              <td className="p-4 text-brand-light hidden md:table-cell">{client.email}</td>
              <td className="p-4 text-brand-light hidden lg:table-cell">{client.phone}</td>
              <td className="p-4 text-brand-light">{advisorMap.get(client.propertyAdvisorId) || 'Unassigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;