
import React from 'react';
import { User } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface DashboardProps {
  currentUser: User;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex items-center gap-4">
        <div className="bg-brand-primary p-3 rounded-lg">
            <Icon className="w-8 h-8 text-brand-gold" />
        </div>
        <div>
            <p className="text-sm text-brand-light font-medium">{title}</p>
            <p className="text-2xl font-bold text-brand-text">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-text">Welcome back, {currentUser.name}!</h1>
        <p className="text-brand-light mt-1">Here's a snapshot of your agency's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="New Leads This Month" value="42" icon={UsersIcon} />
        <StatCard title="Content Pieces Published" value="18" icon={DocumentTextIcon} />
        <StatCard title="Market Reports Generated" value="7" icon={ChartBarIcon} />
      </div>

      <div className="flex-1 bg-brand-secondary p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-brand-text mb-4">Activity Feed</h2>
        <div className="text-brand-light space-y-4">
            <p><span className="font-semibold text-brand-text">Fatima Al-Fahim</span> approved a new post for Dubai Hills Estate.</p>
            <p><span className="font-semibold text-brand-text">Liam Chen</span> added a new client: 'Aarav Sharma'.</p>
            <p><span className="font-semibold text-brand-text">You</span> generated a market report for 'Dubai vs. London'.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
