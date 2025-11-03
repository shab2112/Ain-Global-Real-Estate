import React, { useState } from 'react';
import { User, UserRole } from './types';
import { mockUsers } from './data/mockData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContentStudio from './components/ContentStudio';
import MarketIntelligence from './components/MarketIntelligence';
import Clients from './components/Clients';
import Contracts from './components/Contracts';
import MasterPrompts from './components/MasterPrompts';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[5]); // Default to Client
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.Client) {
        // Clients have a dedicated view, no sidebar navigation
    } else {
        // Default to dashboard for staff
        setCurrentView('dashboard');
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'content-studio':
        return <ContentStudio currentUser={currentUser} />;
      case 'market-intelligence':
        return <MarketIntelligence />;
      case 'clients':
        return <Clients currentUser={currentUser} />;
      case 'contracts':
        if (currentUser.role !== UserRole.Owner && currentUser.role !== UserRole.Admin) {
          // Redirect non-privileged users to the dashboard
          return <Dashboard currentUser={currentUser} />;
        }
        return <Contracts currentUser={currentUser} />;
      case 'master-prompts':
        if (currentUser.role !== UserRole.Owner && currentUser.role !== UserRole.Admin) {
          // Redirect non-privileged users to the dashboard
          return <Dashboard currentUser={currentUser} />;
        }
        return <MasterPrompts />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }
  
  if (currentUser.role === UserRole.Client) {
      return (
        <div className="h-screen w-screen bg-brand-primary text-brand-text flex flex-col">
            <Header currentUser={currentUser} setCurrentUser={handleSetCurrentUser} allUsers={mockUsers} />
            <ClientDashboard currentUser={currentUser} />
        </div>
      );
  }

  return (
    <div className="h-screen w-screen bg-brand-primary text-brand-text flex flex-col overflow-hidden">
      <Header currentUser={currentUser} setCurrentUser={handleSetCurrentUser} allUsers={mockUsers} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} currentUser={currentUser} />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default App;