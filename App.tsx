import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentStudio from './components/ContentStudio';
import MarketIntelligence from './components/MarketIntelligence';
import Clients from './components/Clients';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { View, User } from './types';
import { mockUsers } from './data/mockData';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.find(u => u.role === 'Owner')!);

  const renderContent = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard currentUser={currentUser} />;
      case View.ContentStudio:
        return <ContentStudio currentUser={currentUser} />;
      case View.MarketIntelligence:
        return <MarketIntelligence />;
      case View.Clients:
        return <Clients currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

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