import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentStudio from './components/ContentStudio';
import MarketIntelligence from './components/MarketIntelligence';
import Clients from './components/Clients';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import { View, User, UserRole } from './types';
import { mockUsers } from './data/mockData';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>(View.Clients);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.find(u => u.role === 'Owner')!);

  const renderContent = () => {
    switch (activeView) {
      case View.ContentStudio:
        return <ContentStudio />;
      case View.MarketIntelligence:
        return <MarketIntelligence />;
      case View.Clients:
        return <Clients currentUser={currentUser} />;
      // Add other views here as they are built
      default:
        // Default to a view accessible by the current user or a dashboard
        return <Clients currentUser={currentUser} />;
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // If the user is a client, render the dedicated ClientDashboard
  if (currentUser.role === UserRole.Client) {
    return <ClientDashboard currentUser={currentUser} />;
  }

  // Otherwise, render the standard staff dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        allUsers={mockUsers} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;