import React from 'react';
import { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CampaignIcon } from './icons/CampaignIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: View.Dashboard, name: 'Dashboard', icon: HomeIcon, disabled: false },
    { id: View.ContentStudio, name: 'Content Studio', icon: DocumentTextIcon, disabled: false },
    { id: View.Campaigns, name: 'Campaigns', icon: CampaignIcon, disabled: true },
    { id: View.MarketIntelligence, name: 'Market Intelligence', icon: ChartBarIcon, disabled: false },
    { id: View.Clients, name: 'Clients', icon: UsersIcon, disabled: false },
  ];

  return (
    <aside className="w-16 md:w-64 bg-brand-secondary p-2 md:p-4 transition-all duration-300 flex-shrink-0">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onNavigate(item.id)}
              disabled={item.disabled}
              className={`flex items-center p-3 rounded-lg transition-colors text-left w-full ${
                isActive
                  ? 'bg-brand-gold text-brand-primary font-bold'
                  : item.disabled
                  ? 'text-brand-light/50 cursor-not-allowed'
                  : 'text-brand-light hover:bg-brand-accent hover:text-brand-text'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="hidden md:inline ml-4">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;