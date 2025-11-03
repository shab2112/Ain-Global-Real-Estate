import React from 'react';
import { ClientView } from '../types';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { MortgageIcon } from './icons/MortgageIcon';
import { VaultIcon } from './icons/VaultIcon';

interface ClientSidebarProps {
  currentView: ClientView;
  setCurrentView: (view: ClientView) => void;
}

const navItems = [
    { id: ClientView.Valuation, label: 'Valuate My Home', icon: CalculatorIcon },
    { id: ClientView.Listings, label: 'My Listings', icon: BuildingIcon },
    { id: ClientView.AI, label: 'Ask AI Assistant', icon: ChatBubbleIcon },
    { id: ClientView.Mortgage, label: 'Mortgage Calculator', icon: MortgageIcon },
    { id: ClientView.Vault, label: 'My Vault', icon: VaultIcon },
];

const ClientSidebar: React.FC<ClientSidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="bg-brand-secondary w-20 sm:w-72 flex-shrink-0 flex flex-col items-center sm:items-stretch border-r border-brand-accent">
      <nav className="p-4 space-y-3 mt-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors ${
              currentView === item.id
                ? 'bg-brand-accent text-brand-text font-bold'
                : 'text-brand-light hover:bg-brand-primary/50 hover:text-brand-text'
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ClientSidebar;